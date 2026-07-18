// Netlify Function: /.netlify/functions/records
// Reemplaza a window.storage usando Netlify Blobs como almacén clave-valor,
// compartido entre todos los estudiantes y el tutor (un solo "store" para el taller).

const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido." }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo de la solicitud inválido." }) };
  }

  const { action, key, value, prefix } = body;

  try {
    const siteIdPresent = !!process.env.NETLIFY_SITE_ID;
    const tokenPresent = !!process.env.NETLIFY_BLOBS_TOKEN;

    if (action === "debug") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          NETLIFY_SITE_ID_presente: siteIdPresent,
          NETLIFY_BLOBS_TOKEN_presente: tokenPresent
        })
      };
    }

    const storeOptions = (siteIdPresent && tokenPresent)
      ? { name: "grfa-records", siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN }
      : "grfa-records";
    const store = getStore(storeOptions);

    if (action === "set") {
      if (!key) return { statusCode: 400, body: JSON.stringify({ error: "Falta la clave." }) };
      await store.set(key, value);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    if (action === "get") {
      if (!key) return { statusCode: 400, body: JSON.stringify({ error: "Falta la clave." }) };
      const val = await store.get(key);
      if (val === null) return { statusCode: 404, body: JSON.stringify({ error: "No encontrado." }) };
      return { statusCode: 200, body: JSON.stringify({ value: val }) };
    }

    if (action === "list") {
      const { blobs } = await store.list({ prefix: prefix || "" });
      return { statusCode: 200, body: JSON.stringify({ keys: blobs.map((b) => b.key) }) };
    }

    if (action === "delete") {
      if (!key) return { statusCode: 400, body: JSON.stringify({ error: "Falta la clave." }) };
      await store.delete(key);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: "Acción no reconocida: " + action }) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Error interno de almacenamiento.",
        tipo: err.name || err.errorType || "desconocido"
      })
    };
  }
};
