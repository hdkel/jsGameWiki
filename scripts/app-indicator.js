const DEFAULT_STATE = "online";

class AppIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["state", "label"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const state = (this.getAttribute("state") || DEFAULT_STATE).toLowerCase();
    const label = this.getAttribute("label") || `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
    const color = state === "online" ? "#22d3ee" : "#f59e0b";

    const style = `
      :host, * {
        box-sizing: border-box;
      }
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        min-width: 44px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f5f5f5;
        font-size: 0.9rem;
        line-height: 1;
        height: 32px;
      }
      .pill .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${color};
      }
      .dot-only {
        display: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${color};
      }
      @media (max-width: 899px) {
        :host {
          width: 44px;
        }
        .pill {
          display: none;
        }
        .dot-only {
          display: inline-flex;
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="pill" role="status" aria-label="${label}">
        <span class="dot"></span>
        <span>${label}</span>
      </div>
      <span class="dot-only" role="status" aria-label="${label}"></span>
    `;
  }
}

customElements.define("app-indicator", AppIndicator);
