# Sistema Paguro · Comercio inteligente

Sitio del taller **De tu local a toda Colombia: vende esta Navidad con WhatsApp e IA**, para comerciantes de San Victorino, Bogotá.

Sitio desplegado: https://sistema-paguro-taller-navidad.paguro-corp-1320.chatgpt.site

## Recorrido

1. **Registro (`/`)**: página de entrada y formulario emergente. Guarda nombre, correo, WhatsApp colombiano y aceptación de recordatorios en PostgreSQL.
2. **Taller (`/taller`)**: video de ventas, temario, preguntas frecuentes y botones de pago.
3. **Pago en Hotmart**: ambos botones del paso 2 abren directamente el widget, con los datos del registro precargados. En celular o si el widget no carga, se usa el checkout de Hotmart. No hay un segundo formulario del sitio. La dirección antigua `/pago` redirige a `/taller`.
4. **Agradecimiento (`/gracias`)**: próximos pasos, calendario y compartir por WhatsApp. Cuando todavía no existe confirmación verificada de pago, informa que está pendiente y evita afirmar que la compra está aprobada.

`/gracias?preview=1` permite revisar el diseño de compra aprobada. Es solo una vista de revisión: no registra un pago ni dispara Purchase.

## Tecnología

- React 19, TypeScript y Next.js 16.4.3, con compilación nativa para Vercel.
- Vercel Functions y PostgreSQL en Neon, con Drizzle ORM y conexión HTTP.
- CSS adaptable a celular, Poppins e Inter.
- Widget oficial de Hotmart.
- Esta rama de GitHub está preparada para Vercel. El despliegue original en Sites/Cloudflare conserva su propia copia de código; `.openai/hosting.json` y los archivos de Cloudflare se conservan como referencia histórica, no participan en el build de Vercel.

## Despliegue en Vercel

El error `NEXT_NO_ROUTES_MANIFEST` aparecía porque el script ejecutaba Vinext, que produce `dist/`, mientras Vercel esperaba `.next/routes-manifest.json`. Ahora `npm run build` aplica migraciones y ejecuta `next build`.

Configuración:
- Framework: **Next.js**.
- Root Directory: raíz del repositorio.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: predeterminado de Next.js (`.next`), declarado también en `vercel.json`.
- Node.js: 24.x (también compatible con 22.13 o superior).

Neon está conectado desde Vercel Marketplace al proyecto `sistema-paguro-2026`, plan gratuito, sin autenticación adicional. La integración proporciona `DATABASE_URL` y `DATABASE_URL_UNPOOLED` en los entornos conectados. Las credenciales nunca se incluyen en Git. El cliente de base se inicializa al usarlo, no al importar módulos.

`drizzle-pg/` contiene las migraciones nuevas de PostgreSQL. El build ejecuta `scripts/migrate-postgres.mjs`, que aplica solo migraciones pendientes y usa la conexión directa si está disponible. `drizzle/` conserva la migración SQLite histórica y no se ejecuta en Vercel.

**Los registros del antiguo sitio D1 no se copian automáticamente a Neon.** La nueva base se creó vacía. Si se necesita trasladar registros existentes, debe hacerse una exportación e importación aparte. El sitio original permanece separado.

## Desarrollo local

Requiere Node.js 22.13 o superior (hasta 24.x) y npm.

```sh
npm ci
```

Descarga las variables del proyecto con `vercel env pull .env.local` usando tu sesión de Vercel. No publiques ese archivo.

```sh
npm run db:migrate
npm run dev
```

Abre http://localhost:5173. Para compilar y revisar tipos:

```sh
npm run build
npm run typecheck
```

`npm start` sirve el build de producción. `npm run db:generate` genera una nueva migración a partir del esquema. No modifiques las migraciones ya aplicadas.

## Estructura

- `app/funnel.tsx`: pantallas, formulario y recorrido.
- `app/hotmart.ts`: apertura del widget y precarga del registro.
- `app/api/registro/route.ts`: validación y persistencia de los datos.
- `app/api/checkout/route.ts`: registro del inicio de pago.
- `app/globals.css`: identidad visual y estilos adaptables.
- `db/` y `drizzle-pg/`: esquema y migraciones PostgreSQL de Neon; `drizzle/` contiene la migración histórica de D1.
- `public/brand/`: emblema y logo suministrados.
- `public/taller.ics`: evento de calendario.
- `scripts/migrate-postgres.mjs`: migración versionada antes de compilar. Los archivos de `worker/`, Vite y soporte Sites son históricos y están excluidos del build Next.js.

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

## Verificación de compatibilidad Vercel

Build nativo de Next.js y revisión de tipos completados; `.next/routes-manifest.json` generado. Migración PostgreSQL aplicada y pruebas de API: rechazo de celular inválido, guardado y recuperación del registro, importe 33225 COP, inicio del pago conservando pago_pendiente, rechazo de origen externo y carga de agradecimiento. El registro sintético de prueba fue eliminado. No se completó ningún pago real.
