# Nodo Sistemas

Landing responsiva y función serverless para enviar el formulario de contacto por email. No guarda consultas en una base de datos.

## Deploy en Vercel

Importá este repositorio desde Vercel. Si los archivos están dentro de `outputs/nodo-sistemas`, elegí esa carpeta como **Root Directory**. Seleccioná **Other** como framework y dejá vacíos los comandos de build y el output directory. Vercel publica `index.html` y detecta `api/contact.js` como función.

## Configurar email

El formulario usa [Resend](https://resend.com) para entregar las consultas. Creá una API key y verificá el dominio remitente. Después, en Vercel → Project → Settings → Environment Variables, agregá:

- `RESEND_API_KEY`: clave de API privada de Resend.
- `RESEND_FROM_EMAIL`: remitente del dominio verificado, por ejemplo `Nodo Sistemas <hola@tu-dominio.com>`.
- `CONTACT_TO_EMAIL`: casilla que recibirá las consultas.

Volvé a desplegar después de agregar las variables. La ruta del endpoint es `POST /api/contact`. Valida datos en servidor y usa un honeypot básico contra bots. Para desarrollo local, ejecutá `vercel dev` desde la carpeta del proyecto.

Antes de publicar, reemplazá el correo visible `contacto@nodosistemas.com`, los enlaces sociales de muestra y las previews conceptuales por los datos definitivos del equipo. La referencia no incluye un archivo de la fuente Nodo, así que los títulos usan Newsreader como aproximación editorial.
