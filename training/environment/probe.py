"""Trainer environment probe for the DGX Spark (GB10, CUDA 13.0).

Runs the checks recorded as the startup check in `dependencies.md`: the
installed PyTorch is the cu130 build, the GB10 is visible to the accelerator,
and a forward plus backward step completes on the device. With `--manifest
PATH` it also writes the environment manifest that every run manifest
references by hash.

Usage:
    python training/environment/probe.py [--manifest training/environment/environment-manifest.json]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import subprocess
import sys
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]


def command_output(argv: list[str]) -> str:
    return subprocess.run(argv, capture_output=True, text=True, check=True).stdout.strip()


def system_facts() -> dict:
    cpu_model = ""
    for line in Path("/proc/cpuinfo").read_text(encoding="utf-8").splitlines():
        if line.startswith("model name") or line.startswith("CPU part"):
            cpu_model = line.split(":", 1)[1].strip()
            break
    meminfo = {}
    for line in Path("/proc/meminfo").read_text(encoding="utf-8").splitlines():
        key, _, value = line.partition(":")
        meminfo[key] = value.strip()
    # `nvidia-smi --query-gpu` has no cuda_version field on this driver, so the
    # runtime version is read from the header line of the plain report.
    cuda_runtime = ""
    for line in command_output(["nvidia-smi"]).splitlines():
        if "CUDA Version:" in line:
            cuda_runtime = line.split("CUDA Version:", 1)[1].split()[0]
            break
    return {
        "system": platform.system(),
        "machine": platform.machine(),
        "cpu_model": cpu_model,
        "cpu_count": os.cpu_count(),
        "memory_total": meminfo.get("MemTotal"),
        "python": platform.python_version(),
        "node": command_output(["node", "--version"]),
        "driver": command_output(["nvidia-smi", "--query-gpu=driver_version", "--format=csv,noheader"]),
        "cuda_runtime": cuda_runtime,
        "nvcc": command_output(["nvcc", "--version"]).splitlines()[-1].strip(),
    }


def torch_facts() -> tuple[dict, torch.Tensor]:
    import torch

    facts = {
        "torch": torch.__version__,
        "torch_cuda": torch.version.cuda,
        "device": torch.cuda.get_device_name(0),
        "capability": ".".join(str(part) for part in torch.cuda.get_device_capability(0)),
        "device_count": torch.cuda.device_count(),
        "cudnn": torch.backends.cudnn.version(),
    }
    # A forward and backward step on the device proves autograd executes on
    # the accelerator, not merely that the runtime recognizes it.
    weights = torch.randn(512, 512, device="cuda", dtype=torch.float32, requires_grad=True)
    loss = (weights @ weights).pow(2).mean()
    loss.backward()
    facts["loss"] = float(loss.detach().cpu())
    facts["gradient_sum"] = float(weights.grad.sum().cpu())
    facts["max_memory_allocated_bytes"] = int(torch.cuda.max_memory_allocated())
    return facts, weights


def trainer_facts() -> dict:
    import accelerate
    import huggingface_hub
    import peft
    import transformers

    return {
        "transformers": transformers.__version__,
        "accelerate": accelerate.__version__,
        "peft": peft.__version__,
        "huggingface_hub": huggingface_hub.__version__,
    }


def python_packages() -> dict:
    output = command_output([sys.executable, "-m", "pip", "freeze"])
    return {"lock_lines": len(output.splitlines())}


def triton_facts() -> dict:
    """The Triton driver build: the kernel path a real training step takes.

    A 2-D matmul does not exercise it; the batched attention kernels of a model
    forward do. Building the driver's C helper needs the CPython headers, so
    this check fails loudly when they are missing instead of at the first
    training step (see training/environment/train.sh).
    """
    import triton

    driver = triton.runtime.driver.active
    helper = driver.utils  # forces compile_module_from_file on the first call
    return {
        "triton": triton.__version__,
        "target": str(driver.get_current_target()),
        "helper": type(helper).__name__,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=None)
    arguments = parser.parse_args()

    facts, _ = torch_facts()
    try:
        triton = triton_facts()
    except Exception as failure:  # noqa: BLE001 - the message is the diagnosis
        print(f"error: the Triton driver failed to build: {failure}", file=sys.stderr)
        print("hint: run the trainer through training/environment/train.sh so CPATH points at the extracted CPython headers", file=sys.stderr)
        return 1
    manifest = {
        "probe_version": "1.1.0",
        "facts": system_facts(),
        "torch": facts,
        "triton": triton,
        "trainer": trainer_facts(),
        "environment": {
            "TRITON_PTXAS_PATH": os.environ.get("TRITON_PTXAS_PATH", ""),
            "CPATH": os.environ.get("CPATH", ""),
            "venv": str(Path(sys.prefix)),
        },
        "python_packages": python_packages(),
    }

    if manifest["facts"]["driver"] and not manifest["facts"]["driver"].startswith("5"):
        print(f"warning: unexpected driver version {manifest['facts']['driver']}", file=sys.stderr)
    if not str(facts["torch_cuda"]).startswith("13"):
        print(f"error: torch reports CUDA {facts['torch_cuda']}, expected a 13.x cu130 build", file=sys.stderr)
        return 1

    for section, values in (
        ("system", manifest["facts"]),
        ("torch", manifest["torch"]),
        ("triton", manifest["triton"]),
        ("trainer", manifest["trainer"]),
    ):
        print(f"[{section}]")
        for key, value in values.items():
            print(f"  {key}: {value}")

    if arguments.manifest is not None:
        arguments.manifest.parent.mkdir(parents=True, exist_ok=True)
        arguments.manifest.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        digest = hashlib.sha256(arguments.manifest.read_bytes()).hexdigest()
        print(f"manifest: {arguments.manifest} sha256={digest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
