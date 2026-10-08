// Requires a serverless Node runtime; GitHub Pages cannot execute this handler.
// Configure ZAPIER_WEBHOOK_URL in the host's secret environment settings.
const ORIGIN = 'https://thenextwebec.com';
const MAX_BYTES = 16384;
const buckets = new Map();

async function readPayload(req) {
  if (req.body && typeof req.body === 'object') {
    if (Buffer.byteLength(JSON.stringify(req.body)) > MAX_BYTES) throw new RangeError();
    return req.body;
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body) > MAX_BYTES) throw new RangeError();
    return JSON.parse(req.body);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > MAX_BYTES) throw new RangeError();
    chunks.push(bytes);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function validatePayload(data) {
  if (!data || Array.isArray(data) || typeof data !== 'object') return null;
  const limits = { nombre: 120, empresa: 180, telefono: 40, whatsapp: 40,
    email: 254, web: 2048, sitio: 2048, orientacion: 1500, recomendacion: 1500 };
  const result = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (data[key] === undefined) continue;
    if (typeof data[key] !== 'string' || data[key].length > limit) return null;
    result[key] = data[key].trim();
  }
  if (!result.nombre || !(result.telefono || result.whatsapp || result.email)) return null;
  if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
  for (const key of ['web', 'sitio']) {
    if (!result[key]) continue;
    try { if (!['http:', 'https:'].includes(new URL(result[key]).protocol)) return null; }
    catch { return null; }
  }
  for (const key of ['resultado', 'score']) {
    if (data[key] === undefined) continue;
    if (!Number.isInteger(data[key]) || data[key] < 0 || data[key] > 10) return null;
    result[key] = data[key];
  }
  if (data.respuestas !== undefined) {
    if (!Array.isArray(data.respuestas) || data.respuestas.length !== 10 ||
      data.respuestas.some(answer => !['si', 'no', true, false].includes(answer))) return null;
    result.respuestas = data.respuestas;
  }
  return result;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const origin = req.headers?.origin;
  if (origin && origin !== ORIGIN) return res.status(403).json({ ok: false });
  if (origin === ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers?.['content-type'] || ''))
    return res.status(415).json({ ok: false });
  // Best effort only: per-process buckets do not survive serverless scaling.
  // Add host-level rate limits and bot verification before enabling public intake.
  const now = Date.now();
  for (const [key, value] of buckets) if (value.until <= now) buckets.delete(key);
  const client = req.socket?.remoteAddress || 'unknown';
  const bucket = buckets.get(client) || { count: 0, until: now + 60000 };
  bucket.count++;
  buckets.set(client, bucket);
  if (bucket.count > 10) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ ok: false });
  }
  let payload;
  try { payload = validatePayload(await readPayload(req)); }
  catch (error) { return res.status(error instanceof RangeError ? 413 : 400).json({ ok: false }); }
  if (!payload) return res.status(400).json({ ok: false });
  let webhook;
  try {
    webhook = new URL(process.env.ZAPIER_WEBHOOK_URL || '');
    if (webhook.protocol !== 'https:' || webhook.hostname !== 'hooks.zapier.com') throw new Error();
  } catch { return res.status(503).json({ ok: false }); }
  try {
    const response = await fetch(webhook, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8000), redirect: 'error'
    });
    if (!response.ok) return res.status(502).json({ ok: false });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ ok: false }); }
}
