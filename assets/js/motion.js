/*
 * Presence: the hero portrait's pointer parallax and the About badge on its lanyard.
 *
 * Both are decorative, so both stay out of the way: fine pointers only for the
 * parallax, nothing at all under prefers-reduced-motion, and requestAnimationFrame
 * only runs while something is actually moving. Transforms are written straight to
 * the element that moves (never through a CSS variable on a parent).
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* ---------- Hero: spring-smoothed pointer parallax ---------- */
  (function () {
    var hero = document.querySelector('[data-hero]');
    if (!hero || reduceMotion || !finePointer) return;

    var layers = Array.prototype.map.call(hero.querySelectorAll('[data-depth]'), function (el) {
      return { el: el, depth: parseFloat(el.getAttribute('data-depth')) || 0 };
    });
    if (!layers.length) return;

    // Near-critically damped: follows the pointer with weight, never wobbles
    var STIFFNESS = 90;
    var DAMPING = 18;
    var x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0;
    var raf = 0, last = 0;

    function frame(now) {
      var dt = Math.min(0.032, (now - (last || now)) / 1000);
      last = now;
      vx += ((tx - x) * STIFFNESS - vx * DAMPING) * dt;
      vy += ((ty - y) * STIFFNESS - vy * DAMPING) * dt;
      x += vx * dt;
      y += vy * dt;
      for (var i = 0; i < layers.length; i++) {
        var d = layers[i].depth;
        layers[i].el.style.transform =
          'translate3d(' + (x * d).toFixed(2) + 'px,' + (y * d * 0.6).toFixed(2) + 'px,0)';
      }
      var settled = Math.abs(tx - x) < 0.001 && Math.abs(ty - y) < 0.001 &&
                    Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001;
      if (settled) { raf = 0; last = 0; return; }
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf) raf = requestAnimationFrame(frame); }

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      wake();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; wake(); });
  })();

  /* ---------- About: a badge swinging on its lanyard ---------- */
  (function () {
    var rig = document.querySelector('[data-badge-rig]');
    if (!rig || reduceMotion) return; // reduced motion: a still badge, no drop, no swing

    var drop = rig.querySelector('[data-badge-drop]');
    var swing = rig.querySelector('[data-badge-swing]');
    var card = rig.querySelector('[data-badge-card]');
    var pin = rig.querySelector('.badge-pin');
    if (!drop || !swing || !card || !pin) return;

    // The feel of the badge: a damped pendulum (angles in degrees).
    // Higher STIFFNESS swings faster; lower DAMPING keeps it swinging longer.
    // Past LIMIT the drag meets rising friction instead of a hard stop.
    var STIFFNESS = 60;
    var DAMPING = 5;
    var LIMIT = 28;

    var angle = 0, velocity = 0, raf = 0, last = 0;
    var dragging = false, pointerId = null, grabOffset = 0, samples = [];

    function render() { swing.style.transform = 'rotate(' + angle.toFixed(3) + 'deg)'; }

    function frame(now) {
      var dt = Math.min(0.032, (now - (last || now)) / 1000);
      last = now;
      if (!dragging) {
        // Semi-implicit Euler: stable for a light spring at display frame rates
        velocity += (-STIFFNESS * angle - DAMPING * velocity) * dt;
        angle += velocity * dt;
      }
      render();
      if (!dragging && Math.abs(angle) < 0.03 && Math.abs(velocity) < 0.05) {
        angle = 0; velocity = 0; render();
        raf = 0; last = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

    // Angle of the pointer around the pin. CSS rotate() turns clockwise, which swings
    // the badge's bottom to the left, hence the minus sign.
    function pointerAngle(e) {
      var p = pin.getBoundingClientRect();
      var dx = e.clientX - (p.left + p.width / 2);
      var dy = e.clientY - (p.top + p.height / 2);
      return -Math.atan2(dx, Math.max(dy, 1)) * 180 / Math.PI;
    }

    // Entrance: the first time About comes into view the badge drops in and swings to rest
    drop.style.opacity = '0';
    function enter() {
      drop.style.opacity = '';
      drop.animate(
        [{ transform: 'translateY(-56px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' }
      );
      angle = -10;
      velocity = 0;
      wake();
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        enter();
      }, { threshold: 0.35 });
      io.observe(rig);
    } else {
      drop.style.opacity = '';
    }

    // Drag: grab the badge and swing it. Pointer capture keeps the drag alive outside
    // the card; a second finger is ignored; release keeps the throw's velocity.
    card.addEventListener('pointerdown', function (e) {
      if (dragging) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      card.setPointerCapture(pointerId);
      grabOffset = pointerAngle(e) - angle;
      samples = [{ t: performance.now(), a: angle }];
      velocity = 0;
      wake();
    });

    card.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pointerId) return;
      var raw = pointerAngle(e) - grabOffset;
      var over = Math.abs(raw) - LIMIT;
      angle = over > 0 ? Math.sign(raw) * (LIMIT + over * 0.25) : raw;
      angle = clamp(angle, -60, 60);
      var now = performance.now();
      samples.push({ t: now, a: angle });
      while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
    });

    function release(e) {
      if (!dragging || (e && e.pointerId !== pointerId)) return;
      dragging = false;
      pointerId = null;
      var first = samples[0];
      var lastSample = samples[samples.length - 1];
      var span = (lastSample.t - first.t) / 1000;
      velocity = span > 0 ? clamp((lastSample.a - first.a) / span, -500, 500) : 0;
      wake();
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
    card.addEventListener('lostpointercapture', release);

    // Brushing past the badge with a mouse gives it a small push in that direction
    if (finePointer) {
      var nudged = false;
      card.addEventListener('pointerenter', function () { nudged = false; });
      card.addEventListener('pointermove', function (e) {
        if (dragging || nudged || !e.movementX) return;
        nudged = true;
        velocity += clamp(-e.movementX * 4, -40, 40);
        wake();
      });
    }
  })();
})();
