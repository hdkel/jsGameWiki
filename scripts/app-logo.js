class AppLogo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["size", "alt", "show-text"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const size = this.getAttribute("size") || 42;
    const alt = this.getAttribute("alt") ?? "";
    const showText = this.hasAttribute("show-text");

    const style = `
      :host, * {
        box-sizing: border-box;
      }
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      img {
        width: ${size}px;
        height: ${size}px;
        display: block;
      }
      .text {
        display: ${showText ? "flex" : "none"};
        flex-direction: column;
        line-height: 1.1;
      }
      .note {
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #cfcfcf;
      }
      .title {
        font-size: 1.25rem;
        letter-spacing: 0.01em;
        color: #f5f5f5;
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <img src="/icons/logo.svg" alt="${alt}">
      <div class="text" aria-hidden="${!showText}">
        <span class="note">Mulberries'</span>
        <span class="title">Game Wiki</span>
      </div>
    `;
  }
}

customElements.define("app-logo", AppLogo);
