/* ===================================================
   main.js – CANARYONE Interactive Effects
   =================================================== */

// ── Navbar scroll effect ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Hero Parallax + 3D Tilt ───────────────────────────
const heroBg = document.getElementById('heroBg');
const fcards = document.querySelectorAll('.fcard[data-tilt]');
const tiltFactor = 15; // degrees

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  // Parallax background
  heroBg.style.transform = `translate(${dx * -18}px, ${dy * -12}px)`;

  // 3D Tilt on each floating card
  fcards.forEach((card, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const rx = -dy * tiltFactor * .7 * dir;
    const ry = dx * tiltFactor * .7 * dir;
    const base = card.dataset.baseTransform || 'rotate(0deg)';
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.boxShadow = `
      ${-dx * 20}px ${-dy * 20}px 40px rgba(0,0,0,.5),
      0 0 60px rgba(212,168,67,${0.05 + Math.abs(dx) * 0.1})
    `;
  });
});

// Reset tilt on mouse leave
document.querySelector('.hero').addEventListener('mouseleave', () => {
  fcards.forEach(card => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

// ── Scroll-Telling ────────────────────────────────────
const stWrapper = document.querySelector('.st-sticky-wrapper');
const stSticky = document.getElementById('stSticky');
const steps = [
  document.getElementById('step0'),
  document.getElementById('step1'),
  document.getElementById('step2'),
  document.getElementById('step3'),
];
const arrowScore = document.getElementById('arrowScore');
const arrowIlus = document.getElementById('arrowIlus');
const arrowData = document.getElementById('arrowData');
const stCardImg = document.getElementById('stCardImg');

const cardImgs = [
  'assets/card_guanche.png',
  'assets/card_guanche.png',
  'assets/card_teide.png',
  'assets/card_back.png',
];

function setScrollTellStep(idx) {
  steps.forEach((s, i) => s.classList.toggle('active', i === idx));

  arrowScore.classList.toggle('visible', idx >= 1);
  arrowIlus.classList.toggle('visible', idx >= 2);
  arrowData.classList.toggle('visible', idx >= 3);

  if (stCardImg.src !== cardImgs[idx]) {
    stCardImg.style.opacity = '0';
    setTimeout(() => {
      stCardImg.src = cardImgs[idx];
      stCardImg.style.opacity = '1';
    }, 250);
    stCardImg.style.transition = 'opacity .3s';
  }
}

function onScrollTell() {
  if (!stWrapper) return;
  const rect = stWrapper.getBoundingClientRect();
  const progress = -rect.top / (rect.height - window.innerHeight);
  const clamped = Math.max(0, Math.min(1, progress));
  const idx = Math.min(steps.length - 1, Math.floor(clamped * steps.length));
  setScrollTellStep(idx);
}

// Initialise first step
steps[0].classList.add('active');

// ── Generic Intersection Observer ─────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.evtease-card, .cal-event, .team-card, .value-item')
  .forEach(el => io.observe(el));

// ── B2B Form ──────────────────────────────────────────
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = isError ? 'rgba(255,80,80,.5)' : 'rgba(212,168,67,.4)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

document.getElementById('b2bForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('b2bSubmit');
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  // Simulate submission
  setTimeout(() => {
    btn.textContent = '✅ Solicitud enviada';
    showToast('✅ ¡Solicitud enviada! Te respondemos en menos de 24h.');
    setTimeout(() => {
      btn.textContent = 'Solicitar Presupuesto →';
      btn.disabled = false;
      document.getElementById('b2bForm').reset();
    }, 3000);
  }, 1400);
});

// ── Scroll listener ───────────────────────────────────
window.addEventListener('scroll', () => {
  onScrollTell();
}, { passive: true });

// ── Smooth-scroll for anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Init ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setScrollTellStep(0);
});
