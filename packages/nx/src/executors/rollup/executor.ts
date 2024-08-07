/* eslint-disable */
// @ts-nocheck Deprecated attempts of custom rollup executor
import { join, parse, resolve } from "node:path";
import {
  type ExecutorContext,
  /* , runExecutor */
} from "@nx/devkit";
import { logger, readJsonFile } from "@nx/devkit";
import { eachValueFrom } from "@nx/devkit/src/utils/rxjs-for-await";
import {
  calculateProjectBuildableDependencies, // computeCompilerOptionsPaths,
} from "@nx/js/src/utils/buildable-libs-utils";
import {
  type RollupExecutorOptions as NxRollupExecutorOptions,
  type RollupExecutorEvent, // rollupExecutor as nxrollupExecutor, // createRollupOptions
  createRollupOptions,
} from "@nx/rollup";
import {
  type NormalizedRollupExecutorOptions,
  normalizeRollupExecutorOptions,
} from "@nx/rollup/src/executors/rollup/lib/normalize";
import { updatePackageJson } from "@nx/rollup/src/plugins/package-json/update-package-json";
import { runRollup } from "@nx/rollup/src/plugins/plugin";
import { deleteOutputDir } from "@nx/rollup/src/utils/fs";
import * as rollup from "rollup";
// import * as ts from "typescript";
// import { type RollupExecutorSchema } from "./schema";
// import dtsBundleGenerator from "dts-bundle-generator";
import { dts } from "rollup-plugin-dts";
// import rollupPluginTs from "rollup-plugin-ts";
// import tscProg from "tsc-prog";
import {
  // defineRollupSwcMinifyOption,
  defineRollupSwcOption, // minify,
  swc,
} from "rollup-plugin-swc3";
import { Observable, from, of } from "rxjs";
import { catchError, concatMap, last, scan, tap } from "rxjs/operators";

type RollupExecutorOptions = NxRollupExecutorOptions;

declare global {
  interface ProcessEnv {
    NODE_ENV: string;
  }
}

export default async function* _runExecutor(
  rawOptions: RollupExecutorOptions,
  context: ExecutorContext,
) {
  // @ts-expect-error same as nx source
  process.env.NODE_ENV ??= "production";

  const options = normalizeRollupExecutorOptions(rawOptions, context);

  const packageJson = readJsonFile(options.project);

  const rollupOptions = createRollupOptions(options, context);

  const outfile = resolveOutfile(context, options);

  if (options.watch) {
    const watcher = rollup.watch(rollupOptions);
    return yield* eachValueFrom(
      new Observable<RollupExecutorEvent>((obs) => {
        watcher.on("event", (data) => {
          if (data.code === "START") {
            logger.info(`Bundling ${context.projectName}...`);
          } else if (data.code === "END") {
            updatePackageJson(options, packageJson);
            logger.info("Bundle complete. Watching for file changes...");
            obs.next({ success: true, outfile });
          } else if (data.code === "ERROR") {
            logger.error(`Error during bundle: ${data.error.message}`);
            obs.next({ success: false });
          }
        });
        // Teardown logic. Close watcher when unsubscribed.
        return () => watcher.close();
      }),
    );
  } else {
    logger.info(`Bundling ${context.projectName}...`);

    // Delete output path before bundling
    if (options.deleteOutputPath) {
      deleteOutputDir(context.root, options.outputPath);
    }

    const start = process.hrtime.bigint();

    // begin custom ------------------------------------------------------------
    const formats = options.format || ["cjs"];
    const nxRollupInputOptions = rollupOptions[0];
    let nxRollupPlugins: rollup.InputPluginOption[] = [];

    let rollupInputOptions: rollup.InputOptions[] = rollupOptions.map(
      (rollupInputOptions, idx) => {
        let plugins = nxRollupInputOptions.plugins || [];
        plugins = Array.isArray(plugins) ? plugins : [plugins];
        nxRollupPlugins = plugins
          .filter(
            (plugin) =>
              ![
                "dts-bundle",
                "rpt2",
                "nx-swc",
                // @ts-expect-error aaaa
              ].includes(plugin.name),
          )
          .filter(Boolean);

        // @ts-expect-error aaaa
        console.log(nxRollupPlugins.map((p) => p.name));
        return {
          ...rollupInputOptions,
          plugins: nxRollupPlugins,
        };
      },
    );

    const rollupOptionsDts: rollup.RollupOptions = {
      ...nxRollupInputOptions,
      output: {
        // @ts-expect-error aaaa
        ...nxRollupInputOptions.output,
        entryFileNames: `[name].d.ts`,
        chunkFileNames: `[name].d.ts`,
      },
      plugins: [...nxRollupPlugins, dts()],
    };

    const getSwcOptions = (format: (typeof formats)[number]) =>
      defineRollupSwcOption({
        tsconfig: options.tsConfig,
        // swcrc: join(sourceRoot, ".swcrc"),
        jsc: {
          target: (
            {
              cjs: "es2019",
              esm: "esnext",
            } as const
          )[format],
          parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true,
          },
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true,
          },
          keepClassNames: true,
          externalHelpers: true,
          loose: true,
          minify: {
            compress: {
              unused: true,
            },
            mangle: true,
          },
        },
        module: {
          type: (
            {
              cjs: "commonjs",
              esm: "es6",
            } as const
          )[format],
          strict: true,
          noInterop: true,
        },
        minify: true,
      });

    const rollupOptionsSwc = formats.map((format) => ({
      ...nxRollupInputOptions,
      output: {
        // @ts-expect-error aaaa
        ...nxRollupInputOptions.output,
        format,
        entryFileNames: `[name].${format}.js`,
        chunkFileNames: `[name].${format}.js`,
      },
      plugins: [...nxRollupPlugins, swc(getSwcOptions(format))],
    }));

    // rollupInputOptions = [/* ...rollupInputOptions,  */rollupOptionsDts];
    rollupInputOptions = [...rollupOptionsSwc, rollupOptionsDts];

    // end custom ------------------------------------------------------------

    return from(rollupInputOptions)
      .pipe(
        concatMap((opts) =>
          runRollup(opts).pipe(
            catchError((e) => {
              logger.error(`Error during bundle: ${e}`);
              return of({ success: false });
            }),
          ),
        ),
        scan<RollupExecutorEvent, RollupExecutorEvent>(
          (acc, result) => {
            if (!acc.success) return acc;
            return result;
          },
          { success: true, outfile },
        ),
        last(),
        tap({
          next: (result) => {
            if (result.success) {
              const end = process.hrtime.bigint();
              const duration = `${(Number(end - start) / 1_000_000_000).toFixed(
                2,
              )}s`;

              updatePackageJson(options, packageJson);
              logger.info(`⚡ Done in ${duration}`);
            } else {
              logger.error(`Bundle failed: ${context.projectName}`);
            }
          },
        }),
      )
      .toPromise();
  }

  // const project = context.projectsConfigurations!.projects[context.projectName];
  // const sourceRoot = project.sourceRoot;
  // const { target, dependencies } = calculateProjectBuildableDependencies(
  //   context.taskGraph,
  //   context.projectGraph!,
  //   context.root,
  //   context.projectName!,
  //   context.targetName!,
  //   context.configurationName!,
  //   true,
  // );

  // const { projectName } = context;

  // // if (projectName) {
  // //   console.log("Executor ran for Rollup", options);
  // //   const result = await Promise.race([
  // //     await runExecutor(
  // //       { project: projectName, target: "build" },
  // //       options,
  // //       context,
  // //     ),
  // //   ]);
  // // }

  // options.rollupConfig = resolve(join(__dirname, "./customRollup.config.cjs"));

  // for await (const s of await nxrollupExecutor(options, context)) {
  //   // s.success
  // }
  // // yield await nxrollupExecutor(options, context);

  // return {
  //   success: true,
  // };
}

function resolveOutfile(
  context: ExecutorContext,
  options: NormalizedRollupExecutorOptions,
) {
  if (!options.format?.includes("cjs")) return undefined;
  const { name } = parse(options.outputFileName ?? options.main);
  return resolve(context.root, options.outputPath, `${name}.cjs.js`);
}
