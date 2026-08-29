import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        "3group/index": resolve(import.meta.dirname, "3group/index.html"),
        "tcc/signature-builder/index": resolve(
          import.meta.dirname,
          "tcc/signature-builder/index.html",
        ),
      },
    },
  },
});
