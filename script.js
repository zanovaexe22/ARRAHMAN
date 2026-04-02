/* ============================================================
   PORTOFOLIO APRIANSYAH — script.js
   Features: Loading screen, custom cursor, scroll reveal,
             accordion, navbar scroll, dark/light toggle
   ============================================================ */

/* ─── LOADING SCREEN ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger initial reveal animations after loader hides
    setTimeout(triggerReveal, 200);
  }, 2000);
});

/* ─── CUSTOM CURSOR ─── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Scale up ring on interactive elements
document.querySelectorAll('a, button, .accordion-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorRing) {
      cursorRing.style.width  = '50px';
      cursorRing.style.height = '50px';
      cursorRing.style.opacity = '1';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (cursorRing) {
      cursorRing.style.width  = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.opacity = '0.6';
    }
  });
});

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  triggerReveal();
});

/* ─── SCROLL REVEAL ─── */
function triggerReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
      setTimeout(() => el.classList.add('visible'), i * 80);
    }
  });
}

// Run once on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  triggerReveal();
  initAccordion();
  initThemeToggle();
  initNavAnimation();
});

/* ─── ACCORDION ─── */
function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-btn').forEach(other => {
        other.classList.remove('active');
        other.nextElementSibling.style.maxHeight = '0';
      });

      // Open clicked (if was closed)
      if (!isActive) {
        btn.classList.add('active');
        const content = btn.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ─── DARK / LIGHT TOGGLE ─── */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  if (toggleBtn) toggleBtn.textContent = saved === 'dark' ? '🌙' : '☀️';

  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

/* ─── NAVBAR ITEM STAGGER ANIMATION ─── */
function initNavAnimation() {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.opacity = '0';
    logo.style.transform = 'translateX(-16px)';
    requestAnimationFrame(() => {
      logo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      logo.style.opacity = '1';
      logo.style.transform = 'translateX(0)';
    });
  }

  document.querySelectorAll('nav ul li').forEach((li, i) => {
    li.style.opacity = '0';
    li.style.transform = 'translateY(-12px)';
    setTimeout(() => {
      li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateY(0)';
    }, 100 + i * 100);
  });
}
