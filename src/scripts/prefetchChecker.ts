document.querySelectorAll("a[data-astro-prefetch]").forEach((link) => {
  link.addEventListener("pointerenter", () => {
    const anchorLink = link as HTMLAnchorElement;
  });
});
