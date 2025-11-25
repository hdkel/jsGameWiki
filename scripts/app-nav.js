import "./app-logo.js";

class AppNav extends HTMLElement {
  constructor() {
    super();
    this._rendered = false;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (this._rendered) return;
    this._rendered = true;
    this.render();
    this.bindEvents();
  }

  render() {
    const style = `
      :host, * {
        box-sizing: border-box;
      }
      :host {
        position: relative;
        display: block;
      }
      .sidebar__brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .sidebar__brand app-logo {
        display: inline-flex;
      }
      .sidebar {
        background: var(--nav-bg, #222222);
        border-right: 1px solid var(--nav-border, #2b2b2b);
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: sticky;
        top: 0;
        min-height: 100vh;
        color: var(--nav-text, #f5f5f5);
      }
      .sidebar__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .sidebar__title {
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .sidebar__body {
        flex: 1;
      }
      .sidebar__close {
        display: none;
      }
      .icon-button {
        border: 1px solid var(--button-border, #2b2b2b);
        background: var(--button-bg, #202020);
        color: var(--button-text, #e6e6e6);
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 120ms ease, border-color 120ms ease;
      }
      .icon-button:hover {
        background: var(--button-hover-bg, #252525);
        border-color: var(--button-hover-border, #323232);
      }
      .icon-button:active {
        background: var(--button-active-bg, #1c1c1c);
      }
      .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(2px);
        z-index: 9;
      }
      @media (max-width: 899px) {
        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(75vw, 320px);
          transform: translateX(-100%);
          transition: transform 180ms ease;
          z-index: 20;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.35);
        }
        .sidebar[data-open] {
          transform: translateX(0);
        }
        .sidebar__close {
          display: inline-flex;
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <nav class="sidebar" aria-label="Primary">
        <div class="sidebar__header">
          <div class="sidebar__brand">
            <app-logo size="44" alt="" show-text></app-logo>
          </div>
          <button class="icon-button sidebar__close" type="button" aria-label="Close menu">✕</button>
        </div>
        <div class="sidebar__body">
          <!-- Navigation items go here -->
        </div>
      </nav>
      <div class="backdrop" hidden part="backdrop"></div>
    `;

    this.sidebar = this.shadowRoot.querySelector(".sidebar");
    this.backdrop = this.shadowRoot.querySelector(".backdrop");
    this.closeBtn = this.shadowRoot.querySelector(".sidebar__close");
  }

  bindEvents() {
    this.closeBtn?.addEventListener("click", () => this.close());
    this.backdrop?.addEventListener("click", () => this.close());
  }

  open() {
    this.setOpenState(true);
  }

  close() {
    this.setOpenState(false);
  }

  resetDesktop() {
    // On desktop, ensure overlay is hidden and menu is not forced open/closed by mobile state.
    this.setOpenState(false);
  }

  setOpenState(isOpen) {
    this.sidebar?.toggleAttribute("data-open", isOpen);
    if (this.backdrop) this.backdrop.hidden = !isOpen;
    this.toggleAttribute("data-open", isOpen);
  }

  get isOpen() {
    return this.hasAttribute("data-open");
  }
}

customElements.define("app-nav", AppNav);
