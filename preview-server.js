"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${HOST}`).pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(ROOT, relative);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(file, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }

    const headers = {
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache",
      "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    };
    let start = 0;
    let end = stats.size - 1;
    let status = 200;
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range || "");

    if (range) {
      if (range[1] === "") {
        const suffixLength = Number(range[2]);
        start = Math.max(0, stats.size - suffixLength);
      } else {
        start = Number(range[1]);
      }
      if (range[2] !== "" && range[1] !== "") end = Number(range[2]);
      if (start >= stats.size || start > end) {
        response.writeHead(416, { "Content-Range": `bytes */${stats.size}` }).end();
        return;
      }
      end = Math.min(end, stats.size - 1);
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
    }

    headers["Content-Length"] = String(end - start + 1);
    response.writeHead(status, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    fs.createReadStream(file, { start, end }).pipe(response);
  });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`Merenciano Calhas preview: http://${HOST}:${PORT}\n`);
});
