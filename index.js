/* ================================================
   ExpenSync – JavaScript
   ================================================ */

// ── Navbar scroll ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile Nav ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
});
mobileClose.addEventListener('click', closeMobileNav);
mobileNav.addEventListener('click', e => { if (e.target === mobileNav) closeMobileNav(); });

function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Scroll Reveal ─────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // Stagger siblings in same parent
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const i = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), i * 90);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Smooth anchor scroll ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});

// ── Screenshot drag-to-scroll ─────────────────────
const scroller = document.querySelector('.screenshots-scroll');
if (scroller) {
  let isDown = false, startX, scrollLeft;

  scroller.addEventListener('mousedown', e => {
    e.preventDefault();
    isDown = true;
    scroller.style.cursor = 'grabbing';
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
  });
  scroller.addEventListener('mouseleave', () => { isDown = false; scroller.style.cursor = 'grab'; });
  scroller.addEventListener('mouseup',    () => { isDown = false; scroller.style.cursor = 'grab'; });
  scroller.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.4;
    scroller.scrollLeft = scrollLeft - walk;
  });

  // Touch swipe support
  let touchStart = 0;
  scroller.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  scroller.addEventListener('touchmove', e => {
    const currentX = e.touches[0].clientX;
    scroller.scrollLeft += (touchStart - currentX) * 0.5;
    touchStart = currentX;
  }, { passive: true });
}

// ── Notify form ───────────────────────────────────
function handleNotify(e) {
  e.preventDefault();
  
  const form = document.getElementById('notifyForm');
  const formData = new FormData(form);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
  .then(() => {
    form.style.display = 'none';
    document.getElementById('notifySuccess').style.display = 'block';
  })
  .catch(error => console.error('Form submit error:', error));
}

// ── Parallax blobs (uses CSS custom properties to avoid overriding keyframe transforms) ──
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.documentElement.style.setProperty('--blob1-y', `${y * 0.12}px`);
  document.documentElement.style.setProperty('--blob2-y', `${-y * 0.08}px`);
}, { passive: true });

// ── Dynamic copyright year ────────────────────────
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) footerCopy.textContent = `© ${new Date().getFullYear()} ExpenSync. Made with ♥ for iOS.`;
