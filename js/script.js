// KPS PU College - Global interactions

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Preloader
  window.addEventListener('load', () => {
    body.classList.add('loaded');
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.remove(), 600);
    }
  });

  // Dark mode - use localStorage preference
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('kps-theme');

  const applyTheme = (mode) => {
    const isDark = mode === 'dark';

    // Tailwind dark mode class (for any dark: utilities)
    document.documentElement.classList.toggle('dark', isDark);

    // High-level theme classes – detailed colors handled in CSS
    body.classList.toggle('dark-theme', isDark);
    body.classList.toggle('light-theme', !isDark);

    // Toggle icon (moon/sun) if present
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(isDark ? 'fa-moon' : 'fa-sun');
      }
    }
  };

  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    // Prefer system setting
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Determine current mode from our theme classes
      const isDark = body.classList.contains('dark-theme');
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('kps-theme', next);
    });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      if (getComputedStyle(navMenu).display === 'none') {
        navMenu.style.display = 'flex';
      } else {
        navMenu.style.display = 'none';
      }
    });

    // Hide menu on navigation (mobile)
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          navMenu.style.display = 'none';
        }
      });
    });
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Year in footer
  const yearEls = document.querySelectorAll('#year');
  const year = new Date().getFullYear();
  yearEls.forEach((el) => (el.textContent = year));

  // AOS (scroll animations)
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: 'ease-out-quart',
      once: true,
      offset: 60,
    });
  }

  // Stats counters (only on pages where counters exist)
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 80));

      const step = () => {
        current += increment;
        if (current >= target) {
          current = target;
          el.textContent = target + (target >= 100 ? '+' : '');
        } else {
          el.textContent = current;
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  // Testimonials slider (home page)
  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dots = slider.querySelectorAll('[data-index]');
    let index = 0;

    const updateSlider = () => {
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.remove('w-1.5', 'bg-slate-500');
          dot.classList.add('w-4', 'bg-primary-400');
        } else {
          dot.classList.remove('w-4', 'bg-primary-400');
          dot.classList.add('w-1.5', 'bg-slate-500');
        }
      });
    };

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      updateSlider();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));
    dots.forEach((dot, i) =>
      dot.addEventListener('click', () => goTo(i))
    );

    // Auto-rotate
    let auto = setInterval(() => goTo(index + 1), 8000);
    slider.addEventListener('mouseenter', () => clearInterval(auto));
    slider.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo(index + 1), 8000);
    });

    updateSlider();
  }

  // Gallery filters & lightbox (gallery page)
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach((item) => {
          const type = item.getAttribute('data-type');
          if (filter === 'all' || filter === type) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  if (lightbox) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxVideoSource = document.getElementById('lightboxVideoSource');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    const openLightboxImage = (src, caption) => {
      lightboxImage.src = src;
      lightboxImage.classList.remove('hidden');
      lightboxVideo.classList.add('hidden');
      lightboxCaption.textContent = caption || '';
      lightbox.classList.remove('hidden');
    };

    const openLightboxVideo = (src, caption) => {
      if (lightboxVideoSource) {
        lightboxVideoSource.src = src;
        lightboxVideo.load();
      }
      lightboxVideo.classList.remove('hidden');
      lightboxImage.classList.add('hidden');
      lightboxCaption.textContent = caption || '';
      lightbox.classList.remove('hidden');
    };

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightboxVideo.pause();
    };

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const caption = item.getAttribute('data-caption') || '';
        if (type === 'image') {
          const src = item.getAttribute('data-src');
          if (src) openLightboxImage(src, caption);
        } else {
          const videoSrc = item.getAttribute('data-video');
          if (videoSrc) openLightboxVideo(videoSrc, caption);
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }
});

