# Serving a checkpoint to the evaluation client

The evaluation client (`evaluation/client.mjs`) always talks to a locally served
GGUF artifact, never to the training checkpoint, so accuracy and latency are
measured on exactly the bytes that ship. Convert the Hugging Face checkpoint (or
the base model) to F16 GGUF with llama.cpp's converter, then serve it with
`llama-server`:

```bash
# Convert an HF checkpoint (or the base model) to GGUF, F16 for evaluation
python tools/llamacpp/convert_hf_to_gguf.py training/models/qwen2.5-coder-0.5b-instruct --outfile training/checkpoints/base-f16.gguf --outtype f16

# Serve it on the port the client defaults to
tools/llamacpp/build/bin/llama-server -m training/checkpoints/base-f16.gguf --port 8080 --ctx-size 8192 --n-gpu-layers 99 --jinja
```

`convert_hf_to_gguf.py` accepts any checkpoint directory saved in the
transformers layout (`config.json`, `tokenizer.json`, and the weight shards), so
the same command converts a downloaded base model and a fine-tuned checkpoint
written by the trainer; `--outtype f16` is the checkpoint-selection artifact,
while the deployment measurement later quantizes the selected F16 file with
`llama-quantize`.

The client speaks the server's OpenAI-compatible endpoint
(`POST http://127.0.0.1:8080/v1/chat/completions`) with plain Node `fetch` and
sends the raw role-separated messages of the chat profile, never a
pre-rendered prompt string: `llama-server` applies the model's own chat
template, taken from the GGUF metadata, to those messages, and with `--jinja`
it uses the template embedded in the converted model rather than a generic
fallback. That keeps the served rendering identical to the rendering the
trainer used, which is the property gate 3 of the overfit test checks. A
transport failure (connection refused, timeout, non-2xx, or a response without
a completion) is retried exactly once by the client; an empty completion after
that retry is recorded as `generation_transport_error`, so the server must be
running before an evaluation run starts.
