import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const clientDir = path.join(rootDir, "dist", "client");
const staticDir = path.join(rootDir, "dist", "static");
const serverEntry = path.join(rootDir, "dist", "server", "index.js");

const routes = [
  "",
  "/connexion",
  "/inscription",
  "/installer",
  "/jouer",
  "/modes/minion-rush",
  "/modes/naxarus",
  "/admin",
  "/espace-testeur",
];

async function main() {
  if (!fs.existsSync(serverEntry)) {
    console.error("Server build not found. Run 'npm run build' first.");
    process.exit(1);
  }

  // Ensure static directory is clean
  if (fs.existsSync(staticDir)) {
    fs.rmSync(staticDir, { recursive: true, force: true });
  }
  fs.mkdirSync(staticDir, { recursive: true });

  // Copy client assets
  if (fs.existsSync(clientDir)) {
    console.log(`Copying client assets from ${clientDir} to ${staticDir}...`);
    fs.cpSync(clientDir, staticDir, { recursive: true });
  }

  // If basePath was set, vinext put assets under dist/client/<cleanBase>/_next.
  // Lift those up to root so GitHub Pages finds them at /_next
  const cleanBase = basePath.replace(/^\/+|\/+$/g, "");
  if (cleanBase) {
    const nestedInStatic = path.join(staticDir, cleanBase);
    if (fs.existsSync(nestedInStatic)) {
      console.log(`Lifting nested basePath assets from ${nestedInStatic} to root...`);
      fs.cpSync(nestedInStatic, staticDir, { recursive: true });
    }
  }

  // Import worker
  const { default: worker } = await import(pathToFileURL(serverEntry).href);

  for (const route of routes) {
    const targetUrl = `http://localhost${basePath}${route || "/"}`;
    console.log(`Prerendering ${route || "/"} (URL: ${targetUrl})...`);

    const res = await worker.fetch(
      new Request(targetUrl, {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      }
    );

    if (res.status !== 200) {
      console.warn(`Warning: Route ${route || "/"} returned HTTP ${res.status}`);
    }

    let html = await res.text();

    let targetFile;
    if (!route || route === "/") {
      targetFile = path.join(staticDir, "index.html");
    } else {
      const cleanRoute = route.replace(/^\/+/, "");
      const routeDir = path.join(staticDir, cleanRoute);
      fs.mkdirSync(routeDir, { recursive: true });
      targetFile = path.join(routeDir, "index.html");

      // Also create route.html
      fs.writeFileSync(path.join(staticDir, `${cleanRoute}.html`), html, "utf8");
    }

    fs.writeFileSync(targetFile, html, "utf8");
  }

  // 404 fallback for GitHub Pages SPA routing
  const rootIndex = path.join(staticDir, "index.html");
  if (fs.existsSync(rootIndex)) {
    fs.copyFileSync(rootIndex, path.join(staticDir, "404.html"));
  }

  // Post-process HTML, CSS, JS files to ensure all asset paths have basePath prefixed
  if (cleanBase) {
    console.log(`Rewriting asset URLs with basePath /${cleanBase}...`);
    const assetPattern = new RegExp(
      `(?<!/${cleanBase})/(screens|personnages|home_background_v4\\.png|naxarus\\.webp|naxarus_head\\.png|app_icon\\.png|favicon\\.svg|og\\.png|file\\.svg|globe\\.svg|window\\.svg)`,
      "g"
    );

    function processDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          processDir(fullPath);
        } else if (/\.(html|js|css)$/.test(entry.name)) {
          let content = fs.readFileSync(fullPath, "utf8");
          if (assetPattern.test(content)) {
            content = content.replace(assetPattern, `/${cleanBase}/$1`);
            fs.writeFileSync(fullPath, content, "utf8");
          }
        }
      }
    }

    processDir(staticDir);
  }

  // If cleanBase exists, also ensure dist/static/<cleanBase> has copies of all static files
  // so URLs with the base prefix also resolve if requested directly
  if (cleanBase) {
    const baseSubdir = path.join(staticDir, cleanBase);
    fs.mkdirSync(baseSubdir, { recursive: true });
    const items = fs.readdirSync(staticDir);
    for (const item of items) {
      if (item !== cleanBase) {
        const src = path.join(staticDir, item);
        const dest = path.join(baseSubdir, item);
        fs.cpSync(src, dest, { recursive: true });
      }
    }
  }

  // Prevent GitHub Pages Jekyll processing
  fs.writeFileSync(path.join(staticDir, ".nojekyll"), "");

  console.log(`Export complete: ${staticDir}`);
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
