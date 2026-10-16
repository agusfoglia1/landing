# Nodo Sistemas

Landing responsiva y función serverless para enviar el formulario de contacto por email. No guarda consultas en una base de datos.

## Deploy en Vercel

Importá `agusfoglia1/landing` desde Vercel. Los archivos están en la raíz del repositorio: dejá **Root Directory** en `./`. Seleccioná **Other** como framework y dejá vacíos los comandos de build y el output directory. Vercel publica `index.html` y detecta `api/contact.js` como función.

## Configurar email

El formulario usa [Resend](https://resend.com) para entregar las consultas. Creá una API key y verificá el dominio remitente. Después, en Vercel → Project → Settings → Environment Variables, agregá:

- `RESEND_API_KEY`: clave de API privada de Resend.
- `RESEND_FROM_EMAIL`: remitente del dominio verificado, por ejemplo `Nodo Sistemas <hola@tu-dominio.com>`.
- `CONTACT_TO_EMAIL`: casilla que recibirá las consultas.

Volvé a desplegar después de agregar las variables. La ruta del endpoint es `POST /api/contact`. Valida datos en servidor y usa un honeypot básico contra bots. Para desarrollo local, ejecutá `vercel dev` desde la carpeta del proyecto.

Las previews se identifican como conceptos y no atribuyen clientes, tecnologías implementadas ni resultados. No se publican redes sociales ni un email que no se haya verificado. El formulario informa que el envío depende de la configuración de Resend. La referencia no incluye un archivo de la fuente Nodo; la página deja preparado el `@font-face` y usa Newsreader como fallback editorial.
