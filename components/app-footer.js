class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
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
            .footer {
              padding: 16px;
              color: #c9c9c9;
              text-align: center;
              margin-top: auto;
              background: #111;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <footer class="footer">
                Copyright © 2025 mulberries.ca
            </footer>
        `;
    }
}

customElements.define("app-footer", AppFooter);
