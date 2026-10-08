/*
 * Presence: the hero portrait's pointer parallax.
 *
 * Decorative, so it stays out of the way: fine pointers only, nothing at all under
 * prefers-reduced-motion, and requestAnimationFrame only runs while something is
 * actually moving. Transforms are written straight to the element that moves (never
 * through a CSS variable on a parent).
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
})();
