# Auditoría de NextWebEC — 8 de octubre de 2026

Se conservaron la identidad, los proyectos y los flujos de contacto. La web está alojada en GitHub Pages; su frontend es estático y no requiere un build npm. El commit anterior constituye la copia recuperable antes de los cambios.

## Corregido

| Área | Cambio |
|---|---|
| Privacidad y términos | Páginas enlazadas desde el pie, explicación del procesamiento local, WhatsApp, GA4 y Clarity. Datos legales sin confirmar claramente identificados. |
| Consentimiento | Aceptar, rechazar y elegir categorías independientes; herramientas bloqueadas inicialmente; retirada limpia cookies accesibles y recarga para detener herramientas ya cargadas. |
| Seguridad | CSP compatible por meta, política de referencia, scripts propios externos; retirado webhook del código actual, variable de entorno y validación de handler antiguo. No se registran payloads personales. |
| Formularios | Campos y longitudes, URL, teléfono con 7–15 dígitos, resumen de WhatsApp con datos de contacto; mensajes y evaluación local conservados. No se envió ningún mensaje durante QA. |
| SEO | Sitemap sin redirecciones; versión antigua y muestra ficticia noindex; canonical, un H1 y metadatos de las páginas principales. |
| Redes sociales | Imagen de marca 1200 × 630, Open Graph y tarjeta X en páginas principales. |
| Imágenes | WebP con variantes 640/1280, srcset/sizes, hero prioritario y dimensiones. Imagen móvil de ~1,5 MB a ~61 KB. Los archivos originales se conservan. |
| Accesibilidad | Focus visible, objetivos táctiles, diálogo de preferencias con cierre por teclado, labels, movimiento reducido y contenido visible si JavaScript falla. |
| 404 | Página propia con retorno a inicio y contacto, noindex. |
| Ejemplos antiguos | Conservados; rutas de recursos corregidas, muestra veterinaria identificada y adaptada a móvil. |

## Verificado

- Segunda pasada de QA en Chromium: 320, 360, 375, 390, 430, 768, 1024 y 1440 px sobre inicio, evaluación, privacidad, términos y 404.
- Sin desbordamiento horizontal en esas páginas. Contraste de texto y controles contrastado con umbrales AA según tamaño; esto no constituye certificación exhaustiva WCAG.
- Menú móvil, Escape, preguntas frecuentes, campos obligatorios, URL y teléfono; cálculo de 10 preguntas y resumen de contacto.
- Consentimiento inicial sin cargas de GA4/Clarity; rechazo, aceptación por categoría y retirada probados con solicitudes interceptadas.
- XML de sitemap, recursos locales, anclas y sintaxis de JavaScript. Sin errores de consola en la pasada final de las páginas principales.
- HTTPS: HTTP y www redirigen al dominio HTTPS sin www. Cuatro proyectos externos responden HTTP 200.
- Muestra móvil local: 150 ms de latencia, 1,6 Mbps y CPU ×4; LCP observado ~1,1 s, CLS 0, transferencia inicial ~126 KB. No es un dato de campo ni una puntuación Lighthouse. INP real y Core Web Vitals de tráfico requieren datos suficientes.
- GA4 y Clarity conservan los IDs existentes. Eventos propios de contacto, apertura del resumen y evaluación no incorporan valores de campos. No se afirma recepción real de mensajes ni conversiones en las cuentas externas.

## Pendiente externo

1. **Prioridad alta: rotar o desactivar el webhook de Zapier que ya había sido publicado.** Quitar el valor del archivo actual no revoca la URL que permanece en el historial. No hay conexión de Zapier disponible para completar esa acción.
2. Confirmar identidad legal, dirección y periodos de conservación de consultas y cuentas de medición; validar el aviso de privacidad con el propietario. No se inventaron esos datos.
3. Headers HTTP adicionales (X-Content-Type-Options, Permissions-Policy, CSP frame-ancestors y política equivalente): GitHub Pages no permite definirlos mediante archivos de este repositorio; requieren un proxy/CDN u otro hosting. La CSP por meta no sustituye frame-ancestors.
4. Search Console: confirmar acceso y propiedad, enviar sitemap y comprobar indexación. GA4/Clarity: confirmar acceso, retención, enmascaramiento en datos reales y conversiones en sus paneles.
5. Safari/iOS, Firefox y Edge no se ejecutaron como motores independientes; los tamaños móviles se probaron con Chromium. Completar comprobación en dispositivos reales.
6. El handler antiguo checklist-lead.js **no es un backend activo de GitHub Pages**. Los formularios actuales funcionan con WhatsApp y no necesitan dicho handler. Si se activa recepción automática: configurar host, ZAPIER_WEBHOOK_URL y protección persistente de solicitudes; el límite en memoria es solo básico.

La auditoría técnica del frontend no certifica cumplimiento jurídico ni seguridad absoluta. No se da por cerrada la preparación de producción mientras siga pendiente la revocación del webhook expuesto.

Fuentes de referencia: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [consentimiento Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode), [Ley de protección de datos de Ecuador](https://www.asambleanacional.gob.ec/es/multimedios-legislativos/63464-ley-organica-de-proteccion-de-datos).
