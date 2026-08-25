// ===== Loading screen =====
document.body.classList.add('is-loading');
const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('is-hidden')) return;
  loader.classList.add('is-hidden');
  document.body.classList.remove('is-loading');
};
window.addEventListener('load', () => setTimeout(hideLoader, 400));
// Safety net: never trap the user on the loader if an asset stalls.
setTimeout(hideLoader, 6000);

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Active nav link on scroll =====
// IntersectionObserver is more reliable than scroll-position math, especially
// with scroll-margin-top and a fixed navbar in play.
const sections = document.querySelectorAll('section[id]');
const navLinkMap = new Map();
sections.forEach(section => {
  const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
  if (link) navLinkMap.set(section, link);
});

const setActive = (section) => {
  navLinkMap.forEach((link, sec) => {
    link.classList.toggle('active', sec === section);
  });
};

const navObserver = new IntersectionObserver(
  entries => {
    // Pick the entry whose top is closest to (and below) the navbar.
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.target.offsetTop - b.target.offsetTop);
    if (visible.length) setActive(visible[0].target);
  },
  {
    // 80px navbar offset on top, -60% on the bottom so a section becomes
    // "active" as soon as its top crosses below the navbar.
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0
  }
);

sections.forEach(section => navObserver.observe(section));

// ===== Reveal on scroll =====
const revealElements = document.querySelectorAll(
  '.skill-card, .project-card, .about-grid, .contact-grid'
);
revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach(el => observer.observe(el));

// ===== Stat counter animation =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 30);
        statObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
statNumbers.forEach(el => statObserver.observe(el));

// ===== Floating particles (replaced by Tubes Cursor three.js canvas) =====
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = 4 + Math.random() * 4 + 's';
    particlesContainer.appendChild(particle);
  }
}

// ===== Theme Switcher =====
const themeToggle = document.getElementById('themeToggle');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'amber-dark';
document.documentElement.setAttribute('data-theme', savedTheme);
markActiveTheme(savedTheme);

themeToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  themeDropdown.classList.toggle('open');
});

themeOptions.forEach(option => {
  option.addEventListener('click', () => {
    const theme = option.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    markActiveTheme(theme);
    themeDropdown.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-switcher')) {
    themeDropdown.classList.remove('open');
  }
});

function markActiveTheme(theme) {
  themeOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
}

// ===== Squircle buttons =====
// Squircle buttons re-render their innerHTML on pointerdown, which prevents
// the browser from synthesizing a click event. Listen for pointerup instead.
const onTap = (el, fn) => {
  el.addEventListener('pointerup', (e) => {
    if (e.button !== 0) return;
    fn(e);
  });
};

const heroButtonsMount = document.getElementById('heroButtons');
if (heroButtonsMount && window.createSquircleBtn) {
  const goTo = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    history.pushState(null, '', hash);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const viewWork = window.createSquircleBtn({ c: 'teal', l: 'View My Work', i: 'rocket_launch', h: 48 });
  onTap(viewWork, () => goTo('#projects'));

  const getInTouch = window.createSquircleBtn({ c: 'purple', l: 'Get in Touch', i: 'mail', h: 48 });
  onTap(getInTouch, () => goTo('#contact'));

  const resumeBtn = window.createSquircleBtn({ c: 'amber', l: 'Resume', i: 'description', h: 48 });
  onTap(resumeBtn, () => window.open('assets/Chihiro_Ito_Resume.pdf', '_blank', 'noopener'));

  heroButtonsMount.appendChild(viewWork);
  heroButtonsMount.appendChild(getInTouch);
  heroButtonsMount.appendChild(resumeBtn);
}

const submitBtnMount = document.getElementById('submitBtnMount');
const contactForm = document.getElementById('contactForm');

const buildSubmitBtn = (variant = 'idle') => {
  const cfg = variant === 'sent'
    ? { c: 'green', l: 'Message Sent!', i: 'check_circle', h: 48, class: 'w-full block mt-4' }
    : { c: 'blue', l: 'Send Message', i: 'send', h: 48, class: 'w-full block mt-4' };
  const btn = window.createSquircleBtn(cfg);
  if (variant === 'idle') {
    onTap(btn, () => contactForm?.requestSubmit());
  }
  return btn;
};

if (submitBtnMount && contactForm && window.createSquircleBtn) {
  submitBtnMount.appendChild(buildSubmitBtn('idle'));
}

// ===== Contact form =====
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  if (submitBtnMount) {
    submitBtnMount.innerHTML = '';
    submitBtnMount.appendChild(buildSubmitBtn('sent'));
  }
  setTimeout(() => {
    if (submitBtnMount) {
      submitBtnMount.innerHTML = '';
      submitBtnMount.appendChild(buildSubmitBtn('idle'));
    }
    e.target.reset();
  }, 3000);
});
