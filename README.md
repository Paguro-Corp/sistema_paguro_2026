# Sistema Paguro · Comercio inteligente

Sitio del taller **De tu local a toda Colombia: vende esta Navidad con WhatsApp e IA**, para comerciantes de San Victorino, Bogotá.

Sitio desplegado: https://sistema-paguro-taller-navidad.paguro-corp-1320.chatgpt.site

## Recorrido

1. **Registro (`/`)**: página de entrada y formulario emergente. Guarda nombre, correo, WhatsApp colombiano y aceptación de recordatorios en D1.
2. **Taller (`/taller`)**: video de ventas, temario, preguntas frecuentes y botones de pago.
3. **Pago en Hotmart**: ambos botones del paso 2 abren directamente el widget, con los datos del registro precargados. En celular o si el widget no carga, se usa el checkout de Hotmart. No hay un segundo formulario del sitio. La dirección antigua `/pago` redirige a `/taller`.
4. **Agradecimiento (`/gracias`)**: próximos pasos, calendario y compartir por WhatsApp. Cuando todavía no existe confirmación verificada de pago, informa que está pendiente y evita afirmar que la compra está aprobada.

`/gracias?preview=1` permite revisar el diseño de compra aprobada. Es solo una vista de revisión: no registra un pago ni dispara Purchase.

## Tecnología

- React 19, TypeScript y Vinext sobre Vite.
- Cloudflare Workers y D1 con Drizzle ORM.
- CSS adaptable a celular, Poppins e Inter.
- Widget oficial de Hotmart.
- Proyecto preparado para alojamiento en Sites; identidad del despliegue en `.openai/hosting.json`.

## Desarrollo local

Requiere Node.js **22.13 o superior** y npm. Git y tar se necesitan para publicación con Sites.

```sh
npm ci
npm run build
```

El primer build genera `dist/server/wrangler.json`. Aplica la migración a la base local:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_spicy_mister_fear.sql
```

Inicia el servidor:

```sh
npm run dev
```

Abre la dirección que imprime el servidor, normalmente http://localhost:5173. La base local y la de producción están separadas.

Para revisar tipos:

```sh
npx tsc --noEmit
```

## Estructura

- `app/funnel.tsx`: pantallas, formulario y recorrido.
- `app/hotmart.ts`: apertura del widget y precarga del registro.
- `app/api/registro/route.ts`: validación y persistencia de los datos.
- `app/api/checkout/route.ts`: registro del inicio de pago.
- `app/globals.css`: identidad visual y estilos adaptables.
- `db/` y `drizzle/`: esquema y migraciones de D1.
- `public/brand/`: emblema y logo suministrados.
- `public/taller.ics`: evento de calendario.
- `worker/` y `scripts/`: runtime, compilación y soporte del alojamiento.

## Oferta e integración de pagos

- Precio actual confirmado: **$33.225 COP**.
- Checkout proporcionado: https://pay.hotmart.com/D93889393J?checkoutMode=2
- El precio también se usa en la presentación del descuento sobre el Kit.
- La compra ocurre en Hotmart; el sitio no captura tarjetas ni ejecuta cargos directamente.
- El producto D93889393J muestra actualmente un nombre diferente al taller. Debe revisarse en Hotmart antes de lanzar campañas; no se ha renombrado desde este proyecto.

En Hotmart se guardó la opción de página externa para el producto **4244777**, asociado al enlace anterior:

| Estado | URL |
| --- | --- |
| Compra aprobada | https://sistema-paguro-taller-navidad.paguro-corp-1320.chatgpt.site/gracias |
| En espera de pago | https://sistema-paguro-taller-navidad.paguro-corp-1320.chatgpt.site/gracias?estado=pendiente |
| En análisis de crédito | https://sistema-paguro-taller-navidad.paguro-corp-1320.chatgpt.site/gracias?estado=analisis |

El regreso del comprador no constituye prueba de pago. **Falta integrar las notificaciones verificadas de Hotmart** para actualizar el registro a `pagado` y guardar su referencia de transacción. Validar autenticidad, producto, importe, moneda y duplicados en servidor. No se ha realizado una compra de prueba.

## Medición y seguimiento

La función `track()` usa `window.fbq` únicamente si ya está instalado. No se incluyó un ID de píxel de Meta.

- `PageView`: carga de página.
- `ViewContent`: página de registro.
- `Lead`: registro guardado correctamente.
- `InitiateCheckout`: después de preparar la reserva, al abrir Hotmart desde el paso 2.
- `Purchase`: solo cuando el servidor devuelve estado pagado y referencia de transacción. Valor 33225, moneda COP. La vista de revisión no lo dispara.

La tabla `leads` conserva consentimiento, fecha, UTMs, inicio del pago y estado. El segmento para seguimiento es `pago_pendiente`, excluyendo pagos confirmados. No hay una ruta pública para listar registros.

## Pendientes para lanzamiento

- Videos VID-01, VID-02 y VID-03 y retratos reales: los marcadores están visibles en las páginas.
- Número de WhatsApp, plataforma/enlace del taller y canal de entrega de la repetición.
- Condiciones de la garantía y del Kit Vende en Navidad.
- Datos del responsable y política definitiva de tratamiento de datos.
- Webhook de Hotmart, acceso al taller y recordatorios por correo y WhatsApp.
- ID de Meta y consentimiento de medición aplicable.
- Apertura del acceso del sitio a visitantes externos. El despliegue actual es privado para revisión.

## Archivos excluidos

`.gitignore` excluye dependencias, builds, credenciales y variables locales, cachés, bases de datos de desarrollo y estado de las herramientas. Este repositorio no contiene los registros de compradores ni los datos locales de prueba.

## Validación realizada

Compilación de producción y TypeScript; revisión visual en escritorio y celular; registro y recuperación de datos; apertura directa del widget desde el paso 2 con datos precargados; redirección de la ruta antigua de pago; página de agradecimiento y protección de la medición Purchase frente a visitas sin pago verificado.
