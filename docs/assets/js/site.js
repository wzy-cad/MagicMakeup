function setupNavSpy() {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const targets = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !targets.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const currentFromScroll = () => {
    const offset = window.innerHeight * 0.35;
    let current = targets[0];
    targets.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) current = section;
    });
    setActive(current.id);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6]
      }
    );

    targets.forEach((section) => observer.observe(section));
  }

  window.addEventListener("scroll", currentFromScroll, { passive: true });
  window.addEventListener("hashchange", currentFromScroll);
  currentFromScroll();
}

function setupCompareTiles() {
  document.querySelectorAll("[data-compare-tile]").forEach((tile) => {
    const viewer = tile.querySelector("[data-compare-viewer]");
    const range = tile.querySelector("[data-compare-range]");
    const select = tile.querySelector("[data-method-select]");
    const after = tile.querySelector("[data-after-img]");
    const label = tile.querySelector("[data-after-label]");

    const updateSplit = () => {
      if (viewer && range) viewer.style.setProperty("--split", `${range.value}%`);
    };

    const updateMethod = () => {
      if (!select || !after) return;
      const option = select.selectedOptions[0];
      const src = option?.dataset.afterSrc;
      if (src) after.src = src;
      if (label) label.textContent = option.textContent.trim();
      after.alt = `${option.textContent.trim()} result`;
    };

    range?.addEventListener("input", updateSplit);
    select?.addEventListener("change", updateMethod);
    updateSplit();
    updateMethod();
  });
}

setupNavSpy();
setupCompareTiles();
