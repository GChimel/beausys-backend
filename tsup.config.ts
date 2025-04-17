import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  target: "node18",
  external: ["@prisma/client", ".prisma/client"],
});
