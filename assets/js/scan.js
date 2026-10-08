/*
 * Hero visual: a simulated B-mode ultrasound sector scan of a soft,
 * three-chamber pneumatic actuator. The chambers inflate in sequence,
 * the transducer sweeps left/right with persistence, and the body follows
 * the pointer on a damped spring (squashing along its velocity).
 *
 * Rendering: intensities are computed into a small offscreen buffer and
 * upscaled, which produces the grainy speckle look for free.
 */
(function () {
  'use strict';

  var canvas = document.querySelector('[data-scan]');
  if (!canvas || !canvas.getContext) return;
  var screen = canvas.parentElement;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ACCENT = '#a8c8e8';            // powder blue; the screen is dark in both themes
  var HALF = 34 * Math.PI / 180;     // half opening angle of the sector
  var SWEEP_SPEED = (2 * HALF) / 1.6; // rad per second, one pass in 1.6s
  var TAU = Math.PI * 2;

  var buf = document.createElement('canvas');
  var bctx = buf.getContext('2d');
  var imageData, px;
  var BW = 0, BH = 0, N = 0;
  var inFan, radius, angle, speckle, tissue, frame, fresh;
  var geo = { ax: 0, ay: 0, r0: 0, r1: 0 };

  var blob = { x: 0, y: 0, vx: 0, vy: 0, r: 0, ready: false };
  var pointer = { active: false, x: 0, y: 0 };
  var sweep = -HALF, sweepDir = 1;
  var dpr = 1, CW = 0, CH = 0;
  var t = 0, last = 0, raf = 0, onScreen = true, paused = false;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function smoothstep(a, b, v) { var x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }

  /* ---------- Setup ---------- */

  function resize() {
    var w = screen.clientWidth, h = screen.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    CW = Math.round(w * dpr); CH = Math.round(h * dpr);
    canvas.width = CW; canvas.height = CH;

    var prevBW = BW, prevBH = BH;
    BW = Math.round(clamp(w / 2.4, 140, 260));
    BH = Math.round(BW * h / w);
    N = BW * BH;
    buf.width = BW; buf.height = BH;
    imageData = bctx.createImageData(BW, BH);
    px = imageData.data;

    geo.ax = BW / 2;
    geo.ay = -BH * 0.05;
    geo.r1 = Math.min(BH * 0.965 - geo.ay, (BW * 0.48) / Math.sin(HALF));
    geo.r0 = geo.r1 * 0.09;

    precompute();

    blob.r = geo.r1 * 0.2;
    if (!blob.ready || !prevBW) {
      blob.x = geo.ax; blob.y = geo.ay + geo.r1 * 0.58;
      blob.ready = true;
    } else {
      blob.x *= BW / prevBW; blob.y *= BH / prevBH;
    }

    // Prefill so the first frame is not empty; the sweep then refreshes it.
    for (var i = 0; i < N; i++) {
      if (inFan[i]) { frame[i] = intensity(i, t); fresh[i] = reduceMotion ? 0.35 : 0; }
    }
    render();
  }

  function precompute() {
    inFan = new Uint8Array(N);
    radius = new Float32Array(N);
    angle = new Float32Array(N);
    speckle = new Float32Array(N);
    tissue = new Float32Array(N);
    frame = new Float32Array(N);
    fresh = new Float32Array(N);

    var raw = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      // Rayleigh-distributed speckle, the statistics of real ultrasound grain
      raw[i] = Math.sqrt(-2 * Math.log(1 - Math.random() * 0.999)) * 0.62;
    }

    var span = geo.r1 - geo.r0;
    for (var y = 0; y < BH; y++) {
      for (var x = 0; x < BW; x++) {
        var i = y * BW + x;
        var dx = x + 0.5 - geo.ax, dy = y + 0.5 - geo.ay;
        var r = Math.sqrt(dx * dx + dy * dy);
        var a = Math.atan2(dx, dy);
        radius[i] = r; angle[i] = a;
        inFan[i] = (r >= geo.r0 && r <= geo.r1 && Math.abs(a) <= HALF) ? 1 : 0;

        // Speckle is elongated laterally, so blur it horizontally
        var l = raw[i - 1] || raw[i], rr = raw[i + 1] || raw[i];
        speckle[i] = (l + 2 * raw[i] + rr) / 4;

        // Static layered tissue: curved bands, one bright membrane, bright near field
        var depth = (r - geo.r0) / span;
        var bands = 0.5 + 0.5 * Math.sin(r * 0.16 + 2.4 * Math.sin(a * 3.3 + 0.7));
        var membraneR = geo.r0 + span * 0.2 + span * 0.025 * Math.sin(a * 5.0 + 1.0);
        var membrane = Math.exp(-Math.pow((r - membraneR) / 1.4, 2));
        var nearField = Math.exp(-(r - geo.r0) / (span * 0.035));
        tissue[i] = 0.24 + 0.2 * bands + 0.75 * membrane + 0.55 * nearField + 0.08 * (1 - depth);
      }
    }
  }

  /* ---------- Physics ---------- */

  function constrainTarget(tx, ty) {
    // Keep the whole body inside the sector
    var dx = tx - geo.ax, dy = ty - geo.ay;
    var r = Math.sqrt(dx * dx + dy * dy);
    var a = Math.atan2(dx, dy);
    var rMin = geo.r0 + blob.r * 2.2, rMax = geo.r1 - blob.r * 1.35;
    r = clamp(r, rMin, rMax);
    var aMax = HALF - Math.asin(Math.min(0.95, (blob.r * 1.35) / r));
    a = clamp(a, -aMax, aMax);
    return { x: geo.ax + Math.sin(a) * r, y: geo.ay + Math.cos(a) * r };
  }

  function step(dt) {
    var tx, ty;
    if (pointer.active) {
      tx = pointer.x; ty = pointer.y;
    } else {
      // Idle drift along a slow Lissajous path
      tx = geo.ax + Math.sin(t * 0.31) * geo.r1 * 0.2;
      ty = geo.ay + geo.r1 * (0.58 + 0.1 * Math.sin(t * 0.23 + 1.3));
    }
    var target = constrainTarget(tx, ty);
    var k = 22, c = 7.5;
    blob.vx += ((target.x - blob.x) * k - blob.vx * c) * dt;
    blob.vy += ((target.y - blob.y) * k - blob.vy * c) * dt;
    blob.x += blob.vx * dt;
    blob.y += blob.vy * dt;
  }

  /* ---------- Echo model ---------- */

  function intensity(i, time) {
    var x = (i % BW) + 0.5, y = ((i / BW) | 0) + 0.5;
    var r = radius[i], a = angle[i];
    var sp = speckle[i];

    var speed = Math.sqrt(blob.vx * blob.vx + blob.vy * blob.vy);
    var squash = Math.min(0.24, speed / (blob.r * 7));
    var vAng = Math.atan2(blob.vy, blob.vx);

    var dx = x - blob.x, dy = y - blob.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var phi = Math.atan2(dy, dx);
    var R = blob.r * (1
      + 0.07 * Math.sin(3 * phi + time * 0.9)
      + 0.035 * Math.sin(5 * phi - time * 1.4)
      + 0.05 * Math.sin(time * 1.7)
      + squash * Math.cos(2 * (phi - vAng)));
    var q = d - R;

    var v;
    if (q < 0) {
      // Silicone body: low echo, with three anechoic chambers that inflate in turn
      v = 0.14 * sp;
      for (var k = 0; k < 3; k++) {
        var ca = k * TAU / 3 + time * 0.22 - Math.PI / 2;
        var cx = blob.x + Math.cos(ca) * blob.r * 0.43;
        var cy = blob.y + Math.sin(ca) * blob.r * 0.43;
        var pulse = Math.max(0, Math.sin(time * 1.9 - k * TAU / 3));
        var rc = blob.r * 0.25 * (1 + 0.42 * pulse * pulse);
        var ddx = x - cx, ddy = y - cy;
        var dc = Math.sqrt(ddx * ddx + ddy * ddy) - rc;
        if (dc < 0) v = 0.025 * sp;
        v += 0.85 * Math.exp(-(dc * dc) / 1.1) * sp;
      }
    } else {
      v = tissue[i] * sp;
      // Posterior acoustic enhancement behind the fluid-filled body
      var bdx = blob.x - geo.ax, bdy = blob.y - geo.ay;
      var bR = Math.sqrt(bdx * bdx + bdy * bdy);
      if (r > bR) {
        var bA = Math.atan2(bdx, bdy);
        var halfW = Math.asin(Math.min(0.99, blob.r / bR));
        var off = Math.abs(a - bA);
        if (off < halfW) v *= 1 + 0.45 * (1 - smoothstep(halfW * 0.6, halfW, off));
      }
    }
    // Bright specular wall
    v += 1.15 * Math.exp(-(q * q) / 2.2) * (0.55 + 0.45 * sp);

    var depth = (r - geo.r0) / (geo.r1 - geo.r0);
    var gain = 1.12 - 0.5 * depth;
    var edge = 1 - 0.65 * smoothstep(HALF * 0.82, HALF, Math.abs(a));
    return v * gain * edge;
  }

  /* ---------- Draw ---------- */

  function render() {
    for (var i = 0, j = 0; i < N; i++, j += 4) {
      if (!inFan[i]) { px[j + 3] = 0; continue; }
      var v = frame[i] * (0.8 + 0.3 * fresh[i]);
      v = Math.pow(clamp(v, 0, 1.3) / 1.3, 0.8) * 255;
      px[j] = v * 0.97; px[j + 1] = v; px[j + 2] = v * 1.02;
      px[j + 3] = 255;
    }
    bctx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, CW, CH);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buf, 0, 0, CW, CH);
    drawOverlay();
  }

  function drawOverlay() {
    var s = CW / BW;
    var ax = geo.ax * s, ay = geo.ay * s, r0 = geo.r0 * s, r1 = geo.r1 * s;

    // Sector outline
    ctx.lineWidth = Math.max(1, dpr);
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.arc(ax, ay, r1, Math.PI / 2 - HALF, Math.PI / 2 + HALF);
    ctx.stroke();

    // Depth scale along the right edge
    var ticks = 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.38)';
    ctx.beginPath();
    for (var k = 0; k <= ticks; k++) {
      var rr = r0 + (r1 - r0) * k / ticks;
      var aa = HALF + 0.03;
      var x = ax + Math.sin(aa) * rr, y = ay + Math.cos(aa) * rr;
      var len = (k % 5 === 0 ? 9 : 5) * dpr;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(aa) * len, y - Math.sin(aa) * len);
    }
    ctx.stroke();

    // Focal-zone marker follows the body's depth
    var bdx = blob.x - geo.ax, bdy = blob.y - geo.ay;
    var fr = Math.sqrt(bdx * bdx + bdy * bdy) * s;
    var fa = HALF + 0.075;
    var fx = ax + Math.sin(fa) * fr, fy = ay + Math.cos(fa) * fr;
    var tri = 5 * dpr;
    ctx.fillStyle = ACCENT;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + tri * 1.4, fy - tri);
    ctx.lineTo(fx + tri * 1.4, fy + tri);
    ctx.closePath();
    ctx.fill();

    // Scan line
    if (!reduceMotion) {
      ctx.strokeStyle = ACCENT;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.25 * dpr;
      ctx.beginPath();
      ctx.moveTo(ax + Math.sin(sweep) * r0, ay + Math.cos(sweep) * r0);
      ctx.lineTo(ax + Math.sin(sweep) * r1, ay + Math.cos(sweep) * r1);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- Loop ---------- */

  function tick(now) {
    raf = 0;
    var dt = Math.min(0.033, (now - (last || now)) / 1000);
    last = now;
    t += dt;
    step(dt);

    var prev = sweep;
    sweep += sweepDir * SWEEP_SPEED * dt;
    if (sweep > HALF) { sweep = HALF; sweepDir = -1; }
    if (sweep < -HALF) { sweep = -HALF; sweepDir = 1; }
    var lo = Math.min(prev, sweep) - 0.004, hi = Math.max(prev, sweep) + 0.004;

    for (var i = 0; i < N; i++) {
      if (!inFan[i]) continue;
      var a = angle[i];
      if (a >= lo && a <= hi) { frame[i] = intensity(i, t); fresh[i] = 1; }
      else fresh[i] *= 0.95;
    }
    render();
    schedule();
  }

  function schedule() {
    if (!raf && onScreen && !paused && !reduceMotion && !document.hidden) raf = requestAnimationFrame(tick);
  }

  /* ---------- Input ---------- */

  function toBuffer(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width * BW, y: (e.clientY - rect.top) / rect.height * BH };
  }
  if (!reduceMotion) {
    screen.addEventListener('pointermove', function (e) {
      var p = toBuffer(e);
      pointer.x = p.x; pointer.y = p.y; pointer.active = true;
    });
    screen.addEventListener('pointerleave', function () { pointer.active = false; });
    screen.addEventListener('pointercancel', function () { pointer.active = false; });
  }

  /* ---------- Lifecycle ---------- */

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { resize(); }).observe(screen);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) { last = 0; schedule(); }
    }).observe(screen);
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { last = 0; schedule(); }
  });
  schedule();

  // Pause control: moving content must be stoppable (WCAG 2.2.2)
  var toggle = document.querySelector('[data-scan-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Play the scan animation' : 'Pause the scan animation');
      if (paused) { if (raf) cancelAnimationFrame(raf); raf = 0; }
      else { last = 0; schedule(); }
    });
  }
})();
