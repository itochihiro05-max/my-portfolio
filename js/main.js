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
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

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
const savedTheme = localStorage.getItem('portfolio-theme') || 'emerald-light';
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
const heroButtonsMount = document.getElementById('heroButtons');
if (heroButtonsMount && window.createSquircleBtn) {
  const viewWork = window.createSquircleBtn({ c: 'teal', l: 'View My Work', i: 'rocket_launch', h: 48 });
  viewWork.addEventListener('click', () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  });

  const getInTouch = window.createSquircleBtn({ c: 'purple', l: 'Get in Touch', i: 'mail', h: 48 });
  getInTouch.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });

  heroButtonsMount.appendChild(viewWork);
  heroButtonsMount.appendChild(getInTouch);
}

const submitBtnMount = document.getElementById('submitBtnMount');
const contactForm = document.getElementById('contactForm');

const buildSubmitBtn = (variant = 'idle') => {
  const cfg = variant === 'sent'
    ? { c: 'green', l: 'Message Sent!', i: 'check_circle', h: 48, class: 'w-full block mt-4' }
    : { c: 'blue', l: 'Send Message', i: 'send', h: 48, class: 'w-full block mt-4' };
  const btn = window.createSquircleBtn(cfg);
  if (variant === 'idle') {
    btn.addEventListener('click', () => contactForm?.requestSubmit());
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
