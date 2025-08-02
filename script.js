// Accordion functionality
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Toggle active class
    btn.classList.toggle('active');
    // Accordion content
    const content = btn.nextElementSibling;
    if (btn.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = "0";
    }
    // Close others
    document.querySelectorAll('.accordion-btn').forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove('active');
        otherBtn.nextElementSibling.style.maxHeight = "0";
      }
    });
  });
});

// Navigation bar animation on scroll (Tetap dipertahankan jika Anda ingin efek perubahan navbar saat scroll)
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('nav');
  if (window.scrollY > 50) { // Add 'scrolled' class when scrolled down 50px
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Bagian ini dihapus:
  // const elementsToAnimate = document.querySelectorAll('.profile-img, h1, .profile p, .accordion-item, blockquote');
  // elementsToAnimate.forEach(element => {
  //   const elementTop = element.getBoundingClientRect().top;
  //   const viewportHeight = window.innerHeight;
  //
  //   // Trigger animation when element is 80% visible in the viewport
  //   if (elementTop < viewportHeight * 0.8) {
  //     element.classList.add('fade-in');
  //   }
  // });
});

// Initial load animations for navigation bar items (Tetap dipertahankan untuk animasi awal navbar)
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  logo.style.opacity = '1';
  logo.style.transform = 'translateX(0)';

  const navItems = document.querySelectorAll('nav ul li');
  navItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 * index); // Stagger the animation
  });
});