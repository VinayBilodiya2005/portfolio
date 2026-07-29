/* ==========================================================================
   Vinay Bilodiya — Portfolio interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Nav: scrolled state + mobile toggle + active link highlighting
     --------------------------------------------------------------------- */
  const navWrap = document.getElementById('navWrap');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    navWrap.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is tapped
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight the nav link for the section currently in view
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------------------------------------------------------------------
     Scroll-reveal for elements marked .reveal
     --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for elements revealing together
            setTimeout(() => entry.target.classList.add('in-view'), i * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------------------
     Hero signal animation — a dot travels the input -> output path,
     echoing the site's "translate raw signal into software" idea.
     --------------------------------------------------------------------- */
  const signalPath = document.getElementById('signalPath');
  const signalDot = document.getElementById('signalDot');

  if (signalPath && signalDot && !prefersReducedMotion) {
    const pathLength = signalPath.getTotalLength();
    const duration = 3200; // ms for one traverse
    let startTime = null;

    function animateDot(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % (duration * 2);
      // travel forward for `duration`, pause, then reset (no jarring snap-back)
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2); // ease-out
      const point = signalPath.getPointAtLength(eased * pathLength);
      signalDot.setAttribute('cx', point.x);
      signalDot.setAttribute('cy', point.y);
      requestAnimationFrame(animateDot);
    }
    requestAnimationFrame(animateDot);
  }

  /* ---------------------------------------------------------------------
     Back-to-top button
     --------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener(
    'scroll',
    () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    },
    { passive: true }
  );
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------------
     Contact form — static site, no backend: open the visitor's mail
     client pre-filled with their message instead of silently failing.
     --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        formNote.textContent = 'Please fill in every field before sending.';
        return;
      }

      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:vinaybilodiya1503@gmail.com?subject=${subject}&body=${body}`;

      formNote.textContent = 'Opening your email client…';
      contactForm.reset();
    });
  }
});
