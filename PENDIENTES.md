# Pendientes · El éxito de ser tú

Checklist para lanzar el taller del **sábado 28 de noviembre de 2026**.
Web: **https://elexitodesertu.rebecacaceres.com** · Emails del flujo: `emails/index.html` (abrir en el navegador).
Detalle paso a paso de cada herramienta: [documento de ajustes](https://claude.ai/artifact/XMwzR765sS6LjNQ9SBysGi).

## Estado a 22 de octubre de 2026

| Parte | Estado |
|---|---|
| Landing publicada (GitHub Pages + DNS en Hostalia + certificado HTTPS) | Hecho |
| Inscripción → Stripe (modo de prueba) → página de gracias | Hecho y probado |
| Google Analytics (`G-RH0HZN0T9X`) y Clarity (`yzm0le6g9z`) con banner de cookies | Hecho y probado en la web real |
| Brevo (formulario, listas, emails, automatizaciones) | **Pendiente** |
| Make (Stripe → Brevo) | **Pendiente** |
| Stripe en modo real | **Pendiente** (tras validar Rebeca) |
| Píxel de Meta y anuncios | **Pendiente** |
| Condiciones de contratación | **Borrador**, faltan decisiones de Rebeca |

---

## 1. Ahora

- [ ] **GitHub → Settings → Pages → marcar «Enforce HTTPS»** (el certificado ya está aprobado).
- [ ] Enviar a Rebeca el mensaje con la web y las tarjetas de prueba.
- [ ] Pedirle el **Gmail** para crear la cuenta de Brevo a su nombre.
- [ ] Probar los casos de tarjeta: rechazada, sin fondos, 3D Secure, extranjera, y el recorrido desde el móvil.
- [ ] En el enlace de Stripe de prueba, cambiar la vuelta a la URL sin `.html`: `https://elexitodesertu.rebecacaceres.com/gracias?session_id={CHECKOUT_SESSION_ID}` (la de `gracias.html` sigue funcionando, pero así queda limpia).

## 2. Brevo (cuenta nueva de Rebeca)

- [ ] Cuenta creada con su Gmail y sus datos; invitarte como usuario. Plan: el gratuito solo envía 300 emails al día.
- [ ] Buzón `elexitodesertu@rebecacaceres.com` creado en el correo del dominio.
- [ ] Dominio `rebecacaceres.com` autenticado (registros DNS de Brevo en Hostalia; si ya hay un `_dmarc`, no duplicarlo).
- [ ] Remitente `elexitodesertu@rebecacaceres.com` verificado.
- [ ] Newsletter migrada desde la cuenta de Hipe: contactos con atributos **y las bajas** (importarlas como bajas).
- [ ] Formulario de newsletter de su web actual apuntando a la cuenta nueva.
- [ ] Listas: Newsletter, Taller 28-11-2026 · Interesados, Taller 28-11-2026 · Inscritos, Pruebas.
- [ ] Atributo `NEWSLETTER` (sí/no). Anotar si el del nombre es `NOMBRE` o `FIRSTNAME`.
- [ ] Formulario de inscripción → lista Interesados; confirmación simple, sin captcha. **Pasarme la URL del `action`.**
- [ ] Plantillas: una por email (`emails/brevo/`). La 05 también como transaccional.
- [ ] Automatizaciones: carrito abandonado (una sola entrada por contacto), confirmación, alta en newsletter.
- [ ] Clave API para Make (pegarla solo en Make).
- [ ] Probar cada email con la lista Pruebas.

## 3. Make (Stripe → Brevo)

- [ ] Stripe «Watch Events» `checkout.session.completed` → filtro `payment_status = paid` **o** `no_payment_required` (los códigos gratuitos llegan con este último) → Brevo «Create or Update a Contact» en Inscritos.
- [ ] Rama para pagos después del **viernes 27 a las 11:00** → Brevo «Send a transactional email» con la plantilla 05.
- [ ] Probar con un pago de prueba: el contacto entra en Inscritos y llega la confirmación.

## 4. Stripe: pasar a real (cuando Rebeca lo valide)

- [ ] Activar la cuenta con sus datos fiscales y su cuenta bancaria.
- [ ] Recrear en modo real el producto (150 EUR) y el enlace de pago, con la misma configuración y la vuelta a `/gracias?session_id={CHECKOUT_SESSION_ID}`.
- [ ] Enlace de pago: activar «Permitir códigos promocionales».
- [ ] Acceso gratuito (Manuel, Yorat…): Stripe → Catálogo de productos → Cupones → cupón 100 % de descuento, «Una vez» → un código promocional por persona (máx. 1 canje). Lo escriben en la página de pago de Stripe; no pide tarjeta.
- [ ] Escenario A: limitar el número de pagos. Escenario B: desactivar el enlace el **viernes 27 a las 23:59**.
- [ ] **Sustituir en `web/pago.js` el enlace `buy.stripe.com/test_…` por el real** (o pasármelo).
- [ ] Compra real de 150 € y reembolso desde Stripe.
- [ ] En Make, conectar Stripe en modo real.

## 5. Google Analytics y Clarity

- [x] Instalados con banner de cookies; eventos comprobados en la web real.
- [ ] Analytics: referencia no deseada `stripe.com`; moneda euro; retención 14 meses.
- [ ] Analytics: eventos clave `purchase` y `generate_lead`; dimensiones personalizadas `cta_location`, `section`, `method`, `percent`.
- [ ] Analytics y Clarity: URL del sitio → `https://elexitodesertu.rebecacaceres.com`.
- [ ] Clarity: Masking en Balanced o Strict; integración con Analytics; bloquear tu IP y la de Rebeca.
- [ ] Antes de lanzar, excluir de los informes las compras de prueba (las que se hicieron aceptando cookies).

## 6. Meta

- [ ] Acceso al portfolio empresarial de Rebeca (píxel, cuenta publicitaria, Instagram, página, dominios).
- [ ] Píxel creado (instalación manual, sin pegar código). Pasarme el ID.
- [ ] Dominio `rebecacaceres.com` verificado (TXT en Hostalia).
- [ ] Probar eventos: `Lead`, `InitiateCheckout`, `Purchase`.

## 7. Decisiones de Rebeca

- [ ] Validar la web y el proceso de compra.
- [ ] Destino del botón «Más sobre mí» (ahora apunta a rebecacaceres.com).
- [ ] Escenario de urgencia: **A** (límite real de plazas, ¿cuántas?) o **B** (cierre el viernes 27 a las 23:59).
- [ ] Condiciones: reembolsos, no asistencia, cancelación o cambio de fecha, IVA, quién factura.
- [ ] Plataforma del directo y dónde se aloja la grabación.
- [ ] Testimonios, horarios para América, ventaja para su comunidad en el email 00.

## 8. Lo que hay que pasarme

- [ ] URL del formulario de Brevo y nombre del atributo del nombre.
- [ ] Enlace de Stripe real.
- [ ] ID del píxel de Meta.
- [ ] Enlaces del directo, de la grabación y de la encuesta.
- [ ] Respuestas para las condiciones de contratación.

## 9. Antes de lanzar

- [ ] Quitar el aviso de borrador de las condiciones.
- [ ] Prueba completa desde el móvil con Stripe real: formulario → pago → gracias → emails (sin spam).
- [ ] Sin pagar: a las 3 horas llega el carrito abandonado.
- [ ] Vista previa del enlace al compartirlo por WhatsApp.

## 10. Después

- [ ] Actualizar la política de privacidad de rebecacaceres.com: Stripe y Brevo como encargados.
- [ ] Avisar del error en su aviso legal: pone «CIF» y es un NIF de persona física.
- [ ] Antes del jueves 26: comprobar que ningún inscrito está dado de baja en Brevo; si lo está, enviarle el acceso a mano.
