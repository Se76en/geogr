/* =========================================================================
   Deck controller
   Scroll-snap slides + keyboard navigation + index overlay.
   No scroll event listeners: the progress bar uses a CSS scroll-driven
   animation and the active slide is detected with an IntersectionObserver.
   ========================================================================= */
(function () {
  'use strict';

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;
  if (!total) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dockCount = document.getElementById('slideCount');
  var topCount = document.getElementById('topCount');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var indexToggle = document.getElementById('indexToggle');
  var indexPanel = document.getElementById('indexPanel');
  var indexList = document.getElementById('indexList');
  var indexClose = document.getElementById('indexClose');
  var printBtn = document.getElementById('printBtn');

  var current = 0;

  /* ---------- helpers ---------- */
  function slideTitle(slide) {
    var h = slide.querySelector('h1, h2');
    return h ? h.textContent.trim() : 'Slide';
  }

  function goTo(i, smooth) {
    var target = Math.max(0, Math.min(total - 1, i));
    slides[target].scrollIntoView({
      behavior: (smooth === false || reduced) ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  function setActive(i) {
    if (i === current) return;
    current = i;
    if (dockCount) dockCount.textContent = (i + 1) + ' / ' + total;
    if (topCount) topCount.textContent = (i + 1) + ' / ' + total;
    if (prevBtn) prevBtn.disabled = (i === 0);
    if (nextBtn) nextBtn.disabled = (i === total - 1);
    if (indexList) {
      Array.prototype.forEach.call(indexList.children, function (li, idx) {
        var btn = li.querySelector('button');
        if (btn) btn.setAttribute('aria-current', idx === i ? 'true' : 'false');
      });
    }
  }

  /* ---------- index overlay ---------- */
  function buildIndex() {
    if (!indexList) return;
    slides.forEach(function (slide, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'overlay__item';
      btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');

      var num = document.createElement('span');
      num.className = 'overlay__num';
      num.textContent = (i + 1) < 10 ? '0' + (i + 1) : String(i + 1);

      var body = document.createElement('span');
      var title = document.createElement('span');
      title.className = 'overlay__item-title';
      title.textContent = slideTitle(slide);
      body.appendChild(title);

      var desc = document.createElement('span');
      desc.className = 'overlay__item-desc';
      desc.textContent = slide.getAttribute('data-desc') || '';
      body.appendChild(desc);

      btn.appendChild(num);
      btn.appendChild(body);
      btn.addEventListener('click', function () {
        closeIndex();
        goTo(i);
      });

      li.appendChild(btn);
      indexList.appendChild(li);
    });
  }

  function openIndex() {
    if (!indexPanel) return;
    indexPanel.hidden = false;
    requestAnimationFrame(function () {
      indexPanel.classList.add('is-open');
    });
    if (indexToggle) indexToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (indexClose) indexClose.focus();
  }

  function closeIndex() {
    if (!indexPanel || indexPanel.hidden) return;
    indexPanel.classList.remove('is-open');
    if (indexToggle) indexToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (!indexPanel.classList.contains('is-open')) indexPanel.hidden = true;
    }, reduced ? 0 : 300);
  }

  /* ---------- observers ---------- */
  function observeSlides() {
    // Active slide: the band across the middle of the viewport.
    var active = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var i = slides.indexOf(entry.target);
        if (i !== -1) setActive(i);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    // Reveal: fires once per element, as soon as it enters the viewport.
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -6% 0px' });

    slides.forEach(function (slide) {
      active.observe(slide);
      Array.prototype.forEach.call(slide.querySelectorAll('[data-reveal]'), function (el) {
        reveal.observe(el);
      });
    });
  }

  /* ---------- events ---------- */
  function bind() {
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (btn) {
      btn.addEventListener('click', function () {
        goTo(parseInt(btn.getAttribute('data-goto'), 10) - 1);
      });
    });

    if (indexToggle) indexToggle.addEventListener('click', function () {
      if (indexPanel && !indexPanel.hidden) closeIndex(); else openIndex();
    });
    if (indexClose) indexClose.addEventListener('click', closeIndex);
    if (printBtn) printBtn.addEventListener('click', function () {
      closeIndex();
      window.setTimeout(function () { window.print(); }, reduced ? 0 : 350);
    });

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

      if (e.key === 'Escape') { closeIndex(); return; }

      var panelOpen = indexPanel && !indexPanel.hidden;
      if (panelOpen) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          goTo(current + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goTo(current - 1);
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(total - 1);
          break;
        default:
          break;
      }
    });
  }

  /* ---------- init ---------- */
  buildIndex();
  observeSlides();
  bind();
  setActive(0);
  if (dockCount) dockCount.textContent = '1 / ' + total;
  if (topCount) topCount.textContent = '1 / ' + total;
})();
