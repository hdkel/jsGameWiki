import "./app-logo.js";
import "./app-indicator.js";

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const style = `
      :host, * {
        box-sizing: border-box;
      }
      :host {
        display: block;
      }
      header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        background: #222222;
        color: #f5f5f5;
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #2b2b2b;
      }
      h1 {
        margin: 0;
      }
      app-indicator {
        margin-left: auto;
      }
      .brand {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .brand__logo {
        display: inline-flex;
      }
      @media (min-width: 900px) {
        .brand {
          display: none;
        }
      }
      .full-logo {
        display: none;
        align-items: center;
        gap: 8px;
        margin-right: 8px;
      }
      :host([data-show-logo-text]) .brand {
        justify-content: flex-start;
        display: flex;
      }
      :host([data-show-logo-text]) .brand__logo--mobile {
        display: none;
      }
      :host([data-show-logo-text]) .full-logo {
        display: inline-flex;
      }
      :host([data-show-logo-text]) .topbar__menu {
        display: none;
      }
      @media (min-width: 900px) {
        :host([data-show-logo-text]) .brand {
          display: flex;
        }
      }
      .topbar__menu {
        display: none;
        width: 44px;
        height: 44px;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      .icon-button {
        border: 1px solid #2b2b2b;
        background: #202020;
        color: #e6e6e6;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 120ms ease, border-color 120ms ease;
      }
      .icon-button:hover {
        background: #252525;
        border-color: #323232;
      }
      .icon-button:active {
        background: #1c1c1c;
      }
      @media (max-width: 899px) {
        .topbar__menu {
          display: inline-flex;
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <header class="topbar">
        <button class="icon-button topbar__menu" type="button" aria-label="Open menu">☰</button>
        <div class="brand" aria-label="Mulberries Game Wiki">
          <span class="full-logo">
            <app-logo size="42" alt="" show-text></app-logo>
          </span>
          <app-logo class="brand__logo brand__logo--mobile" size="42" alt=""></app-logo>
        </div>
        <app-indicator state="online"></app-indicator>
      </header>
    `;
  }

  get menuButton() {
    return this.shadowRoot.querySelector(".topbar__menu");
  }
}

customElements.define("app-header", AppHeader);
