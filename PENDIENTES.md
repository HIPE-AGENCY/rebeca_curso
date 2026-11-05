# Pendientes · El éxito de ser tú

Checklist para lanzar el taller del **sábado 28 de noviembre de 2026**.
Web: **https://elexitodesertu.rebecacaceres.com** · Emails del flujo: `emails/index.html` (abrir en el navegador).

## Estado a 1 de noviembre de 2026

| Parte | Estado |
|---|---|
| Landing publicada (GitHub Pages, HTTPS forzado) | Hecho |
| Google Analytics y Clarity con banner de cookies | Hecho |
| Brevo: dominio autenticado, remitentes, listas, formularios de la landing | Hecho |
| Brevo: automatización de carrito abandonado (01) | Creada; revisar la condición antes del 01b |
| Make: escenario «Taller · Stripe → Brevo» (pago → lista Inscritos) | Montado con Stripe real, **desactivado** |
| Stripe real en la web | En la rama `stripe-real-tribeca`, **sin publicar** |
| Titular Tribeca Lifestyle, S.L. en cookies, inscripción, condiciones y emails | Hecho en la rama |
| Cierre automático del formulario (viernes 27, 23:59) | Hecho en la rama |
| Condiciones de contratación | **Borrador**, faltan decisiones de Rebeca y su asesor |
| Plantillas en Brevo | Llevan el pie antiguo; se resuben al final |
| Píxel de Meta y anuncios | Pendiente |

Fusionar `stripe-real-tribeca` en `main` publica la landing con el cobro real al momento.

## 1. Rebeca y su asesor

- [ ] Reembolsos, derecho de desistimiento, no asistencia, cancelación o cambio de fecha.
- [ ] Plataforma del directo y dónde se aloja la grabación; si en ella salen participantes.
- [x] Datos del Registro Mercantil de Tribeca Lifestyle, S.L. (tomo 43246, folio 1, hoja M-764067, inscripción 1.ª), ya en las condiciones.
- [ ] Email de contacto para clientes.
- [x] IVA: formación no reglada, 21 % (Pilar Mirón, 5 nov.). Ventas fuera de la UE: factura sin IVA con la mención «Venta fuera de la U.E. NO aplica IVA».
- [ ] IVA a compradores particulares de otros países de la UE: confirmar con Pilar si va el IVA español o el del país del comprador.
- [ ] Facturas: quién las emite (Stripe o la gestoría) y cómo se piden los datos fiscales (en las condiciones: por email a exitodesertu@rebecacaceres.com).
- [ ] Nombre visible en la página de pago de Stripe (ahora «Tribeca Psicólogos»).
- [ ] Revisar las condiciones y la política de privacidad (rama `privacidad-taller` del repo de la web).
- [ ] Validar los emails 01b y 09 a quien no se apuntó a la newsletter.
- [ ] Acceso al portfolio de Meta.

## 2. Stripe (cuenta real)

- [ ] Webhook de Make registrado con el evento `checkout.session.completed`.
- [ ] Identificador `plink_` del enlace del taller, para filtrar el escenario de Make.
- [ ] Enlace: cantidad fija, códigos promocionales y vuelta a `/gracias?session_id={CHECKOUT_SESSION_ID}`.
- [ ] Cupones del 100 % con un código por persona (máx. 1 canje).
- [ ] Desactivar el enlace el viernes 27 a las 23:59.

## 3. Make

- [ ] Filtro por el enlace de pago del taller.
- [ ] Email 03 como transaccional (plantilla transaccional en Brevo).
- [ ] Rama de pagos posteriores al viernes 27, 11:00: email 05.
- [ ] Activar el escenario justo antes de la compra de prueba.

## 4. Brevo

- [ ] Migrar la newsletter desde la cuenta de Hipe, con las bajas.
- [ ] Dirección de la cuenta: cambiar a la de Tribeca (C/ Silva).
- [ ] Plan: el gratuito envía 300 emails al día; comprobar frente al tamaño de la newsletter.
- [ ] Automatización 01: segunda condición «no está en Inscritos» antes del 01b; desactivarla el viernes 27 a las 23:59.
- [ ] Enlaces del directo, la grabación y la encuesta en `emails/build.js`; regenerar y resubir todas las plantillas.
- [ ] Programar las campañas 00, 02b, 02c y 04 a 08; probar cada una con la lista Pruebas.

## 5. Lanzamiento

- [ ] Quitar el aviso de borrador de las condiciones.
- [ ] Fusionar `stripe-real-tribeca` en `main`.
- [ ] Desde el móvil: compra real de 150 € con reembolso, un código gratuito y un registro sin pagar (01 a las 3 h).
- [ ] Excluir las compras de prueba de Analytics.
- [ ] Enlace al taller en la home de rebecacaceres.com; email 00; redes.

## 6. Después

- [ ] Antes del jueves 26: comprobar que ningún inscrito está dado de baja en Brevo; si lo está, enviarle el acceso a mano.
