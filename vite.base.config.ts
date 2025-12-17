import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // test: {
  //   watch: false,
  //   globals: true,
  //   environment: "jsdom",
  //   include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  //   reporters: ["default"],
  //   coverage: {
  //     reportsDirectory: "../../coverage/packages/utils",
  //     provider: "v8",
  //   },
  // },
});
