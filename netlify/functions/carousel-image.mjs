import { getStore } from "@netlify/blobs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ese2025";
const MAX_IMAGES = 10;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-password, x-filename",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const imageStore = getStore("carousel-images");

  // GET — servir imagen binaria
  if (req.method === "GET") {
    if (!key) return json({ error: "Falta el parámetro key" }, 400);
    try {
      const result = await imageStore.getWithMetadata(key, { type: "arrayBuffer" });
      if (!result) return new Response("No encontrado", { status: 404 });
      return new Response(result.data, {
        headers: {
          "Content-Type": result.metadata?.contentType || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new Response("Error al servir imagen", { status: 500 });
    }
  }

  // Autenticación para escritura
  const auth = req.headers.get("x-admin-password");
  if (!auth || auth !== ADMIN_PASSWORD) {
    return json({ error: "Contraseña incorrecta" }, 401);
  }

  // POST — subir imagen (solo almacena el blob; el cliente gestiona el config)
  if (req.method === "POST") {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return json({ error: "Solo se permiten archivos de imagen" }, 400);
    }

    const buffer = await req.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return json({ error: "La imagen no puede superar 5 MB" }, 400);
    }

    const originalName = req.headers.get("x-filename") || "imagen.jpg";
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const imageKey = `img-${Date.now()}-${safeName}`;

    await imageStore.set(imageKey, buffer, { metadata: { contentType, originalName } });

    return json({ ok: true, key: imageKey });
  }

  // DELETE — borrar imagen (solo elimina el blob; el cliente gestiona el config)
  if (req.method === "DELETE") {
    if (!key) return json({ error: "Falta el parámetro key" }, 400);

    try {
      await imageStore.delete(key);
    } catch {
      // ignorar si ya no existe
    }

    return json({ ok: true });
  }

  return new Response("Método no permitido", { status: 405 });
};
