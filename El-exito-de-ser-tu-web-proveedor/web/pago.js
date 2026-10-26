/* Inscripción: guarda el contacto en Brevo como "interesado" y abre el pago de Stripe con el email ya rellenado.
   Rellena las dos direcciones cuando existan. */
var RC_PAGO = {
  // Brevo → Contactos → Formularios → (formulario de la lista "Interesados") → Compartir → copiar la URL del atributo
  // action del formulario HTML. Tiene la forma https://xxxx.sibforms.com/serve/MUIF...
  brevoFormUrl: 'https://e0d75c2b.sibforms.com/serve/MUIFAOgxHqR6Od3M_blUzLUE_7QhYYAAl1nF7-aKg329W02ksZM3JKvR9jGSYtECYn1XgBSMcOnlNHSZlOsQ1w7VDm6cdIPvD3ob_NiQItZBmDQk79tvy9xtz9Jj3Rw0LEMC4znELRQ1UdLAzgMvx7scDS9M5Ad0We_iw-ZQrFUG-83JvhKkSsZgvQMMI_FIv5joj42W8fm92Pd4lQ==',
  // Segundo formulario de Brevo, ligado a la lista "Newsletter": solo se envía si la persona marca la casilla.
  brevoNewsletterFormUrl: 'https://e0d75c2b.sibforms.com/serve/MUIFALK0uFrqzpaVi788xANaHp1qSQCMooSPs2f1ar1KH9Mrjp8wGa18bh8CPQPy9glSK_cl7tp5jOdEqE0vDbAvgIi_Y6XEa84RPH3m8_d31yRyt51PanJKB2I5Y_i9dzQUEs6yQkw96wTUOeWAeOVV8fNu-CmSItMUhdOYK8CjVThZxs_aqQxLcIn_vZBXxMS404XjuaoNVREJ7Q==',
  // Stripe → Enlaces de pago → (enlace del taller) → copiar URL. Tiene la forma https://buy.stripe.com/xxxx
  stripePaymentLink: 'https://buy.stripe.com/test_8x2eVd8zL22h8TAcdxe7m00'
};

(function (config) {
  var form = document.getElementById('registration-form');
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  var status = document.getElementById('form-status');
  var buttonText = button.innerHTML;

  function postToBrevo(url, data) {
    var body = new FormData();
    body.append('NOMBRE', data.name);
    body.append('EMAIL', data.email);
    body.append('email_address_check', ''); // campo trampa anti-spam de los formularios de Brevo
    body.append('locale', 'es');
    // Brevo no permite leer la respuesta desde otro dominio (no-cors); se envía y se continúa.
    return fetch(url, { method: 'POST', body: body, mode: 'no-cors', keepalive: true }).catch(function () {});
  }

  function sendToBrevo(data) {
    var requests = [];
    if (config.brevoFormUrl) requests.push(postToBrevo(config.brevoFormUrl, data));
    if (data.newsletter && config.brevoNewsletterFormUrl) requests.push(postToBrevo(config.brevoNewsletterFormUrl, data));
    if (!requests.length) return Promise.resolve();
    var timeout = new Promise(function (resolve) { setTimeout(resolve, 2500); });
    return Promise.race([Promise.all(requests), timeout]);
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
