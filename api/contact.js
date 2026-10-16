const MAX_BODY_BYTES = 20000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROJECT_TYPES = new Set(['Landing page', 'Sitio para negocio', 'Sitio institucional', 'Sistema de gestión', 'Integración de APIs o datos', 'Otro']);

function clean(value, max) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function escapeHtml(value) { return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

module.exports = async function contactHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error:'Método no permitido.'}); }
  if (!(req.headers['content-type'] || '').toLowerCase().includes('application/json')) return res.status(415).json({error:'El formato de la solicitud no es válido.'});
  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) return res.status(413).json({error:'La consulta es demasiado extensa.'});
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) return res.status(413).json({error:'La consulta es demasiado extensa.'});
  if (clean(body.website, 200)) return res.status(202).json({ok:true}); // Honeypot for basic bot submissions.
  const name=clean(body.name,120), email=clean(body.email,254).toLowerCase(), type=clean(body.type,100), idea=clean(body.idea,5000);
  if (name.length<2 || !EMAIL_RE.test(email) || !PROJECT_TYPES.has(type) || idea.length<10) return res.status(400).json({error:'Revisá los campos e intentá nuevamente.'});
  const apiKey=process.env.RESEND_API_KEY, from=process.env.RESEND_FROM_EMAIL, to=process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) { console.error('Contact endpoint is missing email provider configuration.'); return res.status(503).json({error:'El formulario todavía no está configurado. Escribinos por email.'}); }
  const safeName=escapeHtml(name), safeEmail=escapeHtml(email), safeType=escapeHtml(type), safeIdea=escapeHtml(idea).replace(/\r?\n/g,'<br>');
  try {
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`Nueva consulta web: ${type}`,html:`<h2>Nueva consulta desde Nodo Sistemas</h2><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Tipo:</strong> ${safeType}</p><p><strong>Idea y funcionalidades:</strong><br>${safeIdea}</p>`,text:`Nueva consulta desde Nodo Sistemas\n\nNombre: ${name}\nEmail: ${email}\nTipo: ${type}\n\nIdea y funcionalidades:\n${idea}`})});
    if (!response.ok) { console.error('Email provider rejected a contact submission.',{status:response.status}); return res.status(502).json({error:'No pudimos enviar tu consulta. Probá de nuevo o escribinos por email.'}); }
    return res.status(201).json({ok:true,message:'Recibimos tu consulta. Gracias por escribirnos.'});
  } catch(error) { console.error('Contact email delivery failed.',error instanceof Error?error.message:'Unknown error'); return res.status(502).json({error:'No pudimos enviar tu consulta. Probá de nuevo o escribinos por email.'}); }
};
