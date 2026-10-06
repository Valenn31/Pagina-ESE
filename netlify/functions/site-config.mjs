import { getStore } from "@netlify/blobs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ese2025";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-password",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const DEFAULT_CONFIG = { inscriptionUrl: "", carouselImages: [] };

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const store = getStore("site-config");

  if (req.method === "GET") {
    try {
      const data = await store.get("config", { type: "json" });
      return new Response(JSON.stringify(data ?? DEFAULT_CONFIG), { headers: CORS });
    } catch {
      return new Response(JSON.stringify(DEFAULT_CONFIG), { headers: CORS });
    }
  }

  if (req.method === "POST") {
    const auth = req.headers.get("x-admin-password");
    if (!auth || auth !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
        status: 401,
        headers: CORS,
      });
    }
    try {
      const body = await req.json();
      await store.setJSON("config", body);
      return new Response(JSON.stringify({ ok: true }), { headers: CORS });
    } catch {
      return new Response(JSON.stringify({ error: "Error al guardar" }), {
        status: 500,
        headers: CORS,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Método no permitido" }), {
    status: 405,
    headers: CORS,
  });
};
