// Mobile nav
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));
}

// Tabs (only present on index.html)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Reveal on scroll + skill bar fill
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      e.target.querySelectorAll('.skill-fill').forEach(f => f.style.width = f.dataset.pct + '%');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Night-sky starfield with shooting stars — signature background across all pages
const canvas = document.getElementById('netCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], shootingStars = [], spawnTimer = null;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    const STAR_COUNT = Math.max(90, Math.floor((w * h) / 6500));
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        baseAlpha: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.025 + 0.006,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function spawnShootingStar() {
    const startX = Math.random() * w * 0.8 + w * 0.05;
    const startY = Math.random() * h * 0.3;
    const angle = (Math.random() * 20 + 28) * Math.PI / 180; // diagonal, down-right
    const speed = Math.random() * 5 + 7;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 26 + 34,
      length: Math.random() * 70 + 55
    });
  }

  function scheduleSpawn() {
    spawnTimer = setTimeout(() => {
      if (Math.random() < 0.75) spawnShootingStar();
      scheduleSpawn();
    }, Math.random() * 2600 + 1800);
  }
  scheduleSpawn();

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);

    // twinkling star field
    stars.forEach(s => {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228,234,255,${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
    });

    // shooting stars with fading trail
    shootingStars.forEach(sh => {
      sh.life++;
      sh.x += sh.vx;
      sh.y += sh.vy;
      const alpha = 1 - sh.life / sh.maxLife;
      const segLen = Math.hypot(sh.vx, sh.vy) || 1;
      const tailX = sh.x - (sh.vx / segLen) * sh.length;
      const tailY = sh.y - (sh.vy / segLen) * sh.length;

      const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(0.45, `rgba(153,197,255,${alpha * 0.45})`);
      grad.addColorStop(1, 'rgba(153,197,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sh.x, sh.y, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.shadowColor = '#a9caff';
      ctx.shadowBlur = 9;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    shootingStars = shootingStars.filter(sh => sh.life < sh.maxLife && sh.y < h + 120 && sh.x < w + 120);

    t++;
    requestAnimationFrame(draw);
  }
  draw();
}
