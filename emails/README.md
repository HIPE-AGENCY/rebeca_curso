# Emails del taller «El éxito de ser tú»

Nueve emails para Brevo, desde el anuncio a la comunidad hasta el cierre de la grabación.

- **Ver el flujo:** abre `emails/index.html` en el navegador (botones para escritorio y móvil).
- **Cambiar textos o diseño:** edita `emails/build.js` y ejecuta `node emails/build.js`. La plantilla (cabecera, colores, botones, firma, pie) es común a todos.
- **Llevarlos a Brevo:** en cada email, Brevo → Crear plantilla → «Pegar tu código» → pega el contenido de `emails/brevo/<email>.html`. El asunto y el texto de vista previa están en `emails/index.html`.

## Antes de activarlos

1. Sustituir en `CONFIG` (al principio de `build.js`) los enlaces pendientes: directo, grabación, encuesta y página de la newsletter.
2. Comprobar el nombre del atributo del nombre en Brevo (`FIRSTNAME` o `NOMBRE`) y ajustarlo en `CONFIG.atributoNombre`.
3. Cambiar `CONFIG.inscripcion` a la página de inscripción de la versión elegida de la landing.
4. Publicar la web: las imágenes de los emails se cargan desde `https://elexitodesertu.rebecacaceres.com/assets/email/`.
5. Enviarte una prueba de cada uno desde Brevo y revisarla en Gmail y en el móvil.
