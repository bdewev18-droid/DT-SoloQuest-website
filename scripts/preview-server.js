import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.resolve(__dirname, "..", "dist", "static");

const PORT = process.env.PORT || 8084;
const HOST = "127.0.0.1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURIComponent(req.url.split("?")[0]);

  // Strip optional base paths so both / and /DT-SoloQuest-website/ work
  reqPath = reqPath.replace(/^\/DT-SoloQuest-website(?:\/|$)/, "/");
  if (!reqPath.startsWith("/")) reqPath = "/" + reqPath;

  // Resolve file paths
  const relativePath = reqPath.replace(/^\/+/, "");
  const candidates = [
    path.join(staticDir, relativePath),
    path.join(staticDir, relativePath, "index.html"),
    path.join(staticDir, `${relativePath}.html`),
    path.join(staticDir, "index.html")
  ];

  let foundFile = null;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      foundFile = candidate;
      break;
    }
  }

  if (!foundFile) {
    const fallback404 = path.join(staticDir, "404.html");
    if (fs.existsSync(fallback404)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(fallback404));
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }

  const ext = path.extname(foundFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(foundFile).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`\n==================================================`);
  console.log(`  Solo Quest Local Preview Server running!`);
  console.log(`  Local URL:        http://${HOST}:${PORT}/`);
  console.log(`  Propose Page:     http://${HOST}:${PORT}/proposer`);
  console.log(`  Boss Battle:      http://${HOST}:${PORT}/modes/boss-battle`);
  console.log(`  Admin Back-office: http://${HOST}:${PORT}/admin`);
  console.log(`==================================================\n`);
});
