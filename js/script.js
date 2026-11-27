(() => {
  const invitation = document.querySelector("#invitation");
  const celebration = document.querySelector("#celebration");
  const yesButton = document.querySelector("#yes-button");
  const noButton = document.querySelector("#no-button");
  const actions = document.querySelector("#actions");
  const rain = document.querySelector("#rain");
  const leafField = document.querySelector("#leaf-field");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let celebrated = false;

  // Seed a modest number of decorative leaves so the scene stays lightweight.
  const leafGlyphs = ["✦", "❧", "🍃"];
  for (let i = 0; i < 13; i += 1) {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leaf.textContent = leafGlyphs[i % leafGlyphs.length];
    leaf.style.cssText = `--x:${(i * 37 + 7) % 100}%;--y:${(i * 23 + 4) % 100}%;--size:${14 + (i % 4) * 7}px;--duration:${5 + (i % 5)}s;--delay:-${i % 6}s;--rotation:${i * 29}deg`;
    leafField.append(leaf);
  }

  function moveNoButton() {
    if (celebrated) return;
    const rect = noButton.getBoundingClientRect();
    const padding = 12;
    const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
    const maxY = Math.max(padding, window.innerHeight - rect.height - padding);
    const currentX = rect.left;
    const currentY = rect.top;
    let x = currentX;
    let y = currentY;
    // Choose a visible destination well away from the cursor and the old spot.
    for (let attempt = 0; attempt < 12; attempt += 1) {
      x = padding + Math.random() * (maxX - padding);
      y = padding + Math.random() * (maxY - padding);
      if (Math.hypot(x - currentX, y - currentY) > 100) break;
    }
    noButton.style.position = "fixed";
    noButton.style.left = `${Math.max(padding, Math.min(maxX, x))}px`;
    noButton.style.top = `${Math.max(padding, Math.min(maxY, y))}px`;
    noButton.style.transition = "left 360ms cubic-bezier(.2,.8,.2,1), top 360ms cubic-bezier(.2,.8,.2,1), transform 360ms cubic-bezier(.2,.8,.2,1)";
    noButton.style.transform = `rotate(${Math.random() > .5 ? 1 : -1}${4 + Math.floor(Math.random() * 8)}deg) scale(1.04)`;
  }

  // Desktop: dodge as the pointer approaches. Touch: move away on touchstart,
  // and cancel pointer/click activation so NO can never be recorded.
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || celebrated) return;
    const rect = noButton.getBoundingClientRect();
    const near = event.clientX >= rect.left - 50 && event.clientX <= rect.right + 50 &&
      event.clientY >= rect.top - 42 && event.clientY <= rect.bottom + 42;
    if (near) moveNoButton();
  }, { passive: true });
  noButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    moveNoButton();
  });
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    moveNoButton();
  });
  noButton.addEventListener("focus", moveNoButton);
  window.addEventListener("resize", () => {
    if (noButton.style.position !== "fixed") return;
    const rect = noButton.getBoundingClientRect();
    noButton.style.left = `${Math.max(12, Math.min(window.innerWidth - rect.width - 12, rect.left))}px`;
    noButton.style.top = `${Math.max(12, Math.min(window.innerHeight - rect.height - 12, rect.top))}px`;
  });

  function startSunflowerRain() {
    const count = reducedMotion.matches ? 12 : 38;
    const flowers = ["🌻", "🌻", "🌼", "🍃", "🌿"];
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElement("span");
      const isLeaf = i % 4 === 3;
      petal.className = `petal${isLeaf ? " leaf-petal" : ""}`;
      petal.textContent = flowers[i % flowers.length];
      const duration = 4.8 + Math.random() * 5.5;
      petal.style.cssText = `--x:${Math.random() * 100}%;--size:${isLeaf ? 14 + Math.random() * 10 : 20 + Math.random() * 26}px;--duration:${duration}s;--delay:${Math.random() * 3.6}s;--sway:${-70 + Math.random() * 140}px;--opacity:${.65 + Math.random() * .35}`;
      rain.append(petal);
      window.setTimeout(() => petal.remove(), (duration + 4) * 1000);
    }
  }

  yesButton.addEventListener("click", () => {
    if (celebrated) return;
    celebrated = true;
    invitation.classList.add("is-leaving");
    invitation.style.opacity = "0";
    invitation.style.transform = "translateY(-12px) scale(.98)";
    window.setTimeout(() => {
      invitation.hidden = true;
      celebration.hidden = false;
      startSunflowerRain();
    }, reducedMotion.matches ? 20 : 260);
  });
})();
