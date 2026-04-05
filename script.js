// ── NAVBAR SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
  hamburger.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});
navOverlay?.addEventListener('click', closeMenu);

// Close menu when nav link clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ── SMOOTH SCROLL for #projects
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── TABS (Project / Picture)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tab = this.dataset.tab;

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
  });
});

// ── SKILL BAR ANIMATION
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(el => {
    el.style.width = (el.dataset.pct || 0) + '%';
  });
}
const skillSection = document.querySelector('.skills-list');
if (skillSection) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateSkills(); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(skillSection);
}

// ── NAV ENTRANCE ANIMATION
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav ul li').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 80 * i + 120);
  });
});
