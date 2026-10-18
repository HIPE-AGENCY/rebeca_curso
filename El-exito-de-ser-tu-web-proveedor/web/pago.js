/* Inscripción: guarda el contacto en Brevo como "interesado" y abre el pago de Stripe con el email ya rellenado.
   Rellena las dos direcciones cuando existan. */
var RC_PAGO = {
  // Brevo → Contactos → Formularios → (formulario de la lista "Interesados") → Compartir → copiar la URL del atributo
  // action del formulario HTML. Tiene la forma https://xxxx.sibforms.com/serve/MUIF...
  brevoFormUrl: '',
  // Stripe → Enlaces de pago → (enlace del taller) → copiar URL. Tiene la forma https://buy.stripe.com/xxxx
  stripePaymentLink: ''
};

(function (config) {
  var form = document.getElementById('registration-form');
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  var status = document.getElementById('form-status');
  var buttonText = button.innerHTML;

  function sendToBrevo(data) {
    if (!config.brevoFormUrl) return Promise.resolve();
    var body = new FormData();
    body.append('FIRSTNAME', data.name);
    body.append('EMAIL', data.email);
    body.append('NEWSLETTER', data.newsletter ? 'true' : 'false');
    body.append('email_address_check', ''); // campo trampa anti-spam de los formularios de Brevo
    body.append('locale', 'es');
    // Brevo no permite leer la respuesta desde otro dominio (no-cors); se envía y se continúa.
    var request = fetch(config.brevoFormUrl, { method: 'POST', body: body, mode: 'no-cors', keepalive: true }).catch(function () {});
    var timeout = new Promise(function (resolve) { setTimeout(resolve, 2500); });
    return Promise.race([request, timeout]);
  }

  function stripeUrl(email) {
    var separator = config.stripePaymentLink.indexOf('?') === -1 ? '?' : '&';
    return config.stripePaymentLink + separator + 'prefilled_email=' + encodeURIComponent(email) + '&locale=es';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var data = {
      name: form.FIRSTNAME.value.trim(),
      email: form.EMAIL.value.trim(),
      newsletter: form.NEWSLETTER.checked
    };

    if (!config.stripePaymentLink) {
      status.textContent = 'El enlace de pago aún no está configurado.';
      return;
    }

    button.disabled = true;
    button.textContent = 'Abriendo el pago seguro…';
    sendToBrevo(data).then(function () {
      window.location.href = stripeUrl(data.email);
    });
  });

  // Si vuelven con el botón "atrás" del navegador, reactivar el botón.
  window.addEventListener('pageshow', function () {
    button.disabled = false;
    button.innerHTML = buttonText;
  });
})(RC_PAGO);
