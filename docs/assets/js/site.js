const assetPrefix = window.location.pathname.replace(/\/+$/, "").endsWith("/magicmakeup")
  ? "../assets/images/"
  : "assets/images/";

const asset = (filename) => `${assetPrefix}${filename}`;

const imageSets = {
  sceneA: {
    title: "Full-face transfer",
    reference: asset("teaser.png"),
    note: "Synthetic benchmark, 1024 x 1024.",
    images: {
      source: asset("teaser.png"),
      shmt: asset("comparison.png"),
      mad: asset("supp-comparison.png"),
      stable: asset("full-face-transfer.png"),
      flux: asset("ablation.png"),
      ours: asset("region-transfer.png")
    }
  },
  sceneB: {
    title: "Eye makeup transfer",
    reference: asset("region-transfer.png"),
    note: "Region-specific transfer with non-edited areas preserved.",
    images: {
      source: asset("region-transfer.png"),
      shmt: asset("comparison.png"),
      mad: asset("ablation.png"),
      stable: asset("challenges.png"),
      flux: asset("full-face-transfer.png"),
      ours: asset("region-transfer.png")
    }
  },
  sceneC: {
    title: "Ablation view",
    reference: asset("ablation.png"),
    note: "TARG improves spatial precision; CMPG improves makeup fidelity.",
    images: {
      source: asset("challenges.png"),
      shmt: asset("comparison.png"),
      mad: asset("full-face-transfer.png"),
      stable: asset("ablation.png"),
      flux: asset("teaser.png"),
      ours: asset("ablation.png")
    }
  }
};

const methodLabels = {
  source: "Source",
  shmt: "SHMT",
  mad: "MAD",
  stable: "Stable-Makeup",
  flux: "Flux-Makeup",
  ours: "MagicMakeup"
};

function setupCompositionGallery() {
  document.querySelectorAll("[data-swap-card]").forEach((card) => {
    const main = card.querySelector("[data-swap-main]");
    const trigger = card.querySelector("[data-swap-trigger]");
    if (!main || !trigger) return;

    const original = main.getAttribute("src");
    const hover = trigger.dataset.hoverSrc;

    const showHover = () => {
      if (hover) main.setAttribute("src", hover);
    };
    const restore = () => {
      if (original) main.setAttribute("src", original);
    };

    trigger.addEventListener("mouseenter", showHover);
    trigger.addEventListener("mouseleave", restore);
    trigger.addEventListener("focus", showHover);
    trigger.addEventListener("blur", restore);
  });
}

function setupComparisonLab() {
  const lab = document.querySelector("[data-comparison-lab]");
  if (!lab) return;

  const viewer = lab.querySelector("[data-compare-viewer]");
  const before = lab.querySelector("[data-before-img]");
  const after = lab.querySelector("[data-after-img]");
  const beforeLabel = lab.querySelector("[data-before-label]");
  const afterLabel = lab.querySelector("[data-after-label]");
  const range = lab.querySelector("[data-compare-range]");
  const leftSelect = lab.querySelector("[data-left-method]");
  const rightSelect = lab.querySelector("[data-right-method]");
  const ref = lab.querySelector("[data-reference-img]");
  const refTitle = lab.querySelector("[data-reference-title]");
  const refNote = lab.querySelector("[data-reference-note]");
  const tabs = lab.querySelectorAll("[data-scene-tab]");

  let sceneKey = "sceneA";

  const updateSplit = () => {
    viewer.style.setProperty("--split", `${range.value}%`);
  };

  const updateImages = () => {
    const data = imageSets[sceneKey];
    const left = leftSelect.value;
    const right = rightSelect.value;

    before.src = data.images[left];
    after.src = data.images[right];
    before.alt = methodLabels[left];
    after.alt = methodLabels[right];
    beforeLabel.textContent = methodLabels[left];
    afterLabel.textContent = methodLabels[right];
    ref.src = data.reference;
    ref.alt = data.title;
    refTitle.textContent = data.title;
    refNote.textContent = data.note;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sceneKey = tab.dataset.sceneTab;
      tabs.forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-selected", item === tab ? "true" : "false");
      });
      updateImages();
    });
  });

  range.addEventListener("input", updateSplit);
  leftSelect.addEventListener("change", updateImages);
  rightSelect.addEventListener("change", updateImages);
  updateSplit();
  updateImages();
}

setupCompositionGallery();
setupComparisonLab();
