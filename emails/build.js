/* Genera los emails del taller «El éxito de ser tú».
   Uso: node emails/build.js
   Salida:
     emails/brevo/*.html    → HTML listo para pegar en Brevo (imágenes con URL pública y variables de Brevo)
     emails/preview/*.html  → el mismo email con imágenes locales y un nombre de ejemplo, para revisarlo
     emails/index.html      → vista previa de todo el flujo
   Todo lo que cambia entre versiones (enlaces, nombre del atributo) está en CONFIG. */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  // Dónde estarán publicadas las imágenes de los emails (carpeta web/assets/email/).
  assetsPublic: 'https://elexitodesertu.rebecacaceres.com/assets/email/',
  assetsPreview: '../../El-exito-de-ser-tu-web-proveedor/web/assets/email/',
  // Página a la que vuelve quien no terminó la inscripción. Cambiar cuando se elija la versión de la landing.
  inscripcion: 'https://elexitodesertu.rebecacaceres.com/inscripcion',
  landing: 'https://elexitodesertu.rebecacaceres.com/',
  calendarioIcs: 'https://elexitodesertu.rebecacaceres.com/assets/el-exito-de-ser-tu.ics',
  // Pendientes: sustituir por los enlaces reales cuando existan.
  enlaceDirecto: 'https://ENLACE-DEL-DIRECTO-PENDIENTE',
  enlaceGrabacion: 'https://ENLACE-DE-LA-GRABACION-PENDIENTE',
  enlaceEncuesta: 'https://ENLACE-DE-LA-ENCUESTA-PENDIENTE',
  // Página de rebecacaceres.com donde se apunta a la newsletter.
  enlaceNewsletter: 'https://ENLACE-DE-LA-NEWSLETTER-PENDIENTE',
  // Escenario A: hay un límite de plazas real fijado en Stripe. Escenario B: no hay límite; la urgencia es la fecha de cierre.
  escenario: 'B',
  cierreInscripciones: 'el viernes 27 de noviembre a las 23:59 (hora de Madrid)',
  // Atributo de Brevo con el nombre: FIRSTNAME o NOMBRE, según la cuenta.
  atributoNombre: 'NOMBRE',
  nombreEjemplo: 'Ana',
  remitente: 'Rebeca Cáceres <elexitodesertu@rebecacaceres.com>'
};

const C = { ink: '#111b26', paper: '#f9f7f3', pink: '#ff609f', pinkInk: '#a92e60', aqua: '#61dfcf', tealInk: '#167c73', lime: '#d4f46c', muted: '#4d5660', line: '#e6e1d8' };
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

const GOOGLE_CAL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=El%20%C3%A9xito%20de%20ser%20t%C3%BA%20%C2%B7%20Taller%20online%20con%20Rebeca%20C%C3%A1ceres&dates=20261128T100000Z/20261128T130000Z&details=Taller%20online%20en%20directo.%20El%20enlace%20de%20acceso%20te%20llegar%C3%A1%20por%20email%2024%20horas%20antes.';
const OUTLOOK_CAL = 'https://outlook.live.com/calendar/0/action/compose?subject=El%20%C3%A9xito%20de%20ser%20t%C3%BA%20%C2%B7%20Taller%20online%20con%20Rebeca%20C%C3%A1ceres&startdt=2026-11-28T10:00:00Z&enddt=2026-11-28T13:00:00Z&body=Taller%20online%20en%20directo.%20El%20enlace%20de%20acceso%20te%20llegar%C3%A1%20por%20email%2024%20horas%20antes.';

/* ---------- Piezas de la plantilla (tablas y estilos en línea, para Gmail y Outlook) ---------- */

function utm(url, id) {
  if (!/^https:\/\/elexitodesertu\.rebecacaceres\.com/.test(url)) return url;
  const sep = url.includes('?') ? '&' : '?';
  const [base, hash] = url.split('#');
  return `${base}${sep}utm_source=brevo&utm_medium=email&utm_campaign=el-exito-2026&utm_content=${id}${hash ? '#' + hash : ''}`;
}

const h1 = (html) => `<h1 style="margin:0 0 20px;font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:normal;color:${C.ink}">${html}</h1>`;
const p = (html, extra = '') => `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};${extra}">${html}</p>`;
const small = (html) => `<p style="margin:0 0 12px;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.muted}">${html}</p>`;
const em = (t) => `<em style="font-style:italic;color:${C.pinkInk}">${t}</em>`;

function button(label, href, { color = C.pink, text = C.ink } = {}) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px"><tr>
<td style="background:${color};border-radius:0"><a href="${href}" target="_blank" style="display:inline-block;padding:16px 28px;font-family:${SANS};font-size:16px;font-weight:bold;color:${text};text-decoration:none">${label} &rarr;</a></td>
</tr></table>`;
}

function infoBox(rows, accent = C.aqua) {
  const trs = rows.map(([k, v]) => `<tr>
<td style="padding:7px 16px 7px 0;font-family:${SANS};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};vertical-align:top;white-space:nowrap">${k}</td>
<td style="padding:7px 0;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink};vertical-align:top">${v}</td></tr>`).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 26px;background:${C.paper};border-left:4px solid ${accent}">
<tr><td style="padding:16px 20px"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${trs}</table></td></tr></table>`;
}

function list(items, accent = C.pinkInk) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px">${items.map((it, i) => `<tr>
<td style="width:34px;padding:10px 0;vertical-align:top;font-family:${SERIF};font-size:22px;line-height:1.2;color:${accent}">${String(i + 1).padStart(2, '0')}</td>
<td style="padding:10px 0;vertical-align:top;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink};border-bottom:1px solid ${C.line}">${it}</td></tr>`).join('')}</table>`;
}

function calendarButtons(id) {
  const b = (label, href, bg) => `<td style="padding:0 8px 8px 0"><a href="${href}" target="_blank" style="display:inline-block;padding:11px 14px;background:${bg};font-family:${SANS};font-size:13px;font-weight:bold;color:${C.ink};text-decoration:none">${label}</a></td>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px"><tr>
${b('Google Calendar', GOOGLE_CAL, C.lime)}${b('Apple / iPhone', utm(CONFIG.calendarioIcs, id), C.aqua)}${b('Outlook', OUTLOOK_CAL, '#ffc9df')}
</tr></table>`;
}

const DATOS_TALLER = [
  ['Cuándo', '<strong>Sábado 28 de noviembre de 2026</strong>'],
  ['Hora', '11:00–14:00 Madrid<br><span style="color:#4d5660">05:00 Miami y Colombia · 06:00 Venezuela</span>'],
  ['Dónde', 'Online, en directo'],
  ['Incluye', 'La grabación durante 30 días']
];

function signature(assets, cierre) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0"><tr>
<td style="vertical-align:middle;padding-right:16px"><img src="${assets}rebeca.jpg" width="64" height="64" alt="Rebeca Cáceres" style="display:block;width:64px;height:64px;border-radius:50%;border:0"></td>
<td style="vertical-align:middle">
<p style="margin:0 0 2px;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink}">${cierre}</p>
<img src="${assets}firma.png" width="200" height="48" alt="Rebeca Cáceres" style="display:block;width:200px;height:48px;border:0">
<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.5;color:${C.muted}">Doctora en Psicología · Experta en gestión del éxito</p>
</td></tr></table>`;
}

function layout({ preheader, accent, body, assets, motivo }) {
  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<title>El éxito de ser tú</title>
<style>
  @media (max-width:620px){
    .card{width:100%!important}
    .pad{padding-left:24px!important;padding-right:24px!important}
    h1{font-size:27px!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper}">${preheader}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff">
  <tr><td align="center" style="background:${C.ink};padding:26px 24px">
    <img src="${assets}logo-blanco.png" width="150" alt="Rebeca Cáceres" style="display:block;width:150px;height:auto;border:0">
  </td></tr>
  <tr><td style="font-size:0;line-height:0;height:6px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="height:6px;background:${C.pink}"></td><td style="height:6px;background:${C.aqua}"></td><td style="height:6px;background:${C.lime}"></td>
    </tr></table>
  </td></tr>
  <tr><td class="pad" style="padding:40px 48px 36px;border-top:0">
    <p style="margin:0 0 14px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:${accent}">El éxito de ser tú · Taller online</p>
    ${body}
  </td></tr>
  <tr><td class="pad" style="padding:22px 48px 26px;background:${C.paper};border-top:1px solid ${C.line}">
    <p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">${motivo}</p>
    <p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">Un programa educativo basado en la investigación psicológica y la experiencia clínica. No es terapia ni sustituye la atención de un profesional de la salud mental.</p>
    <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">Rebeca Cáceres · C/ Fuencarral, 105, 28004 Madrid · <a href="mailto:elexitodesertu@rebecacaceres.com" style="color:${C.muted}">elexitodesertu@rebecacaceres.com</a> · <a href="{{ unsubscribe }}" style="color:${C.muted}">Darme de baja</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ---------- Los emails ---------- */

const MOTIVO_INTERESADO = 'Recibes este email porque empezaste tu inscripción en el taller <em>El éxito de ser tú</em>.';
const MOTIVO_INSCRITO = 'Recibes este email porque estás inscrita o inscrito en el taller <em>El éxito de ser tú</em>.';

const MOTIVO_NEWSLETTER = 'Recibes este email porque estás suscrita o suscrito a la newsletter de Rebeca Cáceres.';

const EMAILS = [
  {
    id: '00-anuncio-comunidad', fase: 'Lanzamiento', estado: 'Pedido',
    nombre: 'Anuncio a la comunidad',
    cuando: 'Al abrir las inscripciones, antes de anunciarlo en redes.',
    quien: 'Toda la lista de newsletter de Rebeca.',
    asunto: 'Quería contártelo a ti primero',
    preheader: 'El 28 de noviembre hago algo que llevo tiempo queriendo hacer.',
    accent: C.pinkInk, motivo: MOTIVO_NEWSLETTER,
    aviso: 'Enviarlo antes de publicar el taller en redes: el email dice que se lo cuenta primero a su comunidad.',
    body: (x) => `${h1(`Quería contártelo a ti ${em('primero.')}`)}
${p(`${x.saludo}`)}
${p('Si me lees desde hace tiempo, sabes que hay una pregunta que me acompaña: <strong>¿y si tener éxito también fuera dejar de encajar?</strong> Sobre ella escribí <em>El éxito de ser tú</em>. Y ahora quiero trabajarla contigo, en directo.')}
${p('El sábado 28 de noviembre hago un taller online de tres horas. No es una charla: es un espacio para revisar tu idea de éxito, mirar lo que estás dejando para después y salir con un primer paso concreto, pensado para tu vida real.')}
${p('Antes de anunciarlo en ningún sitio quería contártelo a ti. Formas parte de las personas que me leen, me escriben y me acompañan, y me hace especial ilusión que estés.')}
${list([
  '<strong>El éxito que aprendimos:</strong> las expectativas y las reglas con las que mides tu vida.',
  '<strong>La vida que aplazamos:</strong> lo que sostienes, lo que dejas para después y otra forma de ver el fracaso.',
  '<strong>Tu criterio, en práctica:</strong> una decisión tuya y tu primer paso concreto.'
])}
${infoBox([...DATOS_TALLER, ['Inversión', '150 €'], CONFIG.escenario === 'A' ? ['Plazas', 'Limitadas: grupo reducido'] : ['Inscripciones', 'Hasta el viernes 27 de noviembre, 23:59 (Madrid)']], C.pink)}
${button('Quiero mi plaza', utm(CONFIG.landing, x.id))}
${p('Si tienes cualquier duda, respóndeme a este email. Lo leo yo.')}
${signature(x.assets, 'Ojalá nos veamos el 28,')}`
  },
  {
    id: '01-carrito-abandonado', fase: 'Antes de comprar', estado: 'Pedido',
    nombre: 'Carrito abandonado',
    cuando: '3 horas después de rellenar el formulario, si no ha pagado.',
    quien: 'Lista Interesados que NO están en Inscritos.',
    asunto: 'Tu plaza sigue esperándote',
    preheader: 'Te quedaste a un paso de reservar El éxito de ser tú.',
    accent: C.pinkInk, motivo: MOTIVO_INTERESADO,
    body: (x) => `${h1(`Te quedaste a un paso de ${em('ser tú.')}`)}
${p(`${x.saludo}`)}
${p('Vi que empezaste a inscribirte en <strong>El éxito de ser tú</strong>, pero la reserva no llegó a completarse. A veces es un despiste, a veces el pago se atasca y a veces hay una duda.')}
${p('Si fue algo técnico, aquí tienes el enlace para terminar en un minuto:')}
${button('Terminar mi inscripción', utm(CONFIG.inscripcion, x.id))}
${infoBox([...DATOS_TALLER.slice(0, 2), ['Inversión', '150 €']])}
${p('Y si fue una duda, respóndeme a este email. Lo leo yo y te contesto.')}
${small('Si ya completaste la inscripción con otro email, ignora este mensaje: tu plaza está confirmada.')}
${signature(x.assets, 'Un abrazo,')}`
  },
  {
    id: '01b-ultimo-aviso', fase: 'Antes de comprar', estado: 'Sugerido',
    nombre: 'Último aviso de inscripción',
    cuando: '3 días después de rellenar el formulario, si sigue sin pagar. No enviarlo si ya han cerrado las inscripciones.',
    quien: 'Lista Interesados que NO están en Inscritos.',
    asunto: 'Es el último mensaje que te escribo sobre esto',
    preheader: 'Por si se te pasó terminar tu inscripción.',
    accent: C.pinkInk, motivo: MOTIVO_INTERESADO,
    aviso: 'Si la persona se apunta con menos de 3 días para el cierre, este email no debe salir: las inscripciones ya estarían cerradas.',
    body: (x) => `${h1(`Un último recordatorio, ${em('sin ninguna prisa.')}`)}
${p(`${x.saludo}`)}
${p('Te escribo solo una vez más y no insistiré: no quiero molestarte.')}
${p('Es que me sabría muy mal que te perdieras el taller <strong>El éxito de ser tú</strong> por un despiste, por si ha pasado algo y no te acordabas de que no habías terminado tu inscripción.')}
${p(CONFIG.escenario === 'A' ? 'Las plazas son limitadas para que el grupo sea reducido, y me daría pena que te quedaras sin la tuya.' : 'Las inscripciones se cierran el viernes 27 de noviembre a las 23:59 (hora de Madrid), y me daría pena que se te pasara.')}
${button('Terminar mi inscripción', utm(CONFIG.inscripcion, x.id))}
${infoBox([...DATOS_TALLER.slice(0, 2), ['Inversión', '150 €']])}
${p('Si tienes alguna duda, o necesitas ayuda para completar el pago, respóndeme a este email y te contesto yo.')}
${small('Si ya completaste la inscripción con otro email, ignora este mensaje: tu plaza está confirmada.')}
${signature(x.assets, 'Te veo dentro,')}`
  },
  {
    id: '02b-ultima-semana', fase: 'Antes de comprar', estado: 'Pedido', escenario: 'B · sin límite',
    nombre: 'Última semana para apuntarte',
    cuando: 'Sábado 21 de noviembre, 10:00 (Madrid). Una semana antes.',
    quien: 'Lista de newsletter, excluyendo la lista Inscritos.',
    asunto: 'Última semana para apuntarte a El éxito de ser tú',
    preheader: 'Las inscripciones cierran el viernes 27 a las 23:59 (Madrid).',
    accent: C.tealInk, motivo: MOTIVO_NEWSLETTER,
    aviso: 'Requiere cerrar de verdad las inscripciones el viernes 27 a las 23:59 (hora de Madrid): ese día, desactivar el enlace de pago en Stripe (Enlaces de pago → Desactivar).',
    body: (x) => `${h1(`Queda una semana para ${em('el 28.')}`)}
${p(`${x.saludo}`)}
${p('El sábado que viene es el taller <strong>El éxito de ser tú</strong>, y las inscripciones están abiertas hasta <strong>' + CONFIG.cierreInscripciones + '</strong>. Después se cierran.')}
${p('Son tres horas para:')}
${list([
  '<strong>Revisar el éxito que aprendimos:</strong> las expectativas y las reglas con las que mides tu vida.',
  '<strong>Mirar la vida que aplazamos:</strong> lo que sostienes, lo que dejas para después y otra forma de ver el fracaso.',
  '<strong>Poner tu criterio en práctica:</strong> una decisión tuya y tu primer paso concreto.'
], C.tealInk)}
${button('Reservar mi plaza', utm(CONFIG.inscripcion, x.id))}
${infoBox([...DATOS_TALLER, ['Inversión', '150 €'], ['Inscripciones', 'Hasta el viernes 27, 23:59 (Madrid)']], C.tealInk)}
${p('Si no puedes conectarte en directo, la plaza incluye la grabación durante 30 días.')}
${signature(x.assets, 'Me encantaría que estuvieras,')}`
  },
  {
    id: '02c-cierran-manana', fase: 'Antes de comprar', estado: 'Pedido', escenario: 'B · sin límite',
    nombre: 'Las inscripciones cierran mañana',
    cuando: 'Jueves 26 de noviembre, 10:00 (Madrid).',
    quien: 'Lista de newsletter, excluyendo la lista Inscritos.',
    asunto: 'Las inscripciones cierran mañana',
    preheader: 'Viernes 27 a las 23:59 (Madrid). El sábado empezamos.',
    accent: C.pinkInk, motivo: MOTIVO_NEWSLETTER,
    aviso: 'Requiere cerrar de verdad las inscripciones el viernes 27 a las 23:59 (hora de Madrid): ese día, desactivar el enlace de pago en Stripe (Enlaces de pago → Desactivar).',
    body: (x) => `${h1(`Mañana ${em('cerramos inscripciones.')}`)}
${p(`${x.saludo}`)}
${p('Mañana viernes, a las 23:59 (hora de Madrid), se cierran las inscripciones de <strong>El éxito de ser tú</strong>. El sábado a las 11:00 empezamos.')}
${p('Si llevas unos días dándole vueltas, quizá sea justo eso lo que vale la pena mirar.')}
${button('Reservar mi plaza', utm(CONFIG.inscripcion, x.id))}
${small('Sábado 28 de noviembre · 11:00–14:00 Madrid (05:00 Miami y Colombia · 06:00 Venezuela) · Online en directo + grabación 30 días · 150 €')}
${signature(x.assets, 'Ojalá nos veamos el sábado,')}`
  },
  {
    id: '03-confirmacion', fase: 'Después de comprar', estado: 'Pedido',
    nombre: 'Confirmación de inscripción',
    cuando: 'Al momento de pagar.',
    quien: 'Contacto añadido a la lista Inscritos (lo hace Make con cada pago de Stripe).',
    asunto: '¡Estás dentro! Tu plaza para El éxito de ser tú está confirmada',
    preheader: 'Guarda la fecha: sábado 28 de noviembre, 11:00 (Madrid).',
    accent: C.pinkInk, motivo: MOTIVO_INSCRITO,
    body: (x) => `${h1(`Ya está: tu plaza está ${em('confirmada.')}`)}
${p(`${x.saludo}`)}
${p('Gracias por regalarte estas tres horas. Tengo muchas ganas de verte el sábado 28.')}
${infoBox(DATOS_TALLER)}
<h2 style="margin:6px 0 8px;font-family:${SERIF};font-size:22px;font-weight:normal;color:${C.ink}">1. Guárdalo en tu calendario</h2>
${p('Así te aparecerá a tu hora, estés donde estés:', 'margin-bottom:8px')}
${calendarButtons(x.id)}
<h2 style="margin:6px 0 8px;font-family:${SERIF};font-size:22px;font-weight:normal;color:${C.ink}">2. El enlace te llega 24 horas antes</h2>
${p('El viernes 27 a las 11:00 (hora de Madrid) te enviaré por email el enlace para entrar al directo. No tienes que hacer nada más hasta entonces.')}
<h2 style="margin:6px 0 8px;font-family:${SERIF};font-size:22px;font-weight:normal;color:${C.ink}">3. ¿Tienes alguna pregunta?</h2>
${p('Respóndeme a este email con cualquier duda sobre el taller. Y si hay algo que te gustaría que tratáramos, cuéntamelo también: lo tendré en cuenta.')}
${small('El recibo del pago te llega en un email aparte, de Stripe.')}
${signature(x.assets, 'Tengo muchas ganas de verte,')}`
  },
  {
    id: '04-preparate', fase: 'Después de comprar', estado: 'Sugerido',
    nombre: 'Prepárate para el taller',
    cuando: 'Miércoles 25 de noviembre, 10:00 (Madrid). 3 días antes.',
    quien: 'Lista Inscritos.',
    asunto: 'Tres preguntas para llegar al sábado con algo entre manos',
    preheader: 'Una pequeña preparación para aprovechar mejor las tres horas.',
    accent: C.tealInk, motivo: MOTIVO_INSCRITO,
    body: (x) => `${h1(`Tres preguntas para ${em('llegar con algo entre manos.')}`)}
${p(`${x.saludo}`)}
${p('Faltan tres días. Para aprovechar mejor el sábado, te propongo que dediques diez minutos a estas preguntas. No hace falta tener respuestas: basta con llegar con ellas.')}
${list([
  '¿Cuánto de la vida que estás viviendo sientes que la estás eligiendo?',
  'Cambiar de rumbo, ¿es fracasar?',
  '¿Qué estás dejando para después?'
], C.tealInk)}
${p('Y piensa en <strong>una decisión o un cambio</strong> que te esté rondando. En la tercera hora trabajaremos sobre ella. Compartir será siempre voluntario.')}
<h2 style="margin:10px 0 8px;font-family:${SERIF};font-size:22px;font-weight:normal;color:${C.ink}">Para el sábado</h2>
${list(['Un sitio tranquilo y una buena conexión.', 'Papel y bolígrafo: escribir ayuda a pensar.', 'La cámara, si te apetece. No es obligatoria.'], C.pinkInk)}
${signature(x.assets, 'Nos vemos el sábado,')}`
  },
  {
    id: '05-acceso-24h', fase: 'Después de comprar', estado: 'Pedido',
    nombre: 'Enlace de acceso (24 horas antes)',
    cuando: 'Viernes 27 de noviembre, 11:00 (Madrid).',
    quien: 'Lista Inscritos. Quien compre después de esa hora lo recibe al momento (rama aparte en la automatización).',
    asunto: 'Mañana nos vemos: aquí tienes tu enlace',
    preheader: 'Sábado 28, 11:00 (Madrid). Guarda este email.',
    accent: C.pinkInk, motivo: MOTIVO_INSCRITO,
    body: (x) => `${h1(`Mañana nos vemos. ${em('Aquí tienes tu enlace.')}`)}
${p(`${x.saludo}`)}
${p('Mañana empezamos. Guarda este email: el botón de abajo es tu acceso al directo.')}
${button('Entrar al directo', CONFIG.enlaceDirecto)}
${infoBox([['Hora', '<strong>11:00–14:00 Madrid</strong><br><span style="color:#4d5660">05:00 Miami y Colombia · 06:00 Venezuela</span>']])}
${p('Algunos consejos para que todo vaya bien:')}
${list(['Entra 10 minutos antes para probar el audio.', 'Ten a mano papel y bolígrafo.', 'Ven con esa decisión o cambio en mente.'], C.tealInk)}
${small('Si no puedes conectarte en directo, no te preocupes: te enviaré la grabación después del taller y tendrás 30 días para verla.')}
${signature(x.assets, 'Tengo muchas ganas de verte mañana,')}`
  },
  {
    id: '06-empezamos-en-1-hora', fase: 'Después de comprar', estado: 'Sugerido',
    nombre: 'Empezamos en una hora',
    cuando: 'Sábado 28 de noviembre, 10:00 (Madrid).',
    quien: 'Lista Inscritos.',
    asunto: 'Empezamos en una hora',
    preheader: 'Tu enlace al directo, por si lo necesitas a mano.',
    accent: C.pinkInk, motivo: MOTIVO_INSCRITO,
    body: (x) => `${h1(`Empezamos ${em('en una hora.')}`)}
${p(`${x.saludo}`)}
${p('Te dejo el enlace a mano para que no tengas que buscarlo. Abro la sala 10 minutos antes.')}
${button('Entrar al directo', CONFIG.enlaceDirecto)}
${small('11:00 en Madrid · 05:00 en Miami y Colombia · 06:00 en Venezuela.')}
${signature(x.assets, 'Ahora nos vemos,')}`
  },
  {
    id: '07-gracias-grabacion', fase: 'Después del taller', estado: 'Sugerido',
    nombre: 'Gracias + grabación',
    cuando: 'Domingo 29 de noviembre, 10:00 (Madrid), o en cuanto la grabación esté subida.',
    quien: 'Lista Inscritos (también quien no pudo asistir).',
    asunto: 'Gracias por estar. Aquí tienes la grabación',
    preheader: 'Disponible hasta el 28 de diciembre.',
    accent: C.tealInk, motivo: MOTIVO_INSCRITO,
    body: (x) => `${h1(`Gracias por ${em('estar.')}`)}
${p(`${x.saludo}`)}
${p('Gracias por estas tres horas. Ojalá te lleves algo que te acompañe en los próximos días, aunque sea una sola pregunta.')}
${p('Aquí tienes la grabación completa. Puedes verla a tu ritmo, las veces que quieras, <strong>hasta el lunes 28 de diciembre</strong>.')}
${button('Ver la grabación', CONFIG.enlaceGrabacion)}
${p('Un recordatorio: ese primer paso que escribiste en la tercera hora no tiene que ser grande. Tiene que ser tuyo.')}
${p('¿Me ayudas con dos minutos? Me encantaría saber qué te ha parecido:')}
${button('Contarte qué me llevo', CONFIG.enlaceEncuesta, { color: C.aqua })}
${signature(x.assets, 'Con cariño,')}`
  },
  {
    id: '08-ultimos-dias-grabacion', fase: 'Después del taller', estado: 'Sugerido',
    nombre: 'Últimos días de la grabación',
    cuando: 'Miércoles 23 de diciembre, 10:00 (Madrid). 5 días antes de que caduque.',
    quien: 'Lista Inscritos.',
    asunto: 'Tu acceso a la grabación termina el 28 de diciembre',
    preheader: 'Te quedan cinco días para volver a verla.',
    accent: C.pinkInk, motivo: MOTIVO_INSCRITO,
    body: (x) => `${h1(`Te quedan ${em('cinco días')} de grabación.`)}
${p(`${x.saludo}`)}
${p('El lunes 28 de diciembre se cierra el acceso a la grabación de <strong>El éxito de ser tú</strong>. Si quieres volver a algún momento, o verla por primera vez, aún estás a tiempo.')}
${button('Ver la grabación', CONFIG.enlaceGrabacion)}
${p('Y si quieres seguir con estas ideas, en mi libro <strong>El éxito de ser tú</strong> (Aguilar) las desarrollo con más calma, y en la newsletter sigo compartiendo herramientas para la vida diaria.')}
${signature(x.assets, 'Gracias de nuevo por estar,')}`
  },
  {
    id: '09-invitacion-newsletter', fase: 'Después del taller', estado: 'Sugerido',
    nombre: 'Invitación a la newsletter',
    cuando: 'Martes 1 de diciembre, 10:00 (Madrid). Dos días después del taller.',
    quien: 'Lista Inscritos que NO están en Newsletter.',
    asunto: '¿Seguimos en contacto?',
    preheader: 'Una invitación, solo una vez.',
    accent: C.tealInk, motivo: MOTIVO_INSCRITO,
    aviso: 'Es una invitación comercial a quien no ha dado su consentimiento para la newsletter: enviarla una sola vez, a quien asistió al taller, y revisar con la política de privacidad.',
    body: (x) => `${h1(`Si quieres, ${em('seguimos en contacto.')}`)}
${p(`${x.saludo}`)}
${p('Gracias otra vez por haber estado en el taller.')}
${p('Si te ha servido, en mi newsletter comparto herramientas y reflexiones para llevar estas ideas a la vida diaria, sin agobiar. Si te apetece recibirla, puedes apuntarte aquí:')}
${button('Apuntarme a la newsletter', CONFIG.enlaceNewsletter, { color: C.aqua })}
${small('Es solo una invitación. Si no te apuntas, no te escribiré más sobre esto, y seguirás recibiendo lo que queda del taller, como el acceso a la grabación.')}
${signature(x.assets, 'Con cariño,')}`
  }
];

/* ---------- Construcción ---------- */

const root = __dirname;
for (const dir of ['brevo', 'preview']) fs.mkdirSync(path.join(root, dir), { recursive: true });

const brevoName = `{{ contact.${CONFIG.atributoNombre} }}`;
const brevoGreeting = `{% if contact.${CONFIG.atributoNombre} %}Hola ${brevoName}:{% else %}Hola:{% endif %}`;

for (const e of EMAILS) {
  const variants = {
    brevo: { assets: CONFIG.assetsPublic, saludo: brevoGreeting },
    preview: { assets: CONFIG.assetsPreview, saludo: `Hola ${CONFIG.nombreEjemplo}:` }
  };
  for (const [dir, v] of Object.entries(variants)) {
    let html = layout({ preheader: e.preheader, accent: e.accent, motivo: e.motivo, assets: v.assets, body: e.body({ ...v, id: e.id }) });
    if (dir === 'preview') html = html.replace('{{ unsubscribe }}', '#');
    fs.writeFileSync(path.join(root, dir, `${e.id}.html`), html);
  }
}

/* Página de vista previa del flujo */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const asuntoVista = (a) => a.replace('{{nombre}}', CONFIG.nombreEjemplo);
const asuntoBrevo = (a) => a.replace('{{nombre}}', brevoName);
const fases = [...new Set(EMAILS.map((e) => e.fase))];

const cards = fases.map((fase) => `
<section class="phase">
  <h2>${fase}</h2>
  ${EMAILS.filter((e) => e.fase === fase).map((e) => `
  <article class="email">
    <div class="meta">
      <div class="tags"><span class="num">${e.id.split('-')[0]}</span><span class="tag ${e.estado === 'Pedido' ? 'tag-pedido' : 'tag-sugerido'}">${e.estado}</span>${e.escenario ? `<span class="tag tag-escenario">Escenario ${e.escenario}</span>` : ''}</div>
      <h3>${e.nombre}</h3>
      <dl>
        <dt>Cuándo</dt><dd>${e.cuando}</dd>
        <dt>A quién</dt><dd>${e.quien}</dd>
        <dt>Asunto</dt><dd class="subject">${esc(asuntoVista(e.asunto))}</dd>
        <dt>Asunto en Brevo</dt><dd><code>${esc(asuntoBrevo(e.asunto))}</code></dd>
        <dt>Texto de vista previa</dt><dd>${e.preheader}</dd>
      </dl>
      ${e.aviso ? `<p class="warn">${e.aviso}</p>` : ''}
      <p class="files"><a href="preview/${e.id}.html" target="_blank">Abrir vista previa</a> · <a href="brevo/${e.id}.html" target="_blank">HTML para Brevo</a></p>
    </div>
    <div class="frame"><iframe src="preview/${e.id}.html" title="${e.nombre}" loading="lazy"></iframe></div>
  </article>`).join('')}
</section>`).join('');

const index = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flujo de emails · El éxito de ser tú</title>
<style>
:root{--ink:#111b26;--paper:#f9f7f3;--pink:#ff609f;--pink-ink:#a92e60;--aqua:#61dfcf;--lime:#d4f46c;--muted:#4d5660;--line:#e6e1d8}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 Helvetica,Arial,sans-serif}
header{background:var(--ink);color:#fff;padding:36px 5vw 30px}
header h1{font:normal 38px/1.1 Georgia,serif;margin:0 0 10px}
header p{margin:0;max-width:760px;color:#ffffffcc}
.stripe{display:flex;height:6px}.stripe span{flex:1}
.toolbar{position:sticky;top:0;z-index:2;background:#f9f7f3f2;border-bottom:1px solid var(--line);padding:12px 5vw;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.toolbar button{font:inherit;font-size:13px;font-weight:bold;padding:8px 14px;border:1px solid #111b2640;background:#fff;cursor:pointer}
.toolbar button[aria-pressed=true]{background:var(--ink);color:#fff;border-color:var(--ink)}
.legend{margin-left:auto;font-size:13px;color:var(--muted);display:flex;gap:14px;align-items:center}
main{padding:10px 5vw 60px}
.phase h2{font:normal 28px/1.2 Georgia,serif;margin:44px 0 18px;padding-bottom:10px;border-bottom:2px solid var(--ink)}
.email{display:grid;grid-template-columns:minmax(260px,1fr) auto;gap:32px;align-items:start;padding:26px 0;border-bottom:1px solid var(--line)}
.tags{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.num{font:normal 26px/1 Georgia,serif;color:var(--pink-ink)}
.tag{font-size:11px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px}
.tag-pedido{background:var(--lime)}.tag-sugerido{background:var(--aqua)}.tag-escenario{background:#ffe1ec;color:#8a1745}
.meta h3{font:normal 24px/1.2 Georgia,serif;margin:0 0 14px}
dl{margin:0;display:grid;grid-template-columns:130px 1fr;gap:6px 14px;font-size:14px}
dt{color:var(--muted)}dd{margin:0}
dd.subject{font-weight:bold}
code{font-size:12px;background:#fff;padding:2px 5px;border:1px solid var(--line)}
.warn{background:#ffe1ec;color:#8a1745;font-size:13px;padding:10px 12px;margin:14px 0 0}
.files{font-size:13px;margin:14px 0 0}.files a{color:var(--pink-ink)}
.frame{width:620px;height:760px;background:#fff;border:1px solid var(--line);box-shadow:0 10px 30px #111b2614;transition:width .25s}
.frame iframe{width:100%;height:100%;border:0;display:block}
body.mobile .frame{width:375px;height:720px}
@media(max-width:1100px){.email{grid-template-columns:1fr}.frame{width:100%;max-width:620px}}
</style></head>
<body>
<header>
  <h1>Flujo de emails · El éxito de ser tú</h1>
  <p>${EMAILS.length} emails, desde el anuncio a la comunidad hasta que se cierra la grabación. Los marcados «Pedido» son los que se pidieron; los «Sugerido», los que recomiendo añadir. Las vistas previas usan un nombre de ejemplo («${CONFIG.nombreEjemplo}»); el HTML para Brevo lleva las variables reales.</p>
</header>
<div class="stripe"><span style="background:var(--pink)"></span><span style="background:var(--aqua)"></span><span style="background:var(--lime)"></span></div>
<div class="toolbar">
  <button type="button" data-view="desktop" aria-pressed="true">Escritorio</button>
  <button type="button" data-view="mobile" aria-pressed="false">Móvil</button>
  <div class="legend"><span class="tag tag-pedido">Pedido</span><span class="tag tag-sugerido">Sugerido</span></div>
</div>
<main>${cards}</main>
<script>
document.querySelectorAll('[data-view]').forEach(function (b) {
  b.addEventListener('click', function () {
    document.body.classList.toggle('mobile', b.dataset.view === 'mobile');
    document.querySelectorAll('[data-view]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
  });
});
</script>
</body></html>`;

fs.writeFileSync(path.join(root, 'index.html'), index);
console.log(`Generados ${EMAILS.length} emails en emails/brevo y emails/preview, y la vista previa en emails/index.html`);
