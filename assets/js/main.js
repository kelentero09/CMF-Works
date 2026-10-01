/* =============================================================
   CMF Refrigeration and Airconditioning Services
   Static site interactions: nav, scrollspy, reveal, form demo
   ============================================================= */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Mobile navigation ---------- */
  var navToggle = $('#navToggle');
  var nav = $('#nav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    $$('.nav__link, .nav__cta', nav).forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = $('#header');
  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  onScroll();

  /* ---------- Scrollspy ---------- */
  var links = $$('.nav__link');
  var sections = links
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function spy() {
    var position = window.scrollY + 140;
    var currentId = sections.length ? sections[0].id : null;

    sections.forEach(function (section) {
      if (section.offsetTop <= position) currentId = section.id;
    });

    // Pin the last nav item when the page bottom is reached.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4 && sections.length) {
      currentId = sections[sections.length - 1].id;
    }

    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ---------- Reveal on scroll (staggered) ---------- */
  var revealables = $$('[data-reveal]');

  $$('[data-stagger]').forEach(function (group) {
    $$('[data-reveal]', group).forEach(function (item, i) {
      item.style.setProperty('--d', Math.min(i, 8) * 0.07 + 's');
    });
  });

  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Smooth anchor scrolling with header offset ---------- */
  $$('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      spy();
      if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 520);
      ticking = false;
    });
  }, { passive: true });

  spy();

  /* ---------- Inquiry form (demo only, no backend) ---------- */
  var form = $('#inquiryForm');
  var success = $('#formSuccess');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      $$('input, select, textarea', form).forEach(function (input) {
        var field = input.closest('.field');
        if (!field) return;
        var ok = input.value.trim() !== '' && input.checkValidity();
        field.classList.toggle('is-invalid', !ok);
        if (!ok && valid) {
          input.focus();
          valid = false;
        }
      });

      if (!valid) return;

      form.reset();
      $$('.field', form).forEach(function (f) { f.classList.remove('is-invalid'); });
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('is-invalid');
      });
    });
  }
})();