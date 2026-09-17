(function () {
  async function includePartials() {
    const targets = document.querySelectorAll('[data-include]');
    await Promise.all(
      Array.from(targets).map(async (target) => {
        const source = target.getAttribute('data-include');
        try {
          const response = await fetch(source);
          if (!response.ok) {
            throw new Error(`${response.status} while loading ${source}`);
          }
          target.innerHTML = await response.text();
        } catch (error) {
          target.innerHTML = `<p class="muted">Navigation could not be loaded from ${source}.</p>`;
          console.error(error);
        }
      })
    );

    if (!window.__sopLangNavReady) {
      window.__sopLangNavReady = true;
      setupNavigation();
    }
  }

  function setupNavigation() {
    const nav = document.getElementById('primary-nav');
    if (!nav) {
      return;
    }

    const items = Array.from(nav.querySelectorAll('.nav__item'));

    function closeAll(except) {
      items.forEach((item) => {
        if (item === except) {
          return;
        }
        item.classList.remove('is-open');
        const button = item.querySelector('.nav__button');
        if (button) {
          button.setAttribute('aria-expanded', 'false');
        }
      });
    }

    items.forEach((item) => {
      const button = item.querySelector('.nav__button');
      const panel = item.querySelector('.nav__panel');
      if (!button || !panel) {
        return;
      }

      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !item.classList.contains('is-open');
        closeAll(item);
        item.classList.toggle('is-open', willOpen);
        button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });

      button.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          item.classList.remove('is-open');
          button.setAttribute('aria-expanded', 'false');
          button.focus();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target)) {
        closeAll(null);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAll(null);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', includePartials);
  } else {
    includePartials();
  }
})();
