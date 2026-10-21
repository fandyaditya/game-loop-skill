import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

const SERVER = { name: "game-loop", version: "0.3.0" };

const LANES = [
  ["doctor", "Check Genex sign-in, credits, and live lanes.", []],
  ["image", "Generate an image into the game project.", ["prompt"]],
  ["model", "Generate a 3D model into the game project.", ["prompt"]],
  ["texture", "Generate a texture into the game project.", ["prompt"]],
  ["sfx", "Generate a sound effect into the game project.", ["prompt"]],
  ["music", "Generate music into the game project.", ["prompt"]],
  ["voice", "Generate a spoken line into the game project.", ["text"]],
  ["character", "Generate a rigged character into the game project.", ["prompt"]],
  ["wait", "Wait for one Genex job, or all of them when id is omitted.", []],
];

function tool(name, description, required) {
  const properties = {
    project: {
      type: "string",
      description:
        "Absolute path of the game project. Required when this server was not started in that folder.",
    },
  };
  if (required.includes("prompt")) {
    properties.prompt = { type: "string", description: "What to generate." };
  }
  if (required.includes("text")) {
    properties.text = { type: "string", description: "The line to speak." };
  }
  if (name === "wait") {
    properties.id = {
      type: "string",
      description: "Job id. Omit to wait for every running job.",
    };
  }
  return {
    name,
    description,
    inputSchema: {
      type: "object",
      properties,
      required,
      additionalProperties: false,
    },
  };
}

const TOOLS = LANES.map(([name, description, required]) =>
  tool(name, description, required),
);

function send(message) {
  const body = Buffer.from(JSON.stringify(message));
  process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`);
  process.stdout.write(body);
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function projectDir(args) {
  const requested = typeof args.project === "string" ? args.project : "";
  const candidates = [
    requested,
    process.env.CLAUDE_PROJECT_DIR,
    process.env.CODEX_PROJECT_DIR,
    process.cwd(),
  ].filter(Boolean);
  for (const candidate of candidates) {
    const dir = resolve(candidate);
    if (!isAbsolute(dir) || !existsSync(dir)) continue;
    if (existsSync(resolve(dir, "mcp", "server.mjs"))) continue;
    return dir;
  }
  return null;
}

function runGenex(args, cwd) {
  return new Promise((done) => {
    const child = spawn("npx", ["--yes", "genex", ...args], {
      cwd,
      shell: false,
      env: { ...process.env, npm_config_update_notifier: "false" },
    });
    let out = "";
    const take = (chunk) => {
      out += chunk.toString();
      if (out.length > 16000) out = out.slice(-16000);
    };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    const timer = setTimeout(() => child.kill("SIGTERM"), 180000);
    child.on("error", (error) => {
      clearTimeout(timer);
      done({ code: 1, out: error.message });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      done({ code: code ?? 1, out });
    });
  });
}

function laneArgs(name, args) {
  if (name === "doctor") return ["doctor"];
  if (name === "wait") return args.id ? ["wait", String(args.id)] : ["wait"];
  if (name === "voice") return ["voice", String(args.text)];
  return [name, String(args.prompt)];
}

async function callTool(params) {
  const name = params?.name;
  const args = params?.arguments ?? {};
  const known = LANES.find(([lane]) => lane === name);
  if (!known) {
    return { isError: true, text: `Unknown tool ${name}.` };
  }
  const required = known[2];
  for (const key of required) {
    if (typeof args[key] !== "string" || args[key].trim() === "") {
      return { isError: true, text: `${name} needs ${key}.` };
    }
  }
  const dir = projectDir(args);
  if (!dir) {
    return {
      isError: true,
      text: "Pass project as the absolute path of the game folder. Refusing to run Genex inside the plugin.",
    };
  }
  const result = await runGenex(laneArgs(name, args), dir);
  let text = result.out.trim() || `(genex exited ${result.code} with no output)`;
  if (result.code !== 0 && /could not determine executable|not found|ENOENT/i.test(text)) {
    text = `Genex is not set up in ${dir}. Tell the user once: set up https://genex.games/SKILL.md\n\n${text}`;
  }
  return { isError: result.code !== 0, text };
}

async function handle(message) {
  if (!message || message.jsonrpc !== "2.0") return;
  const { id, method, params } = message;
  if (id === undefined) return;
  if (method === "initialize") {
    reply(id, {
      protocolVersion: params?.protocolVersion || "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: SERVER,
    });
    return;
  }
  if (method === "tools/list") {
    reply(id, { tools: TOOLS });
    return;
  }
  if (method === "tools/call") {
    const result = await callTool(params);
    reply(id, {
      content: [{ type: "text", text: result.text }],
      isError: result.isError,
    });
    return;
  }
  if (method === "ping") {
    reply(id, {});
    return;
  }
  fail(id, -32601, `Method not found: ${method}`);
}

let buffer = Buffer.alloc(0);

function drain() {
  while (buffer.length > 0) {
    if (buffer[0] === 0x7b) {
      const end = buffer.indexOf(0x0a);
      if (end === -1) return;
      const line = buffer.slice(0, end).toString("utf8").trim();
      buffer = buffer.slice(end + 1);
      if (line) handle(JSON.parse(line));
      continue;
    }
    const sep = buffer.indexOf("\r\n\r\n");
    if (sep === -1) return;
    const header = buffer.slice(0, sep).toString("utf8");
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.slice(sep + 4);
      continue;
    }
    const length = Number(match[1]);
    const start = sep + 4;
    if (buffer.length < start + length) return;
    const body = buffer.slice(start, start + length).toString("utf8");
    buffer = buffer.slice(start + length);
    handle(JSON.parse(body));
  }
}

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  try {
    drain();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
  }
});
