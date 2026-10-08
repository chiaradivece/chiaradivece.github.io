(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.querySelector('[data-nav]');

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return darkQuery.matches ? 'dark' : 'light';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
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

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
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

  /* ---------- Local clocks (Seattle + London) ---------- */
  var clockEls = document.querySelectorAll('[data-tz]');
  var noteEls = document.querySelectorAll('[data-tz-day]');
  var notes = Array.prototype.map.call(noteEls, function (el) { return el.textContent; });

  function renderClocks() {
    var now = new Date();
    clockEls.forEach(function (el) {
      var tz = el.getAttribute('data-tz');
      try {
        var parts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).formatToParts(now);
        var time = '', period = '';
        parts.forEach(function (p) {
          if (p.type === 'dayPeriod') period = p.value.toLowerCase();
          else if (p.type !== 'literal' || p.value === ':') time += p.value;
        });
        el.innerHTML = time + '<span class="clock-ampm">' + period + '</span>';
        el.setAttribute('datetime', now.toISOString());
      } catch (e) { el.textContent = '--:--'; }
    });
    noteEls.forEach(function (el, i) {
      try {
        var day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: el.getAttribute('data-tz-day') }).format(now);
        el.textContent = day + '. ' + notes[i];
      } catch (e) {}
    });
  }
  if (clockEls.length) {
    renderClocks();
    // Tick on the minute boundary, then every minute
    setTimeout(function () {
      renderClocks();
      setInterval(renderClocks, 60000);
    }, 60000 - (Date.now() % 60000) + 50);
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
