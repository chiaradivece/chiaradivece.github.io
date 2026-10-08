(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.querySelector('[data-nav]');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function (e) {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      // The new theme grows in a circle from the button. Keyboard presses (detail 0),
      // reduced motion and browsers without View Transitions switch instantly.
      if (typeof document.startViewTransition !== 'function' || reduceMotion || e.detail === 0) {
        applyTheme(next);
        return;
      }
      var r = themeBtn.getBoundingClientRect();
      var x = r.left + r.width / 2;
      var y = r.top + r.height / 2;
      var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var transition = document.startViewTransition(function () { applyTheme(next); });
      transition.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 500, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
    });
    themeBtn.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.toggleAttribute('data-menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.hasAttribute('data-menu-open'));
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- Nav border once the page has scrolled (no scroll listener) ---------- */
  if (nav && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.toggleAttribute('data-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Reveals ---------- */
  // Each element reveals once, the first time it scrolls into view. Staggered groups
  // give their children an index; afterwards every hook is removed, so the reveal's
  // transitions and clip-path never interfere with an element's own hover/press styles.
  var MAX_STAGGER = 12;
  var revealEls = document.querySelectorAll('[data-reveal], [data-stagger], [data-reveal-image]');

  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', Math.min(i, MAX_STAGGER));
    });
  });

  function cleanUp(el) {
    el.removeAttribute('data-reveal');
    el.removeAttribute('data-stagger');
    el.removeAttribute('data-reveal-image');
    el.classList.remove('is-in');
  }

  function revealed(el) {
    el.classList.add('is-in');
    var steps = el.hasAttribute('data-stagger') ? Math.min(el.children.length - 1, MAX_STAGGER) : 0;
    var step = parseFloat(getComputedStyle(el).getPropertyValue('--step')) || 50;
    setTimeout(function () { cleanUp(el); }, steps * step + 900);
  }

  if ('IntersectionObserver' in window) {
    // A figure starts fully clipped, and the observer treats a fully clipped element as
    // never visible, so figures are watched through their parent instead.
    var targetFor = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        revealed(targetFor.get(entry.target));
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) {
      var watched = el.hasAttribute('data-reveal-image') ? el.parentElement : el;
      targetFor.set(watched, el);
      io.observe(watched);
    });
  } else {
    revealEls.forEach(cleanUp);
  }

  /* ---------- Nav: an underline follows the section being read ---------- */
  var indicator = document.querySelector('[data-nav-indicator]');
  if (indicator && 'IntersectionObserver' in window) {
    var linkFor = {};
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
      linkFor[a.getAttribute('href').slice(1)] = a;
    });
    var activeLink = null;

    var placeIndicator = function (link, instant) {
      if (instant) indicator.style.transition = 'none';
      indicator.style.transform = 'translateX(' + link.offsetLeft + 'px) scaleX(' + link.offsetWidth + ')';
      if (instant) {
        void indicator.offsetWidth; // commit the jump before transitions come back
        indicator.style.transition = '';
      }
    };

    var setActive = function (link) {
      if (link === activeLink) return;
      if (activeLink) activeLink.removeAttribute('aria-current');
      var wasHidden = !activeLink;
      activeLink = link;
      if (!link) { indicator.classList.remove('is-on'); return; }
      link.setAttribute('aria-current', 'location');
      // Appearing: jump into place, then fade in. Already visible: glide over.
      placeIndicator(link, wasHidden);
      indicator.classList.add('is-on');
    };

    // A thin band across the middle of the viewport decides which section is "current"
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(linkFor[entry.target.id] || null);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id], footer[id]').forEach(function (sec) { spy.observe(sec); });

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { if (activeLink) placeIndicator(activeLink, true); })
        .observe(document.querySelector('.nav-links'));
    }
  }

  /* ---------- Publications: research elements + filters ---------- */

  // A paper is shown when it matches every active filter:
  //   element  the research element picked in the periodic table, if any
  //   first    first-author papers; equal-contribution (co-first) papers count too
  //   journal  journal papers, including ones under review at a journal (public on arXiv)
  function matchesFilter(pub, state) {
    if (state.element && pub.elements.indexOf(state.element) === -1) return false;
    if (state.first && pub.first !== 'sole' && pub.first !== 'joint') return false;
    if (state.journal && pub.type !== 'journal') return false;
    return true;
  }

  var elementGrid = document.querySelector('[data-element-grid]');
  var pubList = document.querySelector('[data-pub-list]');
  if (elementGrid && pubList) {
    var tiles = elementGrid.querySelectorAll('[data-element]');
    var toggles = document.querySelectorAll('[data-toggle]');
    var clearBtn = document.querySelector('[data-clear]');
    var statusEl = document.querySelector('[data-pub-status]');
    var emptyMsg = document.querySelector('[data-pub-empty]');
    var yearGroups = pubList.querySelectorAll('[data-year-group]');
    var pubs = Array.prototype.map.call(pubList.querySelectorAll('[data-pub]'), function (el) {
      return {
        el: el,
        type: el.dataset.type,
        first: el.dataset.first,
        elements: (el.dataset.elements || '').split(' ').filter(Boolean)
      };
    });
    var state = { element: null, first: false, journal: false };

    function render() {
      var shown = 0;
      pubs.forEach(function (pub) {
        var ok = matchesFilter(pub, state);
        pub.el.hidden = !ok;
        if (ok) shown++;
      });
      yearGroups.forEach(function (group) {
        group.hidden = !group.querySelector('[data-pub]:not([hidden])');
      });
      if (emptyMsg) emptyMsg.hidden = shown !== 0;
      tiles.forEach(function (tile) {
        tile.setAttribute('aria-pressed', String(tile.dataset.element === state.element));
      });
      elementGrid.toggleAttribute('data-active', !!state.element);
      toggles.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(!!state[btn.dataset.toggle]));
      });
      var filtered = !!(state.element || state.first || state.journal);
      if (clearBtn) {
        if (!filtered && document.activeElement === clearBtn && tiles[0]) tiles[0].focus();
        clearBtn.hidden = !filtered;
      }
      if (statusEl) {
        statusEl.textContent = filtered
          ? 'Showing ' + shown + ' of ' + pubs.length + ' papers'
          : 'Showing all ' + pubs.length + ' papers';
      }
    }

    // Pointer-driven changes animate the list with a View Transition; keyboard-driven
    // ones (click events with detail 0) apply instantly, as do browsers without support
    // and anyone who prefers reduced motion.
    var canTransition = typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function nameForTransition(on) {
      pubs.forEach(function (pub, i) { pub.el.style.viewTransitionName = on ? 'pub-' + i : ''; });
      yearGroups.forEach(function (group, i) {
        var label = group.querySelector('.pub-year-label');
        if (label) label.style.viewTransitionName = on ? 'year-' + i : '';
      });
    }

    function update(event) {
      if (!canTransition || (event && event.detail === 0)) { render(); return; }
      nameForTransition(true);
      var transition = document.startViewTransition(render);
      transition.finished.finally(function () { nameForTransition(false); });
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function (e) {
        state.element = state.element === tile.dataset.element ? null : tile.dataset.element;
        update(e);
      });
    });
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        state[btn.dataset.toggle] = !state[btn.dataset.toggle];
        update(e);
      });
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        state = { element: null, first: false, journal: false };
        update(e);
      });
    }
  }

  /* ---------- Awards rail ---------- */
  var rail = document.querySelector('[data-rail]');
  var prev = document.querySelector('[data-rail-prev]');
  var next = document.querySelector('[data-rail-next]');
  if (rail && prev && next) {
    var step = function () {
      var card = rail.querySelector('li');
      return card ? card.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
    };
    var updateButtons = function () {
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };
    prev.addEventListener('click', function () { rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
    next.addEventListener('click', function () { rail.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
    rail.addEventListener('scroll', function () { window.requestAnimationFrame(updateButtons); }, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  /* ---------- Local time (Seattle + London), shown as a sentence ---------- */
  var clockEls = document.querySelectorAll('[data-tz]');

  function renderClocks(animate) {
    var now = new Date();
    clockEls.forEach(function (el) {
      var text;
      try {
        var parts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: el.getAttribute('data-tz') }).formatToParts(now);
        var time = '', period = '';
        parts.forEach(function (p) {
          if (p.type === 'dayPeriod') period = p.value.toLowerCase();
          else if (p.type !== 'literal' || p.value === ':') time += p.value;
        });
        text = time + '\u00a0' + period;
      } catch (e) { return; }
      if (el.textContent === text) return;
      el.textContent = text;
      el.setAttribute('datetime', now.toISOString());
      // A new minute slides up into place: state indication, once a minute at most
      if (animate && !reduceMotion && el.animate) {
        el.animate(
          [{ opacity: 0, transform: 'translateY(0.35em)', filter: 'blur(2px)' }, { opacity: 1, transform: 'none', filter: 'none' }],
          { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
        );
      }
    });
  }
  if (clockEls.length) {
    renderClocks(false);
    // Tick on the minute boundary, then every minute
    setTimeout(function () {
      renderClocks(true);
      setInterval(function () { renderClocks(true); }, 60000);
    }, 60000 - (Date.now() % 60000) + 50);
  }

  /* ---------- Pause control for the venue marquee (WCAG 2.2.2) ---------- */
  var marqueeToggle = document.querySelector('[data-marquee-toggle]');
  var marquee = document.querySelector('.marquee');
  if (marqueeToggle && marquee) {
    marqueeToggle.addEventListener('click', function () {
      var paused = !marquee.classList.contains('is-paused');
      marquee.classList.toggle('is-paused', paused);
      marqueeToggle.setAttribute('aria-pressed', String(paused));
      marqueeToggle.setAttribute('aria-label', paused ? 'Play the scrolling list of venues' : 'Pause the scrolling list of venues');
    });
  }

  /* ---------- Photo lightbox ---------- */
  var lightbox = document.querySelector('[data-lightbox]');
  if (lightbox && typeof lightbox.showModal === 'function') {
    // The image is created on first use, so the page never ships an <img> without a source
    var lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-img';
    var lightboxReady = false;
    document.querySelectorAll('[data-lightbox-open]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = link.querySelector('img');
        if (!lightboxReady) { lightbox.appendChild(lightboxImg); lightboxReady = true; }
        lightboxImg.src = link.getAttribute('href');
        lightboxImg.alt = thumb ? thumb.alt : '';
        lightbox.setAttribute('aria-label', thumb ? thumb.alt : 'Photo');
        lightbox.showModal();
      });
    });
    // Clicking the dimmed backdrop (the dialog itself, outside the image) closes it
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
  }

  /* ---------- Copy email ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.setAttribute('data-copied', '');
        btn.setAttribute('aria-label', 'Email address copied');
        setTimeout(function () {
          btn.removeAttribute('data-copied');
          btn.setAttribute('aria-label', 'Copy email address');
        }, 1800);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });
})();
