// Tracks download counts for the "Take This With You" resource cards.
// Storage: Netlify Blobs — a key-value store scoped to this site, auto-configured
// at runtime with no manual siteID/token setup (see Netlify's Blobs docs).
//
// GET  /.netlify/functions/track-download?id=<resource-id>   -> read count, no increment
// POST /.netlify/functions/track-download  {"id":"<resource-id>"} -> increment + return new count
//
// This is a simple read-modify-write, not an atomic counter — perfectly fine for a
// portfolio site's download tally, not something that needs financial-grade accuracy.
// The client (js/download-counter.js) also guards against one browser incrementing
// more than once via localStorage, so this mostly just protects against literal
// double-submits, not determined abuse — there's no auth here, by design, since this
// is a public-facing counter on a public-facing file.

const { getStore } = require('@netlify/blobs');

// Keep this in sync with the data-download-id values used in index.html.
// Only list ids that are actually live/downloadable right now — e.g. the
// "Coming Soon" card has no id yet since there's nothing to count.
const ALLOWED_IDS = ['cv-template'];

exports.handler = async (event) => {
  const jsonHeaders = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const store = getStore('download-counts');

  if (event.httpMethod === 'GET') {
    const id = (event.queryStringParameters || {}).id;
    if (!id || !ALLOWED_IDS.includes(id)) {
      return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'invalid id' }) };
    }
    const current = await store.get(id, { type: 'json' });
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ id: id, count: (current && current.count) || 0 }) };
  }

  if (event.httpMethod === 'POST') {
    let id;
    try {
      id = JSON.parse(event.body || '{}').id;
    } catch (e) {
      return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'invalid body' }) };
    }
    if (!id || !ALLOWED_IDS.includes(id)) {
      return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'invalid id' }) };
    }
    const current = await store.get(id, { type: 'json' });
    const next = ((current && current.count) || 0) + 1;
    await store.setJSON(id, { count: next });
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ id: id, count: next }) };
  }

  return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'method not allowed' }) };
};
