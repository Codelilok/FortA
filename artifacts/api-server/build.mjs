import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, mkdir } from "node:fs/promises";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(artifactDir, "../..");

const external = [
  "*.node", "sharp", "better-sqlite3", "sqlite3", "canvas", "bcrypt",
  "argon2", "fsevents", "re2", "farmhash", "xxhash-addon", "bufferutil",
  "utf-8-validate", "ssh2", "cpu-features", "dtrace-provider", "isolated-vm",
  "lightningcss", "pg-native", "oracledb", "mongodb-client-encryption",
  "nodemailer", "handlebars", "knex", "typeorm", "protobufjs",
  "onnxruntime-node", "@tensorflow/*", "@prisma/client", "@mikro-orm/*",
  "@grpc/*", "@swc/*", "@aws-sdk/*", "@azure/*", "@opentelemetry/*",
  "@google-cloud/*", "@google/*", "googleapis", "firebase-admin",
  "@parcel/watcher", "@sentry/profiling-node", "@tree-sitter/*", "aws-sdk",
  "classic-level", "dd-trace", "ffi-napi", "grpc", "hiredis", "kerberos",
  "leveldown", "miniflare", "mysql2", "newrelic", "odbc", "piscina",
  "realm", "ref-napi", "rocksdb", "sass-embedded", "sequelize", "serialport",
  "snappy", "tinypool", "usb", "workerd", "wrangler", "zeromq",
  "zeromq-prebuilt", "playwright", "puppeteer", "puppeteer-core", "electron",
];

const banner = {
  js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
  `,
};

const sharedEsbuild = {
  platform: "node",
  bundle: true,
  format: "esm",
  outExtension: { ".js": ".mjs" },
  logLevel: "info",
  external,
  sourcemap: "linked",
  banner,
  plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
};

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  // Build 1: Full server for Render / self-hosted (includes listen() call)
  await esbuild({
    ...sharedEsbuild,
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    outdir: distDir,
  });

  // Build 2: Vercel serverless function (exports Express app, no listen())
  const vercelDir = path.resolve(repoRoot, "api");
  await mkdir(vercelDir, { recursive: true });
  await esbuild({
    ...sharedEsbuild,
    entryPoints: [path.resolve(artifactDir, "src/app.ts")],
    outdir: vercelDir,
    logLevel: "silent",
  });
  console.log("⚡ Vercel function built → api/app.mjs");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
