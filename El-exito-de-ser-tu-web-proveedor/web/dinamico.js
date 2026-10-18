/* Dinamismo de la landing: aparición al hacer scroll, cuenta atrás y botón fijo en móvil. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;

  /* 1. Aparición suave de los bloques que están por debajo de la primera pantalla. */
  if (!reduceMotion && hasObserver) {
    var selectors = [
      '.intro-section h2', '.intro-section p', '.line-question', '.inline-enroll',
      '.section-heading > *', '.session', '.timing', '.program-enroll',
      '.approved-portrait', '.approved-bio > *',
      '.approved-motto blockquote', '.approved-motto .signature-mark',
      '.enroll-pitch > *', '.enroll-date', '.approved-education > *',
      '[data-reveal]'
    ];
    var targets = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')))
      .filter(function (el) { return el.getBoundingClientRect().top > window.innerHeight; });

    var revealObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; });
      visible.forEach(function (entry, index) {
        var el = entry.target;
        el.style.transitionDelay = Math.min(index * 90, 450) + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
        // Al terminar, se quita la clase para devolver al elemento sus transiciones propias (p. ej. hover
        // de los botones). Los títulos con subrayado animado se dejan, porque su animación dura más.
        if (el.querySelector('.highlight')) return;
        el.addEventListener('transitionend', function done(event) {
          if (event.target !== el || event.propertyName !== 'opacity') return;
          el.removeEventListener('transitionend', done);
          el.classList.remove('reveal', 'is-visible');
          el.style.transitionDelay = '';
        });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  /* 2. Cuenta atrás hasta el 28 de noviembre de 2026, 11:00 en Madrid (10:00 UTC). */
  var start = Date.UTC(2026, 10, 28, 10, 0, 0);
  var countdown = document.querySelector('[data-countdown]');
  var shortCountdown = document.querySelector('[data-countdown-short]');
  var units = countdown ? {
    days: countdown.querySelector('[data-unit="days"]'),
    hours: countdown.querySelector('[data-unit="hours"]'),
    minutes: countdown.querySelector('[data-unit="minutes"]'),
    seconds: countdown.querySelector('[data-unit="seconds"]')
  } : null;

  function pad(value) { return value < 10 ? '0' + value : String(value); }

  function tick() {
    var remaining = start - Date.now();
    if (remaining <= 0) {
      if (countdown) countdown.hidden = true;
      if (shortCountdown) shortCountdown.textContent = '';
      return false;
    }
    var totalSeconds = Math.floor(remaining / 1000);
    var days = Math.floor(totalSeconds / 86400);
    if (units) {
      countdown.hidden = false;
      units.days.textContent = pad(days);
      units.hours.textContent = pad(Math.floor(totalSeconds % 86400 / 3600));
      units.minutes.textContent = pad(Math.floor(totalSeconds % 3600 / 60));
      units.seconds.textContent = pad(totalSeconds % 60);
    }
    if (shortCountdown) {
      shortCountdown.textContent = days > 1 ? 'FALTAN ' + days + ' DÍAS' : days === 1 ? 'FALTA 1 DÍA' : 'ES HOY';
    }
    return true;
  }

  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* 3. Botón "Me apunto" fijo en móvil: aparece al dejar atrás la portada
        y se oculta cuando ya se ve el bloque de inscripción o el pie. */
  var sticky = document.querySelector('[data-sticky-cta]');
  var hero = document.querySelector('.hero');
  if (sticky && hero && hasObserver) {
    var state = { hero: true, enroll: false, footer: false };
    var watched = [
      [hero, 'hero'],
      [document.getElementById('inscripcion'), 'enroll'],
      [document.querySelector('footer'), 'footer']
    ];
    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        watched.forEach(function (pair) { if (pair[0] === entry.target) state[pair[1]] = entry.isIntersecting; });
      });
      var show = !state.hero && !state.enroll && !state.footer;
      sticky.classList.toggle('is-visible', show);
      sticky.inert = !show;
    });
    watched.forEach(function (pair) { if (pair[0]) stickyObserver.observe(pair[0]); });
  }
})();
