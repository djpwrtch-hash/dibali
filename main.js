/* Diwali ambience: flying diyas, sparkles, diya row, scroll reveals. */
(function () {
  'use strict';

  /* ---------- Build diya row ---------- */
  const row = document.getElementById('diyas-row');
  const DIYA_COUNT = 12;
  if (row) {
    for (let i = 0; i < DIYA_COUNT; i++) {
      const d = document.createElement('div');
      d.className = 'diya';
      d.style.animationDelay = `${-(i * 0.45)}s`;
      d.style.animationDuration = `${3 + (i % 4) * 0.4}s`;
      const flame = document.createElement('span');
      flame.className = 'flame';
      const bowl = document.createElement('span');
      bowl.className = 'bowl';
      d.append(flame, bowl);
      row.appendChild(d);
    }
  }

  /* ---------- Flying diyas ---------- */
  const sky = document.getElementById('flying-diyas');
  const MAX_FLYING = 7;

  function spawnFlyingDiya() {
    if (!sky || sky.children.length >= MAX_FLYING) return;
    const d = document.createElement('div');
    d.className = 'flying-diya';
    d.style.left = `${Math.random() * 100}%`;
    d.style.setProperty('--sway', `${(Math.random() * 120 - 60).toFixed(0)}px`);
    d.style.animationDuration = `${7 + Math.random() * 6}s`;
    d.style.opacity = '0';

    const flame = document.createElement('span');
    flame.className = 'flame';
    flame.style.animationDuration = `${0.6 + Math.random() * 0.7}s`;
    const bowl = document.createElement('span');
    bowl.className = 'bowl';
    d.append(flame, bowl);
    sky.appendChild(d);

    d.addEventListener('animationend', () => d.remove());
  }
  setInterval(() => {
    if (!document.hidden && Math.random() < 0.7) spawnFlyingDiya();
  }, 1800);
  spawnFlyingDiya();

  /* ---------- Twinkling sparkles ---------- */
  const sparkles = document.getElementById('sparkles');
  const SPARKLE_COUNT = 40;

  if (sparkles) {
    const variants = ['', 'big', 'pink', 'cyan'];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const s = document.createElement('div');
      s.className = `sparkle ${variants[i % variants.length]}`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
      s.style.animationDuration = `${1.8 + Math.random() * 2.5}s`;
      sparkles.appendChild(s);
    }
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
})();
