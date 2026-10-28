(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.getElementById('yr').textContent = new Date().getFullYear();

  // theme toggle (remembered per browser when storage is available)
  var root = document.documentElement;
  try { var saved = localStorage.getItem('jd-theme-v2'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  var themeBtn = document.getElementById('theme');
  var lightMQ = window.matchMedia('(prefers-color-scheme: light)');
  function isSummer() { var t = root.getAttribute('data-theme'); return t ? t === 'light' : lightMQ.matches; }
  function themeLabel() { themeBtn.textContent = 'theme: ' + (isSummer() ? 'summer' : 'storm'); }
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function syncTheme() {
    var s = isSummer();
    root.classList.toggle('theme-summer', s); root.classList.toggle('theme-storm', !s);
    if (metaTheme) metaTheme.setAttribute('content', s ? '#ffe9b0' : '#0b1020');
    themeLabel();
  }
  function setTheme(next) {
    function apply() {
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('jd-theme-v2', next); } catch (e) {}
      syncTheme();
    }
    if (reduce) { apply(); return; }
    // best case: the browser crossfades snapshots on the compositor
    if (document.startViewTransition) { document.startViewTransition(apply); return; }
    // fallback: fade a veil that wears the old sky away
    var aur = document.querySelector('.aurora'), veil = document.createElement('div');
    veil.className = 'veil';
    veil.style.background = getComputedStyle(aur).backgroundImage;
    document.body.appendChild(veil);
    apply();
    requestAnimationFrame(function () { requestAnimationFrame(function () { veil.style.opacity = '0'; }); });
    setTimeout(function () { if (veil.parentNode) veil.parentNode.removeChild(veil); }, 700);
  }
  themeBtn.addEventListener('click', function () { setTheme(isSummer() ? 'dark' : 'light'); });
  if (lightMQ.addEventListener) lightMQ.addEventListener('change', syncTheme);
  syncTheme();

  // lightning around the profile picture
  (function () {
    var cv = document.getElementById('fx');
    if (reduce || !cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), frame = cv.parentElement.querySelector('.frame');
    var W = 0, H = 0, cx = 0, cy = 0, R = 0, dpr = 1, bolts = [], flash = 0, wait = 20, visible = true;
    var tick = 0, storm = isStorm();
    function isStorm() { return !isSummer(); }
    function summer(t) {
      ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
      var N = 16, i;
      for (i = 0; i < N; i++) {
        var th = i / N * 6.2832 + t * 0.18, up = 0.5 - 0.5 * Math.sin(th);
        var len = (20 + 78 * up) * (0.75 + 0.25 * Math.sin(t * 1.6 + i * 1.7));
        var hw = 0.075;
        var ix = cx + Math.cos(th) * R * 0.97, iy = cy + Math.sin(th) * R * 0.97;
        var ax = cx + Math.cos(th) * (R + len), ay = cy + Math.sin(th) * (R + len);
        var g = ctx.createLinearGradient(ix, iy, ax, ay);
        g.addColorStop(0, 'rgba(255,205,60,0.85)'); g.addColorStop(1, 'rgba(255,140,40,0)');
        ctx.fillStyle = g; ctx.beginPath();
        ctx.moveTo(cx + Math.cos(th - hw) * R * 0.97, cy + Math.sin(th - hw) * R * 0.97);
        ctx.lineTo(ax, ay);
        ctx.lineTo(cx + Math.cos(th + hw) * R * 0.97, cy + Math.sin(th + hw) * R * 0.97);
        ctx.closePath(); ctx.fill();
      }
      ctx.shadowColor = 'rgba(255,170,30,0.9)'; ctx.shadowBlur = fine ? 8 : 0;
      for (i = 0; i < 16; i++) {
        var ang = i * 2.4 + t * 0.22, rad = R + 12 + (i * 37) % 56;
        if (Math.sin(ang) > 0.75) continue;
        var tw = 0.5 + 0.5 * Math.sin(t * 2.4 + i * 1.3), sz = 1.6 + (i % 3) * 0.9;
        ctx.globalAlpha = 0.25 + 0.75 * tw; ctx.fillStyle = '#fff7c4';
        ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, sz, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
    function fit() {
      dpr = Math.min(window.devicePixelRatio || 1, fine ? 2 : 1.5);
      var b = cv.getBoundingClientRect(), f = frame.getBoundingClientRect();
      W = b.width; H = b.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      R = f.width / 2; cx = f.left - b.left + R; cy = f.top - b.top + R;
    }
    function jag(x0, y0, x1, y1, disp, out) {
      if (disp < 2.5) { out.push([x1, y1]); return; }
      var mx = (x0 + x1) / 2 + (Math.random() - 0.5) * disp, my = (y0 + y1) / 2 + (Math.random() - 0.5) * disp;
      jag(x0, y0, mx, my, disp / 2, out); jag(mx, my, x1, y1, disp / 2, out);
    }
    function path(x0, y0, ang, len) {
      var pts = [[x0, y0]];
      jag(x0, y0, x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len, len * 0.38, pts);
      return pts;
    }
    function strike(big) {
      var a = Math.random() * 6.2832, len = R * (big ? 0.85 + Math.random() * 0.6 : 0.3 + Math.random() * 0.3);
      var x0 = cx + Math.cos(a) * R * 1.02, y0 = cy + Math.sin(a) * R * 1.02;
      var main = path(x0, y0, a + (Math.random() - 0.5) * 0.5, len), parts = [main];
      if (big) {
        for (var i = 0; i < 2; i++) {
          var k = main[Math.floor(main.length * (0.25 + Math.random() * 0.5))];
          parts.push(path(k[0], k[1], a + (Math.random() - 0.5) * 1.6, len * 0.45));
        }
        flash = 1;
        if (window.jdCrackle) window.jdCrackle();
      }
      bolts.push({ parts: parts, life: 0, max: big ? 16 : 10, w: big ? 1 : 0.6 });
    }
    var raf = 0, lastSummer = 0, lastStorm = 0;
    function loop(ts) {
      raf = 0;
      if (!visible || document.hidden) return; // stop completely while off screen
      raf = requestAnimationFrame(loop);
      draw(ts || performance.now());
    }
    function kick() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); }
    function draw(ts) {
      var now = isStorm();
      if (now !== storm) { storm = now; bolts = []; flash = 0; }
      if (!storm) {
        if (ts - lastSummer < 32) return; // slow scene: 30fps is plenty
        lastSummer = ts;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
        summer(ts / 1000); return;
      }
      if (ts - lastStorm < 14) return; // same speed on 60Hz and 120Hz screens
      lastStorm = ts;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      if (--wait <= 0) {
        var n = 1 + Math.floor(Math.random() * 3);
        for (var i = 0; i < n; i++) strike(Math.random() < 0.6);
        wait = 5 + Math.random() * 20;
      }
      if (flash > 0.02) {
        var g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.34);
        g.addColorStop(0, 'rgba(120,140,255,' + (flash * 0.5).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(120,140,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.34, 0, 6.2832); ctx.fill();
        flash *= 0.86;
      }
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      bolts.forEach(function (b) {
        b.life++;
        var t = b.life / b.max, a = (1 - t) * (Math.random() < 0.3 ? 0.45 : 1);
        b.parts.forEach(function (pts, idx) {
          ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
          for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
          var k = idx ? 0.6 : 1;
          if (fine) {
            ctx.shadowColor = 'rgba(90,110,255,' + a.toFixed(3) + ')'; ctx.shadowBlur = 20;
          } else {
            // phones: a wide soft stroke imitates the glow without the costly shadow blur
            ctx.strokeStyle = 'rgba(90,110,255,' + (a * 0.28).toFixed(3) + ')'; ctx.lineWidth = 16 * k * b.w; ctx.stroke();
          }
          ctx.strokeStyle = 'rgba(70,90,255,' + (a * 0.9).toFixed(3) + ')'; ctx.lineWidth = 7 * k * b.w; ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')'; ctx.lineWidth = 2.6 * k * b.w; ctx.stroke();
        });
      });
      bolts = bolts.filter(function (b) { return b.life < b.max; });
    }
    fit();
    var rz = 0;
    window.addEventListener('resize', function () {
      if (rz) return;
      rz = requestAnimationFrame(function () {
        rz = 0;
        var b = cv.getBoundingClientRect();
        if (Math.abs(b.width - W) > 1 || Math.abs(b.height - H) > 1) fit(); // ignore phone address-bar resizes
      });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; kick(); }).observe(cv);
    }
    document.addEventListener('visibilitychange', kick);
    kick();
  })();

  // theme sound: rain + thunder for the storm, ocean waves + bird chirps for the summer (made live with Web Audio, no files)
  (function () {
    var btn = document.getElementById('sound');
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!btn) return;
    if (!AC) { btn.hidden = true; return; }
    var enabled = true;
    try { if (localStorage.getItem('jd-sound') === 'off') enabled = false; } catch (e) {}
    var ac = null, master, rainG, auroraG, chimeBus, noiseBuf, lastCrackle = 0;
    function isStorm() { return !isSummer(); }
    function label() { btn.textContent = 'sound: ' + (enabled ? 'on' : 'off'); btn.setAttribute('aria-pressed', enabled ? 'true' : 'false'); }
    function noiseSrc() { var n = ac.createBufferSource(); n.buffer = noiseBuf; n.loop = true; return n; }
    function build() {
      ac = new AC();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      var len = ac.sampleRate * 2; noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
      var d = noiseBuf.getChannelData(0); for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

      // rain: bright hiss + softer body
      rainG = ac.createGain(); rainG.gain.value = 0; rainG.connect(master);
      var n1 = noiseSrc(), hp = ac.createBiquadFilter(), g1 = ac.createGain();
      hp.type = 'highpass'; hp.frequency.value = 1400; g1.gain.value = 0.35;
      n1.connect(hp); hp.connect(g1); g1.connect(rainG); n1.start();
      var n2 = noiseSrc(), bp = ac.createBiquadFilter(), g2 = ac.createGain();
      bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.6; g2.gain.value = 0.55;
      n2.connect(bp); bp.connect(g2); g2.connect(rainG); n2.start(0, 0.9);

      // summer: rolling ocean waves + bird chirps
      auroraG = ac.createGain(); auroraG.gain.value = 0; auroraG.connect(master);
      var wn = noiseSrc(), wlp = ac.createBiquadFilter(), wg = ac.createGain();
      wlp.type = 'lowpass'; wlp.frequency.value = 800; wg.gain.value = 0.2;
      wn.connect(wlp); wlp.connect(wg); wg.connect(auroraG); wn.start(0, 0.4);
      var foam = ac.createBiquadFilter(), fg = ac.createGain(); foam.type = 'highpass'; foam.frequency.value = 2200; fg.gain.value = 0.05;
      var fn = noiseSrc(); fn.connect(foam); foam.connect(fg); fg.connect(wg); fn.start(0, 1.1);
      var swell = ac.createOscillator(), sg = ac.createGain();
      swell.frequency.value = 0.11; sg.gain.value = 0.17; swell.connect(sg); sg.connect(wg.gain); swell.start();
      var sg2 = ac.createGain(); sg2.gain.value = 450; swell.connect(sg2); sg2.connect(wlp.frequency);
      chimeBus = ac.createGain(); chimeBus.connect(auroraG);
    }
    function apply() {
      if (!ac) return;
      var t = ac.currentTime, storm = isStorm();
      master.gain.setTargetAtTime(enabled ? 0.8 : 0, t, 0.25);
      rainG.gain.setTargetAtTime(storm ? 0.12 : 0, t, 0.8);
      auroraG.gain.setTargetAtTime(storm ? 0 : 0.3, t, 0.8);
    }
    function start() {
      if (!enabled) return;
      if (!ac) build();
      if (ac.state === 'suspended') ac.resume();
      apply();
    }
    function live() { return ac && enabled && !document.hidden && ac.state === 'running'; }
    function thunder() {
      if (!live() || !isStorm()) return;
      var t = ac.currentTime, src = noiseSrc(), lp = ac.createBiquadFilter(), g = ac.createGain();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(450, t); lp.frequency.exponentialRampToValueAtTime(60, t + 2.8);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(2.4, t + 0.18);
      g.gain.exponentialRampToValueAtTime(0.001, t + 3.4);
      src.connect(lp); lp.connect(g); g.connect(master); src.start(0, Math.random()); src.stop(t + 3.5);
    }
    function crackle() {
      var now = performance.now();
      if (!live() || !isStorm() || now - lastCrackle < 1400) return;
      lastCrackle = now;
      var t = ac.currentTime, src = noiseSrc(), bp = ac.createBiquadFilter(), g = ac.createGain();
      bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.8;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      src.connect(bp); bp.connect(g); g.connect(master); src.start(0, Math.random()); src.stop(t + 0.2);
    }
    window.jdCrackle = crackle;
    function chime() {
      if (live() && !isStorm()) {
        var t = ac.currentTime, base = 2600 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 3), k;
        for (k = 0; k < n; k++) {
          var st = t + k * 0.13, o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(base, st); o.frequency.exponentialRampToValueAtTime(base * 1.45, st + 0.08);
          g.gain.setValueAtTime(0.0001, st); g.gain.linearRampToValueAtTime(0.05, st + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.1);
          o.connect(g); g.connect(chimeBus); o.start(st); o.stop(st + 0.12);
        }
      }
      setTimeout(chime, 2500 + Math.random() * 4500);
    }
    chime();

    // thunder follows each big sky flash by a moment, like the real thing
    Array.prototype.forEach.call(document.querySelectorAll('.flash'), function (el) {
      el.addEventListener('animationiteration', function () {
        var dur = el.classList.contains('f2') ? 13 : 9;
        setTimeout(thunder, dur * 1000 * 0.07 + 500 + Math.random() * 1200);
      });
    });

    // browsers only allow sound after a tap, click or key press
    function first() {
      ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.removeEventListener(ev, first, true); });
      start();
    }
    ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.addEventListener(ev, first, true); });

    btn.addEventListener('click', function () {
      enabled = !enabled;
      try { localStorage.setItem('jd-sound', enabled ? 'on' : 'off'); } catch (e) {}
      label();
      if (enabled) start(); else apply();
    });
    if ('MutationObserver' in window) new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);
    document.addEventListener('visibilitychange', function () {
      if (!ac || !enabled) return;
      if (document.hidden) ac.suspend(); else ac.resume();
    });
    label();
  })();

  // pause endless animations while they are off screen
  if ('IntersectionObserver' in window) {
    var offIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('off', !e.isIntersecting); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.marquee, .portrait'), function (n) { offIO.observe(n); });
  }

  // typing effect
  var roles = ['BSIT student', 'web developer in the making', 'JavaScript tinkerer', 'XML explorer'];
  var el = document.getElementById('role');
  if (!reduce) {
    var r = 0, c = 0, del = false;
    (function tick() {
      var word = roles[r];
      el.textContent = word.slice(0, c);
      var wait = del ? 40 : 85;
      if (!del && c === word.length) { del = true; wait = 1500; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      else { c += del ? -1 : 1; }
      setTimeout(tick, wait);
    })();
  }

  // cursor glow
  if (fine && !reduce) {
    var glow = document.getElementById('glow');
    var tx = 0, ty = 0, x = 0, y = 0, started = false;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!started) { x = tx; y = ty; started = true; glow.classList.add('on'); }
    });
    document.addEventListener('pointerleave', function () { glow.classList.remove('on'); started = false; });
    var graf = 0;
    function loop() {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      glow.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      graf = (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) ? requestAnimationFrame(loop) : 0; // sleeps when the cursor rests
    }
    window.addEventListener('pointermove', function () { if (!graf) graf = requestAnimationFrame(loop); }, { passive: true });

    // card tilt
    document.querySelectorAll('.tilt').forEach(function (card) {
      var traf = 0, last = null;
      card.addEventListener('pointermove', function (e) {
        last = e;
        if (traf) return;
        traf = requestAnimationFrame(function () {
          traf = 0;
          var b = card.getBoundingClientRect();
          var px = (last.clientX - b.left) / b.width - 0.5;
          var py = (last.clientY - b.top) / b.height - 0.5;
          card.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
          card.style.setProperty('--rx', (-py * 9).toFixed(2) + 'deg');
        });
      }, { passive: true });
      card.addEventListener('pointerleave', function () {
        if (traf) { cancelAnimationFrame(traf); traf = 0; }
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // scroll reveal: hide only what sits below the first screen, then bring it in
  if (!reduce && 'IntersectionObserver' in window) {
    var items = document.querySelectorAll('.rv, .card, .chips li');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var t = en.target;
          t.classList.remove('pre'); io.unobserve(t);
          setTimeout(function () { t.classList.remove('reveal'); t.style.transitionDelay = ''; }, 1000);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (n, i) {
      var top = n.getBoundingClientRect().top;
      if (top > window.innerHeight) {
        n.classList.add('reveal', 'pre');
        n.style.transitionDelay = (n.matches('.card, .chips li') ? (i % 3) * 90 : 0) + 'ms';
        io.observe(n);
      }
    });
  }
})();

// Contact form: sent in the background so it works for every visitor, with no email app
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var btn = form.querySelector('button[type="submit"]');
  var EMAIL = 'joshuadimasaca098@gmail.com';
  var LABEL = btn ? btn.textContent : 'Send message';
  var sending = false;

  // The form's action decides who delivers the message:
  //   https://formspree.io/f/<form id>    -> Formspree (the one in use)
  //   https://formsubmit.co/<email>       -> FormSubmit, as an alternative
  var action = (form.getAttribute('action') || '').trim();
  var endpoint = '';
  if (/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(action)) {
    endpoint = action;
  } else if (/^https:\/\/formsubmit\.co\/(?!ajax\/)[^\/?#]+$/.test(action)) {
    endpoint = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
  }

  function say(msg, cls) {
    status.className = 'form-status' + (cls ? ' ' + cls : '');
    status.textContent = msg;
  }

  function value(name) {
    var field = form.elements[name];
    return field ? String(field.value || '').replace(/^\s+|\s+$/g, '') : '';
  }

  function problem(body) {
    if (!body) return '';
    if (body.errors && body.errors.length) {
      return body.errors.map(function (err) { return err.message; }).join(', ');
    }
    return body.message || body.error || '';
  }

  form.addEventListener('input', function () {
    if (status.className.indexOf('err') !== -1) say('');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    if (value('_honey') || value('_gotcha')) return; // a bot filled the hidden field

    var name = value('name'), email = value('email'), message = value('message');
    if (!name || !email || !message) {
      say('Please fill in your name, email and message.', 'err');
      var missing = !name ? form.elements.name : !email ? form.elements.email : form.elements.message;
      if (missing && missing.focus) missing.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say('That email address does not look right. Please check it.', 'err');
      form.elements.email.focus();
      return;
    }
    if (!endpoint) {
      // Only reached if the form's action was removed; visitors still get a way to reach me
      say('Sending is not available right now. Please email me at ' + EMAIL + '.', 'err');
      return;
    }

    var data = new FormData(form);
    data.set('name', name);
    data.set('email', email);
    data.set('message', message);

    sending = true;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    say('Sending your message...');

    // Formspree normally answers in under a second; 12s leaves room for slow phones
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 12000) : null;

    fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' },
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (res) {
        return res.text().then(function (text) {
          var body = null;
          try { body = text ? JSON.parse(text) : {}; } catch (err) { body = null; }
          return { ok: res.ok, body: body };
        });
      })
      .then(function (out) {
        // Only a JSON reply from the service counts as success
        var ok = out.ok && out.body && out.body.success !== false && out.body.success !== 'false' && out.body.ok !== false;
        if (!ok) {
          var why = problem(out.body) || (out.ok ? 'The message service sent an unexpected reply.' : 'The message could not be sent.');
          throw new Error(why);
        }
        form.reset();
        var first = name.split(/\s+/)[0].slice(0, 40);
        say('Thanks, ' + first + '! Your message was sent. I will reply to ' + email + ' soon.', 'ok');
      })
      .catch(function (err) {
        var msg = err && err.name === 'AbortError' ? 'The mail service did not respond in time.' : '';
        if (!msg && err && /failed to fetch|networkerror|load failed/i.test(err.message || '')) msg = 'There is a network problem.';
        if (!msg) msg = (err && err.message) || 'Something went wrong.';
        say(msg + ' Please try again, or email me at ' + EMAIL + '.', 'err');
      })
      .then(function () {
        if (timer) clearTimeout(timer);
        sending = false;
        btn.disabled = false;
        btn.textContent = LABEL;
      });
  });
})();
