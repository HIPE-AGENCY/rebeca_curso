# Pendientes · El éxito de ser tú

Checklist para lanzar el taller del **sábado 28 de noviembre de 2026**.
Detalle paso a paso de cada herramienta y preguntas para Rebeca: [documento de ajustes](https://claude.ai/artifact/XMwzR765sS6LjNQ9SBysGi).
Emails del flujo: `emails/index.html` (abrir en el navegador).

---

## 1. Reunión con Rebeca

- [ ] Cerrar día y hora (mensaje enviado).
- [ ] Terminar juntos la cuenta de **Brevo** a su nombre y que te invite como usuario.
- [ ] Crear o revisar su cuenta de **Stripe** (datos fiscales y cuenta bancaria).
- [ ] Que te dé acceso a su portfolio empresarial de **Meta**: píxel, cuenta publicitaria, Instagram, página y dominios.
- [ ] Repasar las decisiones de la sección 9.

## 2. Brevo (cuenta nueva de Rebeca)

- [ ] Cuenta creada con email y datos de Rebeca. Revisar el plan: el gratuito solo envía 300 emails al día.
- [ ] Dominio `rebecacaceres.com` autenticado (registros DNS en Hostalia, sección 3).
- [ ] Buzón `elexitodesertu@rebecacaceres.com` creado (en el correo del dominio) y verificado en Brevo como remitente de los emails y la newsletter.
- [ ] Newsletter migrada desde la cuenta de Hipe: exportar contactos con atributos **y las bajas**; importar las bajas como bajas.
- [ ] Formulario de newsletter de su web actual apuntando a la cuenta nueva.
- [ ] Listas: Newsletter, Taller 28-11-2026 · Interesados, Taller 28-11-2026 · Inscritos, Pruebas.
- [ ] Atributo `NEWSLETTER` (sí/no) creado. Anotar si el del nombre es `NOMBRE` o `FIRSTNAME`.
- [ ] Formulario de inscripción → lista Interesados; confirmación simple, sin captcha. Copiar la URL del `action`.
- [ ] Plantillas: una por email (`emails/brevo/`). La 05 también como plantilla transaccional.
- [ ] Automatizaciones: carrito abandonado (una sola entrada por contacto), confirmación, alta en newsletter.
- [ ] Clave API para Make (pegarla solo en Make).
- [ ] Probar cada email con la lista Pruebas.

## 3. Dominio y DNS (Hostalia)

- [ ] Registros de Brevo (verificación, DKIM, DMARC). Si ya hay un `_dmarc`, no duplicarlo.
- [ ] Registro TXT de verificación de dominio de Meta.
- [ ] Al publicar: `elexitodesertu` → CNAME `hipe-agency.github.io.` (GitHub Pages) y activar HTTPS en GitHub.

## 4. Stripe

- [x] Cuenta «Rebeca Cáceres · España» creada en la organización de Tribeca (el país no se puede cambiar; si factura la empresa de EE. UU., crear otra cuenta con país Estados Unidos).
- [ ] Todo primero en el **entorno de pruebas** (sandbox) de esa cuenta.
- [x] Marca en pruebas: logo, color de marca `#111B26`, color de énfasis `#D4F46C`. Página de pago alojada en Stripe, sin dominio propio.
- [ ] Métodos de pago (tarjeta, Apple Pay, Google Pay) y recibos activados (Emails a clientes → Pagos correctos).
- [ ] Al activar la cuenta real (el sandbox no deja hacerlo antes): datos de la empresa (NIF, dirección, IBAN), datos públicos (nombre `Rebeca Cáceres`, web, `hola@rebecacaceres.com`, `+34 626 517 781`), descriptor `REBECA CACERES`. Repetir en real la marca, los métodos de pago, los emails, el producto y el enlace. No tocar los datos personales del usuario (son del propietario de Tribeca).
- [ ] Producto «El éxito de ser tú · Taller 28 nov 2026», 150 EUR.
- [ ] Enlace de pago: recopilar nombre; factura si hace falta; códigos promocionales si los hay.
- [ ] Después del pago, redirigir a `https://elexitodesertu.rebecacaceres.com/gracias?session_id={CHECKOUT_SESSION_ID}`.
- [ ] Escenario A: limitar el número de pagos. Escenario B: desactivar el enlace el **viernes 27 a las 23:59**.
- [ ] Pasar el enlace de prueba y, después, el real.

## 5. Make (Stripe → Brevo)

- [ ] Escenario: Stripe «Watch Events» `checkout.session.completed` → filtro `payment_status = paid` → Brevo «Create or Update a Contact» en Inscritos.
- [ ] Rama para pagos después del **viernes 27 a las 11:00** → Brevo «Send a transactional email» con la plantilla 05.
- [ ] Opcional: registro en Google Sheets.
- [ ] Probar con un pago de prueba.

## 6. Google Analytics (`G-RH0HZN0T9X`)

- [ ] Referencias no deseadas: `stripe.com` (Flujos de datos → Configurar ajustes de etiquetas → Enumerar referencias no deseadas).
- [ ] Moneda: euro. Retención de datos: 14 meses.
- [ ] Eventos clave: `purchase` y `generate_lead`.
- [ ] Dimensiones personalizadas (ámbito Evento): `cta_location`, `section`, `method`, `percent`.

## 7. Microsoft Clarity (`yzm0le6g9z`)

- [ ] Masking: Balanced o Strict.
- [ ] Integración con Google Analytics.
- [ ] Bloquear tu IP y la de Rebeca.

## 8. Meta

- [ ] Píxel creado (instalación manual, sin pegar código). Pasar el ID.
- [ ] Dominio `rebecacaceres.com` verificado.
- [ ] Probar eventos: `Lead`, `InitiateCheckout`, `Purchase`.
- [ ] Anuncios con objetivo Ventas y enlaces con `?utm_source=meta&utm_medium=paid&utm_campaign=…`.

## 9. Decisiones de Rebeca

- [ ] Destino del botón «Más sobre mí» (ahora apunta provisionalmente a rebecacaceres.com).
- [ ] Escenario de urgencia: **A** (límite real de plazas, ¿cuántas?) o **B** (cierre de inscripciones el viernes 27 a las 23:59).
- [ ] Condiciones: reembolsos, no asistencia, cancelación o cambio de fecha, IVA, quién factura (ella o la empresa de EE. UU.).
- [ ] Plataforma del directo (Zoom, Meet…) y dónde se aloja la grabación.
- [ ] Testimonios para la web.
- [ ] Horarios para América (¿añadir México o Argentina?).
- [ ] Confirmar la configuración de Stripe:
  - ¿Los 150 € son **con IVA incluido** o hay que sumarle el IVA? (Decidirlo con su gestor; el impuesto automático de Stripe está desactivado.)
  - ¿Le parece bien la cuenta «Rebeca Cáceres · España» o factura la empresa de EE. UU.?
  - Botón de la página de pago: «Pagar» (alternativa: «Reservar»).
  - Datos que pide el pago: solo nombre y email. Sin dirección, teléfono, empresa ni NIF. ¿Necesita factura con sus datos? Si es así, hay que activar dirección y NIF.
  - Métodos de pago: tarjeta, Apple Pay y Google Pay.
  - Colores del pago: azul `#111B26` y lima `#D4F46C`.
  - Nombre en el extracto bancario del cliente: `REBECA CACERES`.
- [ ] Black Friday (viernes 27, último día de inscripción): porcentaje (¿30 %?), fechas (solo el 27 o la semana del 23 al 27), código (`BLACKFRIDAY`) y si hay límite de usos. En Stripe: cupón + código promocional; activar «Permitir códigos promocionales» en el enlace solo durante la oferta. En la web: `prefilled_promo_code`, precio tachado y valor de compra en `analitica.js`.
- [ ] Ventaja para su comunidad en el email 00 (acceso anticipado o precio especial), si la quiere.
- [ ] Qué pasa con la web después del taller.

## 10. Lo que hay que pasarme para terminar la web y los emails

- [ ] Enlace de pago de Stripe. El de prueba ya está en `pago.js` (`test_8x2eVd8zL22h8TAcdxe7m00`); falta el real.
- [ ] URL del formulario de Brevo.
- [ ] Nombre del atributo del nombre (`NOMBRE` o `FIRSTNAME`).
- [ ] ID del píxel de Meta.
- [ ] Enlaces del directo, de la grabación y de la encuesta.
- [ ] Número de plazas (solo escenario A).
- [ ] Respuestas para las condiciones de contratación.

## 11. Publicar

- [ ] Pasar la versión elegida a `index.html` y retirar las demás.
- [ ] Quitar `noindex` de la landing elegida.
- [ ] Ajustar `CONFIG.inscripcion` en `emails/build.js` y regenerar los emails.
- [ ] Subir a `main` (publica automáticamente en GitHub Pages).
- [ ] Comprobar `https://elexitodesertu.rebecacaceres.com` con HTTPS y la vista previa al compartir en WhatsApp.

## 12. Prueba completa antes de lanzar

- [ ] Compra de prueba desde el móvil: formulario → Stripe con el email ya escrito → página de gracias.
- [ ] Brevo: el contacto está en Interesados e Inscritos; llegan el recibo de Stripe y la confirmación, sin ir a spam.
- [ ] Analytics (Tiempo real) y Meta (Probar eventos): llegan los eventos.
- [ ] Sin pagar: a las 3 horas llega el carrito abandonado.
- [ ] Pasar Stripe a modo real y hacer una compra real que luego se reembolsa.

## 13. Después

- [ ] Actualizar la política de privacidad de rebecacaceres.com: Stripe y Brevo como encargados.
- [ ] Avisar del error en su aviso legal: pone «CIF» y es un NIF de persona física.
- [ ] Antes del jueves 26: comprobar que ningún inscrito está dado de baja en Brevo; si lo está, enviarle el acceso a mano.
