/* eslint-disable */
// @ts-nocheck Deprecated attempts of custom rollup executor
const { resolve, dirname } = require("path");
const ts = require("typescript");
const rollupPluginTs = require("rollup-plugin-ts");
const { dts } = require("rollup-plugin-dts");
const tscProg = require("tsc-prog");
const dtsBundleGenerator = require("dts-bundle-generator");
const {
  computeCompilerOptionsPaths,
} = require("@nx/js/src/utils/buildable-libs-utils");
const { joinPathFragments } = require("@nx/devkit");

/**
 * Issues:
 * @see https://github.com/rollup/plugins/issues/568
 *
 * Nx rollup sources:
 * @see https://github.com/nrwl/nx/blob/master/packages/rollup/src/executors/rollup/rollup.impl.ts
 * @see https://github.com/nrwl/nx/blob/master/packages/js/src/plugins/rollup/type-definitions.ts
 * @see https://github.com/nrwl/nx/blob/master/packages/react/plugins/bundle-rollup.ts
 *
 * Rollup plugins examples:
 * @see https://github.com/wessberg/rollup-plugin-ts/blob/master/src/plugin/typescript-plugin.ts
 * @see https://github.com/timocov/dts-bundle-generator
 * @see https://github.com/Swatinem/rollup-plugin-dts
 * @see https://api-extractor.com/pages/setup/configure_rollup/
 *
 *
 * @param {import("rollup").RollupOptions} nxRollupConfig
 * @param {NxRolluOptions} options  TODO: find type
 * @returns
 */
const pluginNxTds = (nxRollupConfig, options) => {
  // const pluginTs = ts();
  return {
    name: "nx-dts-bundle",
    /**
     * @param {unknown} _opts
     * @param {OutputBundle} bundle
     * @returns {Promise<void>}
     */
    async generateBundle(_opts, bundle) {
      console.log("nx-dts-bundle", _opts);
      // const await pluginTs(_opts, bundle)

      // NOTE: source from native nx rollup plugin `dts-bundle`
      // @see https://github.com/nrwl/nx/blob/master/packages/js/src/plugins/rollup/type-definitions.ts

      // for (const [name, file] of Object.entries(bundle)) {
      //   if (
      //     file.type === 'asset' ||
      //     !file.isEntry ||
      //     file.facadeModuleId == null
      //   ) {
      //     continue;
      //   }
      //   const hasDefaultExport = file.exports.includes('default');
      //   const entrySourceFileName = relative(
      //     options.projectRoot,
      //     file.facadeModuleId
      //   );
      //   const entrySourceDtsName = entrySourceFileName.replace(
      //     /\.[cm]?[jt]sx?$/,
      //     ''
      //   );
      //   const dtsFileName = file.fileName.replace(/\.[cm]?js$/, '.d.ts');
      //   const relativeSourceDtsName = JSON.stringify('./' + entrySourceDtsName);
      //   const dtsFileSource = hasDefaultExport
      //     ? stripIndents`
      //         export * from ${relativeSourceDtsName};
      //         export { default } from ${relativeSourceDtsName};
      //       `
      //     : `export * from ${relativeSourceDtsName};\n`;
      //   this.emitFile({
      //     type: 'asset',
      //     fileName: dtsFileName,
      //     source: dtsFileSource,
      //   });
      // }
      // shim, TODO: find a way to get the workspace root here
      const context = { root: resolve("../") };
      const tsConfigPath = joinPathFragments(context.root, options.tsConfig);
      const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
      const config = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        dirname(tsConfigPath),
      );
      const compilerOptionPaths = computeCompilerOptionsPaths(
        config,
        dependencies,
      );
      const compilerOptions = {
        rootDir: options.projectRoot,
        allowJs: options.allowJs,
        declaration: true,
        paths: compilerOptionPaths,
      };

      tscProg.build({
        basePath: __dirname,
        // configFilePath: 'tsconfig.json',
        configFilePath: options.tsConfig,
        // compilerOptions: {
        //   rootDir: `${options.outputPath}`, // 'src',
        //   outDir: 'dist',
        //   declaration: true // must be set
        // },
        compilerOptions: compilerOptions,
        bundleDeclaration: {
          entryPoint: "index.d.ts", // relative to the OUTPUT directory ('dist' here)
        },
      });

      // this.emitFile({
      //   type: "asset",
      //   // fileName: nxRollupConfig.output.name + "-ciao",
      //   fileName: "index.d.ts",
      //   source: "ciao!"
      // })
    },
  };
};

/**
 *
 * @param {import("rollup").RollupOptions} nxRollupConfig
 * @returns
 */
module.exports = (nxRollupConfig, options) => {
  console.log("ciao", nxRollupConfig.output.format);

  if (nxRollupConfig.output.format === "cjs") {
    return {
      ...nxRollupConfig,
      plugins: [
        ...nxRollupConfig.plugins
          .filter((a) => a.name !== "dts-bundle")
          .filter((a) => a.name !== "rpt2"),
        // rollupPluginTs(),
        pluginNxTds(nxRollupConfig, options),
      ],
    };
    // return {
    //     ...nxConfig,
    //     output: {
    //       ...nxConfig.output,
    //       // format,
    //       dir: `${options.outputPath}`,
    //       // name: names(context.projectName).className,
    //       entryFileNames: `[name].d.ts`,
    //       chunkFileNames: `[name].d.ts`,
    //     },
    //     // treeShake: true,
    //     plugins: [
    //       ...nxConfig.plugins.filter(a => a.name !== "dts-bundle").filter(a => a.name !== "rpt2"),
    //       dts()
    //     ]
    //     //     url(),
    //     //     svgr({native: true}) ]
    // };
  }

  return nxRollupConfig;
};
