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

  // Picking the theme the device already uses isn't an override: the saved choice is
  // forgotten and the site goes back to following the device, including when the device
  // switches later (at sunset, say). Only a theme that differs from the device is saved.
  function applyTheme(next) {
    // Colours switch at once (the circle reveal is the only motion), so no element fades on
    // its own colour transition; transitions come back two frames later
    root.classList.add('theme-switching');
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('theme-switching'); }); });
    var deviceTheme = darkQuery.matches ? 'dark' : 'light';
    if (next === deviceTheme) {
      root.removeAttribute('data-theme');
      try { localStorage.removeItem('theme'); } catch (e) {}
    } else {
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    }
    themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
  }

  // While following the device, keep the button's pressed state in step with it
  if (themeBtn && darkQuery.addEventListener) {
    darkQuery.addEventListener('change', function () {
      if (!root.hasAttribute('data-theme')) themeBtn.setAttribute('aria-pressed', String(darkQuery.matches));
    });
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
      }, function () {}); // skipped (hidden tab, a second click): the theme still changed
    });
    themeBtn.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  }

  /* ---------- Mobile menu ---------- */
  // While the sheet is open, keyboard focus cycles through the menu button and the sheet's
  // links only, so it can't wander onto the page hidden behind it.
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menuLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  function menuOpen() { return !!nav && nav.hasAttribute('data-menu-open'); }
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.toggleAttribute('data-menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = !menuOpen();
      setMenu(open);
      if (open && menuLinks[0]) menuLinks[0].focus();
    });
    menuLinks.forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!menuOpen()) return;
      if (e.key === 'Escape') {
        setMenu(false);
        menuBtn.focus();
        return;
      }
      if (e.key === 'Tab') {
        var cycle = [menuBtn].concat(menuLinks);
        var at = cycle.indexOf(document.activeElement);
        e.preventDefault();
        var nextAt = at === -1 ? 1 : (at + (e.shiftKey ? -1 : 1) + cycle.length) % cycle.length;
        cycle[nextAt].focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.hasAttribute('data-menu-open') && !nav.contains(e.target)) setMenu(false);
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
    document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-extra)').forEach(function (a) {
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

  /* ---------- Publications: the perception pipeline + filters ---------- */

  // A paper is shown when it matches every active filter:
  //   stage    a pipeline stage (Perceive, Learn, Simulate, Deploy): the paper's primary
  //            stage, so every paper sits in exactly one
  //   topic    one topic inside the picked stage, which narrows it
  //   first    first-author papers; equal-contribution (co-first) papers count too
  //   journal  journal papers, including ones under review at a journal (public on arXiv)
  function matchesFilter(pub, state) {
    if (state.stage && pub.stage !== state.stage.id) return false;
    if (state.topic && pub.topics.indexOf(state.topic) === -1) return false;
    if (state.first && pub.first !== 'sole' && pub.first !== 'joint') return false;
    if (state.journal && pub.type !== 'journal') return false;
    return true;
  }

  var pipeline = document.querySelector('[data-pipeline]');
  var pubList = document.querySelector('[data-pub-list]');
  if (pipeline && pubList) {
    var stages = Array.prototype.map.call(pipeline.querySelectorAll('[data-stage]'), function (btn) {
      return {
        btn: btn,
        id: btn.dataset.stage,
        name: btn.dataset.name,
        row: pipeline.querySelector('[data-topics-for="' + btn.dataset.stage + '"]')
      };
    });
    var topicChips = pipeline.querySelectorAll('[data-topic]');
    var toggles = document.querySelectorAll('[data-toggle]');
    var statusEl = document.querySelector('[data-pub-status]');
    var emptyBox = document.querySelector('[data-pub-empty]');
    var emptyText = document.querySelector('[data-pub-empty-text]');
    var emptyFix = document.querySelector('[data-pub-empty-fix]');
    var yearGroups = pubList.querySelectorAll('[data-year-group]');
    var pubs = Array.prototype.map.call(pubList.querySelectorAll('[data-pub]'), function (el) {
      return {
        el: el,
        type: el.dataset.type,
        first: el.dataset.first,
        stage: el.dataset.stage,
        topics: (el.dataset.topics || '').split(' ').filter(Boolean)
      };
    });
    var blank = function () { return { stage: null, topic: null, first: false, journal: false }; };
    var state = blank();

    function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }
    var pubSection = pipeline.closest('section');
    var changeLink = document.querySelector('[data-pub-change]');
    var barActions = document.querySelector('[data-pub-bar-actions]');
    function stageFor(id) { for (var i = 0; i < stages.length; i++) if (stages[i].id === id) return stages[i]; return null; }
    function topicName(id) {
      for (var i = 0; i < topicChips.length; i++) if (topicChips[i].dataset.topic === id) return topicChips[i].dataset.name;
      return id;
    }
    // What is picked, in words, always with its stage: "Learn" or "Learn · Ultrasound".
    // A topic alone would misstate the record (4 ultrasound papers in Learn, 6 in all).
    function pickName() {
      if (!state.stage) return '';
      return state.stage.name + (state.topic ? ' · ' + topicName(state.topic) : '');
    }
    // "5 of 13 papers in Learn", "4 of 13 papers in Learn · Ultrasound · first author · journals"
    function describe(n) {
      var parts = [n + ' of ' + pubs.length + ' papers' + (state.stage ? ' in ' + state.stage.name : '')];
      if (state.topic) parts.push(topicName(state.topic));
      if (state.first) parts.push('first author');
      if (state.journal) parts.push('journals');
      return parts.join(' · ');
    }
    function countFor(s) {
      var n = 0;
      pubs.forEach(function (pub) { if (matchesFilter(pub, s)) n++; });
      return n;
    }

    // Under the chips, each stage and topic shows how many papers it would leave, so a dead
    // end is visible before anyone clicks it (dashed outline, count 0). Only the picked
    // stage's topics are shown.
    function renderPipeline() {
      stages.forEach(function (st) {
        var n = countFor({ stage: st, topic: null, first: state.first, journal: state.journal });
        var on = st === state.stage;
        st.btn.querySelector('.stage-count').textContent = n;
        st.btn.toggleAttribute('data-empty', n === 0 && !on);
        st.btn.setAttribute('aria-pressed', String(on));
        st.btn.setAttribute('aria-label', st.name + ', ' + plural(n, 'paper'));
      });
      // A chip that would keep every paper the stage shows (under the current chips) no longer
      // narrows anything, so it steps aside; a row left with no chips hides
      topicChips.forEach(function (chip) {
        var chipStage = stageFor(chip.closest('[data-topics-for]').dataset.topicsFor);
        var n = countFor({ stage: chipStage, topic: chip.dataset.topic, first: state.first, journal: state.journal });
        var all = countFor({ stage: chipStage, topic: null, first: state.first, journal: state.journal });
        var on = chip.dataset.topic === state.topic;
        chip.querySelector('.chip-count').textContent = n;
        chip.hidden = !on && n > 0 && n === all;
        chip.toggleAttribute('data-empty', n === 0 && !on);
        chip.setAttribute('aria-pressed', String(on));
        chip.setAttribute('aria-label', chip.dataset.name + ', ' + plural(n, 'paper'));
      });
      stages.forEach(function (st) {
        if (!st.row) return;
        var open = st === state.stage && !!st.row.querySelector('[data-topic]:not([hidden])');
        st.row.hidden = !open;
      });
      // First author and Journals preview too: what the list would show with the chip on
      toggles.forEach(function (btn) {
        var key = btn.dataset.toggle;
        var preview = { stage: state.stage, topic: state.topic, first: state.first, journal: state.journal };
        preview[key] = true;
        var n = countFor(preview);
        var countEl = btn.querySelector('.chip-count');
        if (countEl) countEl.textContent = n;
        btn.toggleAttribute('data-empty', n === 0 && !state[key]);
        btn.setAttribute('aria-label', btn.dataset.name + ', ' + plural(n, 'paper'));
      });
    }

    // An empty result says which combination caused it and offers the one change that helps
    function renderEmpty(shown) {
      if (!emptyBox) return;
      emptyBox.hidden = shown !== 0;
      if (shown !== 0 || !emptyText || !emptyFix) return;
      var kind = (state.first ? 'first-author ' : '') + (state.journal ? 'journal ' : '');
      // "in Learn on ultrasound", "in Simulate"
      var where = state.stage ? ' in ' + state.stage.name + (state.topic ? ' on ' + topicName(state.topic).toLowerCase() : '') : '';
      emptyText.textContent = 'No ' + kind + 'papers' + where + ' yet.';
      if (state.stage && (state.first || state.journal)) {
        var all = countFor({ stage: state.stage, topic: state.topic, first: false, journal: false });
        emptyFix.textContent = all === 1 ? 'Show the paper' + where : 'Show all ' + all + ' papers' + where;
        emptyFix.dataset.fix = 'chips';
      } else {
        emptyFix.textContent = 'Show all papers';
        emptyFix.dataset.fix = 'all';
      }
    }

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
      renderPipeline();
      renderEmpty(shown);
      pipeline.toggleAttribute('data-active', !!state.stage);
      toggles.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(!!state[btn.dataset.toggle]));
      });
      var filtered = !!(state.stage || state.first || state.journal);
      if (statusEl) statusEl.textContent = filtered ? describe(shown) : 'Showing all ' + pubs.length + ' papers';
      if (pubSection) pubSection.toggleAttribute('data-filtered', filtered);
      if (barActions) barActions.hidden = !filtered;
      if (panelState) {
        panelState.textContent = [pickName(), state.first ? 'first author' : '', state.journal ? 'journals' : '']
          .filter(Boolean).join(' · ');
      }
      updateBarActions();
      updateBarActions();
    }

    // Where things are on screen, for the bar's actions: Show while the list is still below,
    // Change once the pipeline is out of view (or the phone panel is folded), Clear always
    var listBelow = false;
    var pipelineInView = false;
    var chipsRow = document.querySelector('[data-pub-filters]');
    var showLink = document.querySelector('[data-pub-show]');
    var panel = document.querySelector('[data-filter-panel]');
    var panelState = document.querySelector('[data-filter-panel-state]');
    function updateBarActions() {
      if (showLink) showLink.hidden = !listBelow;
      if (changeLink) changeLink.hidden = pipelineInView && !(panel && !panel.open);
    }
    var phone = window.matchMedia('(max-width: 639px)');
    function syncPanel() { if (panel) panel.open = !phone.matches; }
    syncPanel();
    if (phone.addEventListener) phone.addEventListener('change', syncPanel);
    if (panel) panel.addEventListener('toggle', function () {
      updateBarActions();
      if (panel.open && phone.matches) {
        var r = panel.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.6) {
          window.scrollBy({ top: r.top - (nav ? nav.offsetHeight : 0) - 12, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        listBelow = !e.isIntersecting && e.boundingClientRect.top > 0;
        updateBarActions();
      }, { rootMargin: '0px 0px -15% 0px' }).observe(pubList);
      new IntersectionObserver(function (entries) {
        pipelineInView = entries[0].isIntersecting;
        updateBarActions();
      }, { rootMargin: '-' + (nav ? nav.offsetHeight : 0) + 'px 0px 0px 0px' }).observe(pipeline); // under the sticky nav is not "in view"
    }
    // Show lands on the status line ("6 of 13 papers in Learn") just below the nav, with the
    // list right under it, and moves focus there without adding a #hash to the address
    if (showLink) showLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (statusEl) {
        statusEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        statusEl.focus({ preventScroll: true });
      }
    });

    // Pointer-driven changes animate the list with a View Transition; keyboard-driven
    // ones (click events with detail 0) apply instantly, as do browsers without support
    // and anyone who prefers reduced motion. A new click while one is still running
    // finishes the running one at once, so no click is ever lost.
    var canTransition = typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var running = null;

    function nameForTransition(on) {
      pubs.forEach(function (pub, i) { pub.el.style.viewTransitionName = on ? 'pub-' + i : ''; });
      yearGroups.forEach(function (group, i) {
        var label = group.querySelector('.pub-year-label');
        if (label) label.style.viewTransitionName = on ? 'year-' + i : '';
      });
    }

    // The filter lives in the address (?stage=learn&topic=ultrasound&first=1&journal=1), so a
    // view can be shared and Back undoes a change. Each change adds one history entry.
    function stateToQuery(s) {
      var q = new URLSearchParams(window.location.search);
      ['stage', 'topic', 'first', 'journal'].forEach(function (k) { q.delete(k); });
      if (s.stage) q.set('stage', s.stage.id);
      if (s.stage && s.topic) q.set('topic', s.topic);
      if (s.first) q.set('first', '1');
      if (s.journal) q.set('journal', '1');
      var str = q.toString();
      return window.location.pathname + (str ? '?' + str : '') + window.location.hash;
    }
    function stateFromQuery() {
      var q = new URLSearchParams(window.location.search);
      var st = stageFor(q.get('stage'));
      var topic = q.get('topic');
      var valid = st && st.row && st.row.querySelector('[data-topic="' + topic + '"]');
      return { stage: st, topic: valid ? topic : null, first: q.get('first') === '1', journal: q.get('journal') === '1' };
    }
    // The first change from the unfiltered list adds a history entry; later tweaks replace
    // it, so one Back always returns to the unfiltered list (and a second leaves the page)
    function remember() {
      var url = stateToQuery(state);
      if (url === window.location.pathname + window.location.search + window.location.hash) return;
      var wasFiltered = !!(history.state && history.state.pubs);
      var isFiltered = !!(state.stage || state.first || state.journal);
      try {
        if (isFiltered && !wasFiltered) history.pushState({ pubs: true }, '', url);
        else history.replaceState(isFiltered ? { pubs: true } : null, '', url);
      } catch (e) {}
    }

    function update(event) {
      remember();
      if (running) running.skipTransition();
      if (!canTransition || (event && event.detail === 0)) { render(); return; }
      nameForTransition(true);
      var transition = document.startViewTransition(render);
      running = transition;
      transition.ready.catch(function () {}); // skipped transitions reject `ready`; the list still updated
      transition.finished.finally(function () {
        if (running === transition) { running = null; nameForTransition(false); }
      }).catch(function () {});
    }

    // Phones: a final pick (a topic, or a chip) folds the panel; its toggle names the filter,
    // so the result line and Show sit right under it and nothing floats over the controls.
    // A stage pick keeps the panel open, because its topics have just appeared.
    function foldOnPhone() {
      if (!(phone.matches && panel && panel.open)) return;
      var hadFocus = panel.contains(document.activeElement);
      panel.open = false;
      var top = panel.getBoundingClientRect().top;
      if (top < (nav ? nav.offsetHeight : 0)) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      // the control that had focus is now folded away (keyboard, pointer or screen-reader tap
      // alike), so focus moves to the toggle that names the filter
      var toggle = panel.querySelector('summary');
      if (toggle && hadFocus) toggle.focus({ preventScroll: true });
    }
    stages.forEach(function (st) {
      st.btn.addEventListener('click', function (e) {
        state.stage = state.stage === st ? null : st;
        state.topic = null;
        update(e);
      });
    });
    topicChips.forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        state.topic = state.topic === chip.dataset.topic ? null : chip.dataset.topic;
        update(e);
        if (state.topic) foldOnPhone();
      });
    });
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        state[btn.dataset.toggle] = !state[btn.dataset.toggle];
        update(e);
        foldOnPhone();
      });
    });
    function focusPick() {
      var picked = pipeline.querySelector('.topic[aria-pressed="true"]') ||
        pipeline.querySelector('.stage[aria-pressed="true"]') || stages[0].btn;
      if (picked) picked.focus({ preventScroll: true });
    }
    // A shared link or a Back/Forward step restores the filter (instantly, no transition)
    var fromUrl = stateFromQuery();
    if (fromUrl.stage || fromUrl.first || fromUrl.journal) {
      state = fromUrl;
      render();
      // A shared link opens on the filtered list, not the hero: the status line under the nav
      if (!window.location.hash && statusEl) {
        try { history.replaceState({ pubs: true }, ''); } catch (e) {}
        // instant, not the page's smooth scroll; after load, so the browser's own scroll
        // restoration doesn't put it back at the top
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        var land = function () { statusEl.scrollIntoView({ block: 'start', behavior: 'instant' }); };
        if (document.readyState === 'complete') land(); else window.addEventListener('load', land, { once: true });
      }
    }
    window.addEventListener('popstate', function () {
      state = stateFromQuery();
      if (running) running.skipTransition();
      render();
    });
    var barClear = document.querySelector('[data-pub-bar-clear]');
    if (changeLink) {
      changeLink.addEventListener('click', function (e) {
        e.preventDefault();
        var opening = panel && !panel.open;
        if (opening) panel.open = true;
        (panel || pipeline).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); // stages and chips too
        // a panel that was folded can't take focus inside it until it has rendered open
        if (opening) requestAnimationFrame(function () { requestAnimationFrame(focusPick); });
        else focusPick();
      });
    }
    if (barClear) {
      barClear.addEventListener('click', function (e) {
        state = blank();
        update(e);
        if (statusEl) statusEl.focus({ preventScroll: true }); // the button hides; focus stays on the result
      });
    }
    if (emptyFix) {
      emptyFix.addEventListener('click', function (e) {
        if (emptyFix.dataset.fix === 'chips') { state.first = false; state.journal = false; }
        else state = blank();
        update(e);
        // the fix button disappears with the empty state, so focus needs a new home
        focusPick();
      });
    }
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
  // One <dialog> for every thumbnail. The photos of one news item form a set: the arrows,
  // the arrow keys or a sideways swipe move through it (wrapping round), and the caption
  // says where you are. With a pointer, the next photo fades in from the side it comes
  // from; keyboard steps and reduced motion swap it straight away.
  var lightbox = document.querySelector('[data-lightbox]');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var stage = lightbox.querySelector('[data-lightbox-stage]');
    var prevPhoto = lightbox.querySelector('[data-lightbox-prev]');
    var nextPhoto = lightbox.querySelector('[data-lightbox-next]');
    var countEl = lightbox.querySelector('[data-lightbox-count]');
    var captionEl = lightbox.querySelector('[data-lightbox-caption]');
    // The image is created on first use, so the page never ships an <img> without a source
    var lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-img';
    lightboxImg.decoding = 'async';
    var photoSet = [];
    var photoIndex = 0;
    var photoToken = 0;

    var photoAt = function (i) {
      var link = photoSet[(i + photoSet.length) % photoSet.length];
      var thumb = link.querySelector('img');
      var alt = thumb ? thumb.alt : '';
      return { src: link.getAttribute('href'), alt: alt, caption: link.getAttribute('data-caption') || alt };
    };
    var preload = function (i) { if (photoSet.length > 1) new Image().src = photoAt(i).src; };

    // dir: 1 = next, -1 = previous, 0 = no movement (opening, keyboard)
    var showPhoto = function (i, dir) {
      photoIndex = (i + photoSet.length) % photoSet.length;
      var photo = photoAt(photoIndex);
      var mine = ++photoToken;
      var apply = function () {
        if (mine !== photoToken) return; // a newer step already won
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.alt;
        lightbox.setAttribute('aria-label', photo.alt || 'Photo');
        countEl.textContent = photoSet.length > 1 ? (photoIndex + 1) + ' of ' + photoSet.length : '';
        captionEl.textContent = photo.caption;
        if (dir) {
          lightboxImg.animate(
            reduceMotion
              ? [{ opacity: 0 }, { opacity: 1 }]
              : [{ opacity: 0, transform: 'translateX(' + (dir * 16) + 'px)' }, { opacity: 1, transform: 'none' }],
            { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
          );
        }
        preload(photoIndex + 1);
        preload(photoIndex - 1);
      };
      if (!dir) { apply(); return; }
      // Keep the current photo until the next one has decoded, so nothing flashes empty
      var next = new Image();
      next.src = photo.src;
      (next.decode ? next.decode() : Promise.resolve()).then(apply, apply);
    };
    var step = function (dir, animated) {
      if (photoSet.length > 1) showPhoto(photoIndex + dir, animated ? dir : 0);
    };

    document.querySelectorAll('[data-lightbox-open]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var group = link.closest('.news-photos');
        photoSet = Array.prototype.slice.call((group || document).querySelectorAll('[data-lightbox-open]'));
        var several = photoSet.length > 1;
        prevPhoto.hidden = !several;
        nextPhoto.hidden = !several;
        if (!lightboxImg.isConnected) stage.prepend(lightboxImg);
        showPhoto(photoSet.indexOf(link), 0);
        lightbox.showModal();
      });
    });

    prevPhoto.addEventListener('click', function (e) { step(-1, e.detail !== 0); });
    nextPhoto.addEventListener('click', function (e) { step(1, e.detail !== 0); });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1, false); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1, false); }
    });

    // Swipe sideways on a touch screen: a clear horizontal move of 40px or more
    var swipe = null;
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' && e.isPrimary) swipe = { x: e.clientX, y: e.clientY };
    });
    stage.addEventListener('pointerup', function (e) {
      if (!swipe) return;
      var dx = e.clientX - swipe.x;
      var dy = e.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1, true);
    });
    stage.addEventListener('pointercancel', function () { swipe = null; });

    // Clicking the dimmed backdrop (the dialog itself, outside the photo) closes it
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
    // The dialog restores focus to the thumbnail that opened it; move it to the one last viewed
    lightbox.addEventListener('close', function () {
      var last = photoSet[photoIndex];
      if (last) last.focus({ preventScroll: true });
    });
  }

  /* ---------- Phone folds ---------- */
  // Secondary lists (Community) start folded on phones and open on wider screens.
  // Without JavaScript they stay open.
  var foldPhone = window.matchMedia('(max-width: 639px)');
  var folds = document.querySelectorAll('[data-fold-phone]');
  function syncFolds() { folds.forEach(function (d) { d.open = !foldPhone.matches; }); }
  if (folds.length) {
    syncFolds();
    if (foldPhone.addEventListener) foldPhone.addEventListener('change', syncFolds);
  }

  /* ---------- Education notes (phones) ---------- */
  // Phones show compact rows (degree, school, dates); honours and notes are one tap away.
  // Without JavaScript, and from 640px, the notes always show.
  var eduList = document.getElementById('edu-list');
  var eduToggle = document.querySelector('[data-edu-notes]');
  if (eduList && eduToggle) {
    var eduPhone = window.matchMedia('(max-width: 639px)');
    var setNotes = function (show) {
      eduList.toggleAttribute('data-notes-folded', !show);
      eduToggle.setAttribute('aria-expanded', String(show));
      eduToggle.textContent = show ? 'Hide honours and notes' : 'Show honours and notes';
    };
    var syncEdu = function () {
      eduToggle.hidden = !eduPhone.matches;
      setNotes(!eduPhone.matches);
    };
    syncEdu();
    if (eduPhone.addEventListener) eduPhone.addEventListener('change', syncEdu);
    eduToggle.addEventListener('click', function () {
      setNotes(eduList.hasAttribute('data-notes-folded'));
    });
  }

  /* ---------- Copy email ---------- */
  // Success swaps the icon and says "Copied" (announced politely). If the clipboard is
  // unavailable or refused, the text (address or bio) is selected and the note says how to copy it.
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var note = btn.parentElement.querySelector('[data-copy-note]');
    var link = btn.parentElement.querySelector('a[href^="mailto:"]');
    var timer = 0;
    function say(text, sticky) {
      if (!note) return;
      note.textContent = text;
      clearTimeout(timer);
      if (!sticky) timer = setTimeout(function () { note.textContent = ''; }, 4000);
    }
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.setAttribute('data-copied', '');
        // A quiet note announces success without taking a line; the check on the button shows it
        if (note && note.hasAttribute('data-quiet-success')) note.classList.add('sr-only');
        say('Copied');
        setTimeout(function () { btn.removeAttribute('data-copied'); }, 1800);
      };
      var fallback = function () {
        if (note) note.classList.remove('sr-only');
        var touch = window.matchMedia('(pointer: coarse)').matches;
        var keys = isMac ? '⌘C' : 'Ctrl+C';
        var source = document.getElementById(btn.getAttribute('data-copy-source') || '');
        var target = source || (link && link.textContent.trim() === text ? link : null);
        if (source) {
          // e.g. the speaker bio: it is already on the page, so select it where it is
          say(touch ? 'Your browser blocked copying. Press and hold the bio to copy it.' : 'Your browser blocked copying. The bio is selected: press ' + keys + '.', true);
        } else if (!target && note) {
          // e.g. beside "Email an invitation": spell the address out in the note and select it
          note.textContent = touch ? 'Your browser blocked copying. Press and hold to copy ' : 'Your browser blocked copying. Press ' + keys + ' to copy ';
          target = document.createElement('span');
          target.className = 'copy-address';
          target.textContent = text;
          note.appendChild(target);
          clearTimeout(timer);
        } else {
          say(touch ? 'Your browser blocked copying. Press and hold the address to copy it.' : 'Your browser blocked copying. The address is selected: press ' + keys + '.', true);
        }
        if (target && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(target);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });
})();
