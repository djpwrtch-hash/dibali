/* Diwali fireworks engine — canvas particle system.
   Auto-launches rockets; clicking anywhere fires one toward the cursor. */
(function () {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  const launchBtn = document.getElementById('launch-btn');

  const COLORS = ['#ffd700', '#ff6b35', '#ff2d78', '#9b59ff', '#00e5ff', '#ff9d00', '#7CFC00'];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0;
  let rockets = [];
  let particles = [];
  let running = true;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function launchRocket(targetX, targetY) {
    const x = targetX !== undefined ? targetX : rand(W * 0.15, W * 0.85);
    const ty = targetY !== undefined ? targetY : rand(H * 0.15, H * 0.45);
    rockets.push({
      x,
      y: H + 12,
      tx: x,
      ty,
      vy: -rand(9.5, 12.5),
      color: pick(COLORS),
      trail: []
    });
  }

  function explode(x, y, color) {
    // Burst of sparks
    const count = 70 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + rand(-0.08, 0.08);
      const speed = rand(1.5, 6.5);
      particles.push({
        x, y,
        px: x, py: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: rand(0.008, 0.02),
        color,
        size: rand(1, 2.6)
      });
    }
    // A few slow glitter "comet" particles for depth
    for (let i = 0; i < 14; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(0.6, 2.2);
      particles.push({
        x, y, px: x, py: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, decay: rand(0.004, 0.009),
        color: pick(COLORS), size: rand(2, 3.4)
      });
    }
  }

  function drawLine(x1, y1, x2, y2, color, alpha, width) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 10) r.trail.shift();

      // steer slightly toward target x
      r.x += (r.tx - r.x) * 0.02;
      r.y += r.vy;
      r.vy += 0.06; // gravity

      // draw fading trail
      for (let j = 1; j < r.trail.length; j++) {
        const a = j / r.trail.length;
        drawLine(r.trail[j - 1].x, r.trail[j - 1].y, r.trail[j].x, r.trail[j].y,
          r.color, a * 0.8, 2);
      }
      drawLine(r.x, r.y, r.x, r.y + 6, '#ffffff', 0.9, 2.5);

      if (r.vy >= -1.5 || r.y <= r.ty) {
        explode(r.x, Math.min(r.y, r.ty), r.color);
        rockets.splice(i, 1);
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.px = p.x; p.py = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;          // gravity
      p.vx *= 0.985;          // drag
      p.vy *= 0.985;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = Math.max(p.life, 0);
      drawLine(p.px, p.py, p.x, p.y, p.color, alpha, p.size);

      // sparkle head
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (running) requestAnimationFrame(tick);
  }

  // Auto-launch barrage
  setInterval(() => {
    if (document.hidden) return;
    launchRocket();
    if (Math.random() < 0.35) launchRocket();
  }, 1100);

  // Click anywhere to fire at cursor
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, nav')) return;
    launchRocket(e.clientX, Math.max(e.clientY, 80));
  });

  launchBtn && launchBtn.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => launchRocket(), i * 180);
    }
  });

  // Pause when tab hidden to save battery
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  requestAnimationFrame(tick);
})();
