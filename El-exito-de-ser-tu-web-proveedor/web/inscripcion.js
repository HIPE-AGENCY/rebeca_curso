document.getElementById('registration-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('full-name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name) {document.getElementById('full-name').focus(); return;}
  const message = `Hola, soy ${name}. Quiero inscribirme al taller «El éxito de ser tú» del 28 de noviembre de 2026, de 11:00 a 14:00 (Madrid), con una inversión de 150 €. Mi correo es ${email}. ¿Podéis indicarme cómo formalizar la inscripción?`;
  const status = document.getElementById('registration-status');
  if (event.submitter?.value === 'email') {
    status.textContent = 'Se abrirá tu aplicación de correo. La solicitud se enviará cuando tú pulses enviar.';
    window.location.href = 'mailto:hola@rebecacaceres.com?subject=' + encodeURIComponent('Inscripción · El éxito de ser tú · 28 noviembre') + '&body=' + encodeURIComponent(message);
  } else {
    status.textContent = 'Continúa en WhatsApp para enviar tu solicitud. La plaza se confirma después con el equipo.';
    window.location.href = 'https://wa.me/34626517781?text=' + encodeURIComponent(message);
  }
});
