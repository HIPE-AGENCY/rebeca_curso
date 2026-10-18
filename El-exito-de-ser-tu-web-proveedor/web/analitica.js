/* Medición y consentimiento de cookies.
   Rellena los identificadores de las herramientas que se usen; las que queden vacías no se cargan
   ni aparecen en el banner. Si todas están vacías, no se muestra banner (la web no usa cookies). */
var RC_ANALITICA = {
  clarityId: 'yzm0le6g9z',      // Microsoft Clarity → Settings → Setup → Project ID (p. ej. 'abcd1234ef')
  ga4Id: 'G-RH0HZN0T9X',          // Google Analytics 4 → Administrar → Flujos de datos → ID de medición (p. ej. 'G-XXXXXXXXXX')
  metaPixelId: ''     // Meta Business → Administrador de eventos → ID del píxel (solo si habrá anuncios en Meta)
};

(function (config) {
  var STORAGE_KEY = 'rc-consent';
  var CONSENT_VERSION = 1;
  var hasAnalytics = !!(config.clarityId || config.ga4Id);
  var hasMarketing = !!config.metaPixelId;
  var loaded = { clarity: false, ga4: false, meta: false };

  window.rcTrack = function () {};

  // En la política de cookies, mostrar solo las herramientas que están activas.
  function syncPolicyPage() {
    var active = { clarity: !!config.clarityId, ga4: !!config.ga4Id, meta: !!config.metaPixelId };
    document.querySelectorAll('[data-rc-tool]').forEach(function (row) { row.hidden = !active[row.getAttribute('data-rc-tool')]; });
    var none = document.querySelector('[data-rc-none]');
    if (none) none.hidden = hasAnalytics || hasMarketing;
    document.querySelectorAll('[data-rc-any]').forEach(function (el) { el.hidden = !hasAnalytics && !hasMarketing; });
    if (!hasAnalytics && !hasMarketing) {
      document.querySelectorAll('button[data-cookie-settings]').forEach(function (button) { button.hidden = true; });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncPolicyPage); else syncPolicyPage();

  // Sin herramientas configuradas no hay banner; el enlace "Configurar cookies" lleva a la política.
  if (!hasAnalytics && !hasMarketing) return;

  /* ---------- Consentimiento guardado ---------- */
  function readConsent() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      // La elección caduca a los 12 meses y se vuelve a preguntar.
      var fresh = stored && Date.now() - new Date(stored.date).getTime() < 365 * 864e5;
      return stored && stored.v === CONSENT_VERSION && fresh ? stored : null;
    } catch (e) { return null; }
  }
  function saveConsent(analytics, marketing) {
    var consent = { v: CONSENT_VERSION, analytics: analytics, marketing: marketing, date: new Date().toISOString() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (e) {}
    return consent;
  }

  /* ---------- Carga de herramientas (solo tras aceptar) ---------- */
  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }
  function loadClarity() {
    if (loaded.clarity || !config.clarityId) return;
    loaded.clarity = true;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(config.clarityId));
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  }
  function loadGA4() {
    if (loaded.ga4 || !config.ga4Id) return;
    loaded.ga4 = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', config.ga4Id);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.ga4Id));
  }
  function loadMeta() {
    if (loaded.meta || !config.metaPixelId) return;
    loaded.meta = true;
    var fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', config.metaPixelId);
    fbq('track', 'PageView');
  }
  function applyConsent(consent) {
    if (consent.analytics) { loadClarity(); loadGA4(); }
    if (consent.marketing) loadMeta();
    if (consent.analytics || consent.marketing) trackPurchaseOnce();
  }

  /* Al retirar el consentimiento: borrar las cookies de estas herramientas y recargar. */
  function clearTrackingCookies() {
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); });
    var host = location.hostname.replace(/^www\./, '');
    names.filter(function (n) { return /^(_ga|_gid|_gat|_clck|_clsk|_fbp|_fbc)/.test(n); }).forEach(function (n) {
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (domain) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + domain;
      });
    });
  }

  /* ---------- Eventos de medición ---------- */
  var PRODUCT = { item_id: 'el-exito-de-ser-tu-2026-11-28', item_name: 'El éxito de ser tú · 28 nov 2026', price: 150, quantity: 1 };
  // Equivalencias con los eventos estándar de Meta.
  var META_EVENTS = { generate_lead: 'Lead', begin_checkout: 'InitiateCheckout', purchase: 'Purchase' };

  window.rcTrack = function (name, params) {
    params = params || {};
    if (loaded.ga4 && window.gtag) window.gtag('event', name, params);
    if (loaded.clarity && window.clarity) window.clarity('event', name);
    if (loaded.meta && window.fbq && META_EVENTS[name]) {
      var metaParams = { content_name: PRODUCT.item_name, currency: 'EUR', value: 150 };
      // eventID evita que Meta cuente dos veces la misma compra.
      window.fbq('track', META_EVENTS[name], metaParams, params.transaction_id ? { eventID: params.transaction_id } : undefined);
    }
  };

  function ctaLocation(link) {
    var tagged = link.closest('[data-cta]');
    if (tagged) return tagged.getAttribute('data-cta');
    var zones = [['.sticky-cta', 'boton_fijo_movil'], ['header', 'cabecera'], ['.hero', 'portada'], ['.intro-section', 'preguntas'],
      ['.program', 'programa'], ['.enroll-redesign', 'inscripcion'], ['footer', 'pie']];
    for (var i = 0; i < zones.length; i++) if (link.closest(zones[i][0])) return zones[i][1];
    return 'otro';
  }
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href*="inscripcion"]');
    if (link) window.rcTrack('cta_click', { cta_location: ctaLocation(link) });
  });
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (form.id !== 'registration-form' || !form.checkValidity()) return;
    if (form.hasAttribute('data-checkout')) {
      // Formulario con pago: interesado registrado y salida hacia Stripe.
      window.rcTrack('generate_lead', { method: 'formulario', currency: 'EUR', value: 150 });
      window.rcTrack('begin_checkout', { currency: 'EUR', value: 150, items: [PRODUCT] });
      return;
    }
    var method = event.submitter && event.submitter.value === 'email' ? 'email' : 'whatsapp';
    window.rcTrack('generate_lead', { method: method, currency: 'EUR', value: 150 });
  });

  // Página de gracias: Stripe vuelve con ?session_id=cs_... Solo se cuenta una vez por compra.
  function trackPurchaseOnce() {
    if (!document.querySelector('[data-rc-purchase]')) return;
    var sessionId = new URLSearchParams(location.search).get('session_id') || '';
    if (!/^cs_/.test(sessionId)) return;
    var key = 'rc-purchase-' + sessionId;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {}
    window.rcTrack('purchase', { transaction_id: sessionId, currency: 'EUR', value: 150, items: [PRODUCT] });
  }

  // Qué secciones llegan a verse y hasta dónde se baja.
  if ('IntersectionObserver' in window) {
    var sections = [['#programa', 'programa'], ['#rebeca', 'sobre_rebeca'], ['#inscripcion', 'precio_y_fecha']];
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        window.rcTrack('section_view', { section: entry.target.getAttribute('data-rc-section') });
        sectionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    sections.forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (el) { el.setAttribute('data-rc-section', pair[1]); sectionObserver.observe(el); }
    });
  }
  var depthsSent = {};
  window.addEventListener('scroll', function () {
    var doc = document.documentElement;
    var percent = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
    [25, 50, 75, 100].forEach(function (mark) {
      if (percent >= mark - 1 && !depthsSent[mark]) { depthsSent[mark] = true; window.rcTrack('scroll_depth', { percent: mark }); }
    });
  }, { passive: true });

  /* ---------- Banner ---------- */
  var banner;
  function buildBanner() {
    var tools = [];
    if (config.clarityId) tools.push('Microsoft Clarity');
    if (config.ga4Id) tools.push('Google Analytics');
    if (config.metaPixelId) tools.push('Meta');
    banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML =
      '<p class="cookie-title">Cookies</p>' +
      '<p>Usamos cookies de terceros (' + tools.join(', ') + ') para saber cómo se usa esta página' +
      (hasMarketing ? ' y medir nuestras campañas' : '') + '. Solo se activan si las aceptas. ' +
      '<a href="cookies.html">Política de cookies</a>.</p>' +
      '<div class="cookie-options" hidden>' +
        (hasAnalytics ? '<label><input type="checkbox" name="analytics"> <span><strong>Analíticas</strong> Visitas, origen, recorrido y mapas de calor.</span></label>' : '') +
        (hasMarketing ? '<label><input type="checkbox" name="marketing"> <span><strong>Publicidad</strong> Medir las campañas de Meta (Instagram y Facebook).</span></label>' : '') +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" data-action="reject">Rechazar</button>' +
        '<button type="button" data-action="configure">Configurar</button>' +
        '<button type="button" data-action="save" hidden>Guardar selección</button>' +
        '<button type="button" data-action="accept">Aceptar</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (event) {
      var action = event.target.getAttribute && event.target.getAttribute('data-action');
      if (!action) return;
      if (action === 'configure') {
        var current = readConsent() || {};
        banner.querySelector('.cookie-options').hidden = false;
        banner.querySelector('[data-action="configure"]').hidden = true;
        banner.querySelector('[data-action="save"]').hidden = false;
        banner.querySelectorAll('.cookie-options input').forEach(function (input) { input.checked = !!current[input.name]; });
        return;
      }
      var analytics = action === 'accept', marketing = action === 'accept';
      if (action === 'save') {
        var a = banner.querySelector('input[name="analytics"]'), m = banner.querySelector('input[name="marketing"]');
        analytics = !!(a && a.checked); marketing = !!(m && m.checked);
      }
      decide(analytics, marketing);
    });
  }
  function openBanner() {
    if (!banner) buildBanner();
    banner.querySelector('.cookie-options').hidden = true;
    banner.querySelector('[data-action="configure"]').hidden = false;
    banner.querySelector('[data-action="save"]').hidden = true;
    banner.hidden = false;
    document.documentElement.classList.add('cookie-banner-open');
  }
  function closeBanner() {
    if (banner) banner.hidden = true;
    document.documentElement.classList.remove('cookie-banner-open');
  }
  function decide(analytics, marketing) {
    var previous = readConsent();
    var consent = saveConsent(analytics, marketing);
    closeBanner();
    var revoked = previous && ((previous.analytics && !analytics) || (previous.marketing && !marketing));
    if (revoked) { clearTrackingCookies(); location.reload(); return; }
    applyConsent(consent);
  }

  function bindCookieSettingsLinks(handler) {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest && event.target.closest('[data-cookie-settings]');
      if (!trigger) return;
      event.preventDefault();
      handler();
    });
  }
  bindCookieSettingsLinks(openBanner);

  function init() {
    var consent = readConsent();
    if (consent) applyConsent(consent); else openBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(RC_ANALITICA);
