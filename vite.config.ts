import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const isVercel = process.env["VERCEL"] === "1" || process.env["VERCEL"] === "true";
const isNetlify = process.env["NETLIFY"] === "true" || process.env["NETLIFY"] === "1";

function getPreset() {
  if (isVercel) return "vercel";
  if (isNetlify) return "netlify";
  return "cloudflare-module";
}

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      preset: getPreset(),
    }),
    viteReact(),
  ],
});

