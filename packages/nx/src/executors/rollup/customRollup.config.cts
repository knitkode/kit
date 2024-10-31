import { dirname, resolve } from "node:path";
import { ExecutorContext, joinPathFragments } from "@nx/devkit";
import {
  calculateProjectBuildableDependencies,
  computeCompilerOptionsPaths,
} from "@nx/js/src/utils/buildable-libs-utils";
import { type RollupExecutorOptions } from "@nx/rollup";
import { build as tscProgBuild } from "tsc-prog";
import * as ts from "typescript";

/**
 * Issues:
 * @see https://github.com/rollup/plugins/issues/568
 * @see https://github.com/timocov/dts-bundle-generator/discussions/68
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
export function pluginNxTds(
  /* nxRollupConfig: any,  */ options: RollupExecutorOptions,
  context: ExecutorContext,
) {
  const project =
    context.projectsConfigurations!.projects[context.projectName!];
  const sourceRoot = project.sourceRoot!;
  const { target, dependencies } = calculateProjectBuildableDependencies(
    context.taskGraph!,
    context.projectGraph!,
    context.root!,
    context.projectName!,
    context.targetName!,
    context.configurationName!,
    true,
  );

  // const pluginTs = ts();
  return {
    name: "nx-dts-bundle",
    /**
     * @param {unknown} _opts
     * @param {OutputBundle} bundle
     * @returns {Promise<void>}
     */
    async generateBundle(_opts: unknown, bundle: any): Promise<void> {
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
        rootDir: sourceRoot,
        // rootDir: options.projectRoot,
        allowJs: options.allowJs,
        declaration: true,
        paths: compilerOptionPaths,
      };

      tscProgBuild({
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
}

/**
 *
 * @param {import("rollup").RollupOptions} nxRollupConfig
 * @returns
 */
// export default (nxRollupConfig: any, options: RollupExecutorOptions) => {
//   console.log("ciao", nxRollupConfig.output.format);

//   if (nxRollupConfig.output.format === "cjs") {
//     return {
//       ...nxRollupConfig,
//       plugins: [
//         ...nxRollupConfig.plugins
//           .filter((a) => a.name !== "dts-bundle")
//           .filter((a) => a.name !== "rpt2"),
//         // rollupPluginTs(),
//         pluginNxTds(nxRollupConfig, options),
//       ],
//     };
//     // return {
//     //     ...nxConfig,
//     //     output: {
//     //       ...nxConfig.output,
//     //       // format,
//     //       dir: `${options.outputPath}`,
//     //       // name: names(context.projectName).className,
//     //       entryFileNames: `[name].d.ts`,
//     //       chunkFileNames: `[name].d.ts`,
//     //     },
//     //     // treeShake: true,
//     //     plugins: [
//     //       ...nxConfig.plugins.filter(a => a.name !== "dts-bundle").filter(a => a.name !== "rpt2"),
//     //       dts()
//     //     ]
//     //     //     url(),
//     //     //     svgr({native: true}) ]
//     // };
//   }

//   return nxRollupConfig;
// };
