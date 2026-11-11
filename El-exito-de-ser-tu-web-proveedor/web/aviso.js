/* Lista de aviso del taller (nueva fecha: 16 de enero de 2027).
   Envía el contacto SOLO al formulario de Brevo de la lista "Newsletter".
   No usa el formulario de "Interesados": ese dispara la automatización de carrito abandonado. */
(function () {
  var NEWSLETTER_FORM = 'https://e0d75c2b.sibforms.com/serve/MUIFALK0uFrqzpaVi788xANaHp1qSQCMooSPs2f1ar1KH9Mrjp8wGa18bh8CPQPy9glSK_cl7tp5jOdEqE0vDbAvgIi_Y6XEa84RPH3m8_d31yRyt51PanJKB2I5Y_i9dzQUEs6yQkw96wTUOeWAeOVV8fNu-CmSItMUhdOYK8CjVThZxs_aqQxLcIn_vZBXxMS404XjuaoNVREJ7Q==';
  var form = document.getElementById('aviso-form');
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  var status = document.getElementById('form-status');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var body = new FormData();
    body.append('NOMBRE', form.FIRSTNAME.value.trim());
    body.append('EMAIL', form.EMAIL.value.trim());
    body.append('email_address_check', '');
    body.append('locale', 'es');
    button.disabled = true;
    button.textContent = 'Enviando…';
    var done = function () {
      form.querySelectorAll('input, button').forEach(function (el) { el.disabled = true; });
      button.textContent = 'Listo';
      status.textContent = 'Gracias. Revisa tu correo para confirmar la suscripción: te avisaremos en cuanto se abran las inscripciones.';
      if (window.gtag) window.gtag('event', 'generate_lead', { form: 'aviso_taller' });
    };
    // Brevo no deja leer la respuesta desde otro dominio (no-cors): se envía y se confirma.
    fetch(NEWSLETTER_FORM, { method: 'POST', body: body, mode: 'no-cors' }).then(done, done);
  });
})();
