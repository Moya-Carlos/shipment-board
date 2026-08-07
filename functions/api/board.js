const STORAGE_KEY = "shipment-board-v1";
const DEFAULT_DATA = { drivers: [], driverSeq: 0 };

function checkPin(request, env) {
  const pin = request.headers.get("X-Pin") || "";
  return env.BOARD_PIN && pin === env.BOARD_PIN;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!checkPin(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const value = await env.BOARD_KV.get(STORAGE_KEY);
  return new Response(value || JSON.stringify(DEFAULT_DATA), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!checkPin(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const body = await request.text();
  await env.BOARD_KV.put(STORAGE_KEY, body);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
