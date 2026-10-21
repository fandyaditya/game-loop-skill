import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";

const BASE = "https://openapi.tripo3d.ai/v3";
const CAP = 100;
const COST = { split: 40, rig: 25, motion: 10, check: 0 };
const LEDGER = resolve(".game-loop-spend.json");

const key = process.env.TRIPO_API_KEY;
if (!key) {
  console.error("Set TRIPO_API_KEY. One dollar of Tripo credits is the whole budget.");
  process.exit(1);
}

function spentOf(ledger) {
  return ledger.spent.reduce((sum, row) => sum + row.credits, 0);
}

async function ledger() {
  if (!existsSync(LEDGER)) return { cap_credits: CAP, spent: [] };
  return JSON.parse(await readFile(LEDGER, "utf8"));
}

async function record(op, credits, task) {
  const book = await ledger();
  book.spent.push({ op, credits, task, at: new Date().toISOString() });
  await writeFile(LEDGER, JSON.stringify(book, null, 2));
}

async function api(path, options = {}) {
  const headers = { Authorization: `Bearer ${key}` };
  if (options.json) headers["Content-Type"] = "application/json";
  const res = await fetch(BASE + path, {
    method: options.method ?? "GET",
    headers,
    body: options.json ? JSON.stringify(options.json) : options.body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || (typeof json.code === "number" && json.code !== 0)) {
    throw new Error(json.message || json.suggestion || `Tripo ${res.status} on ${path}`);
  }
  return json.data ?? json;
}

async function allow(op) {
  const cost = COST[op];
  const book = await ledger();
  const used = spentOf(book);
  if (used + cost > CAP) {
    throw new Error(
      `Stopped. This project already used ${used} credits and ${op} costs ${cost}. Cap is ${CAP} ($1).`,
    );
  }
  const balance = await api("/account/balance");
  const have = Number(balance.balance ?? balance.credits ?? 0);
  if (have < cost) {
    throw new Error(`Tripo balance is ${have} credits. ${op} needs ${cost}. Do not buy more than $1.`);
  }
}

async function wait(taskId) {
  const deadline = Date.now() + 180000;
  while (Date.now() < deadline) {
    const task = await api(`/tasks/${encodeURIComponent(taskId)}`);
    if (task.status === "success") return task;
    if (["failed", "cancelled", "banned", "expired"].includes(task.status)) {
      throw new Error(`${taskId} ${task.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(`${taskId} still running after 3 minutes. Do not start it again.`);
}

async function upload(file) {
  const path = resolve(file);
  const bytes = await readFile(path);
  if (bytes.length > 30 * 1024 * 1024) throw new Error("Mesh is over 30 MB. Use a smaller GLB.");
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: "model/gltf-binary" }), basename(path));
  const data = await api("/files", { method: "POST", body: form });
  if (!data.file_token) throw new Error("Upload did not return a file_token.");
  return data.file_token;
}

async function save(task, name) {
  const url = task.output?.model_url;
  if (!url) return null;
  await mkdir("assets/cheap", { recursive: true });
  const file = resolve("assets/cheap", `${name}.glb`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

async function split(input) {
  await allow("split");
  const created = await api("/mesh/segment", { method: "POST", json: { input } });
  const task = await wait(created.task_id);
  await record("split", Number(task.credits_consumed ?? COST.split), task.task_id);
  const file = await save(task, `split-${task.task_id}`);
  return { task: task.task_id, file };
}

async function check(input) {
  const created = await api("/animations/rig-check", { method: "POST", json: { input } });
  const task = await wait(created.task_id);
  return { riggable: task.output?.riggable === true, rig_type: task.output?.rig_type || "biped" };
}

async function rig(input) {
  const verdict = await check(input);
  if (!verdict.riggable) {
    throw new Error(`Not riggable (${verdict.rig_type}). Do not call rig.`);
  }
  await allow("rig");
  const biped = verdict.rig_type === "biped";
  const created = await api("/animations/rig", {
    method: "POST",
    json: {
      input,
      rig_type: verdict.rig_type,
      model: biped ? "v3.0-20260909" : "v2.5-20260210",
      spec: biped ? "mixamo" : "tripo",
      out_format: "glb",
    },
  });
  const task = await wait(created.task_id);
  await record("rig", Number(task.credits_consumed ?? COST.rig), task.task_id);
  const file = await save(task, `rig-${task.task_id}`);
  return { task: task.task_id, file, rig_type: verdict.rig_type };
}

async function motion(input, clip) {
  await allow("motion");
  const created = await api("/animations/retarget", {
    method: "POST",
    json: {
      input,
      animation: clip,
      out_format: "glb",
      export_with_geometry: true,
      animate_in_place: true,
    },
  });
  const task = await wait(created.task_id);
  await record("motion", Number(task.credits_consumed ?? COST.motion), task.task_id);
  const file = await save(task, `motion-${task.task_id}`);
  return { task: task.task_id, file };
}

async function source(value) {
  if (value && existsSync(resolve(value))) return upload(value);
  if (value && /^[A-Za-z0-9_-]{8,80}$/.test(value)) return value;
  throw new Error("Pass a local GLB path or a Tripo task id.");
}

const [cmd, arg, extra] = process.argv.slice(2);

try {
  if (cmd === "balance") {
    const book = await ledger();
    const balance = await api("/account/balance");
    console.log(JSON.stringify({ balance, spent_credits: spentOf(book), cap_credits: CAP }));
  } else if (cmd === "split") {
    console.log(JSON.stringify(await split(await source(arg))));
  } else if (cmd === "rig") {
    console.log(JSON.stringify(await rig(await source(arg))));
  } else if (cmd === "motion") {
    const clip = extra || "preset:walk";
    console.log(JSON.stringify(await motion(await source(arg), clip)));
  } else if (cmd === "run") {
    const input = await source(arg);
    const parts = await split(input);
    const skeleton = await rig(parts.task);
    const clip = skeleton.rig_type === "biped" ? "preset:walk" : `preset:${skeleton.rig_type}:walk`;
    const animated = await motion(skeleton.task, clip);
    console.log(JSON.stringify({ parts, skeleton, animated, clip }));
  } else {
    console.error("Use: balance | split <glb-or-task> | rig <glb-or-task> | motion <rig-task> [clip] | run <glb>");
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
