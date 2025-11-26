export function setupNavControls() {
  const nav = document.querySelector("app-nav");
  const header = document.querySelector("app-header");
  if (!nav || !header) return;

  const openNav = () => nav.open();
  header.menuButton?.addEventListener("click", openNav);

  const mq = window.matchMedia("(min-width: 900px)");
  const handleResize = (event) => {
    if (event.matches) nav.resetDesktop();
  };
  mq.addEventListener("change", handleResize);
  handleResize(mq);
}
