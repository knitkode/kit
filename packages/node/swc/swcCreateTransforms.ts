import type { FlatObjectFirstLevel } from "@koine/utils";
import {
  type SwcTransform,
  type SwcTransformingLib,
  swcCreateTransform,
} from "./swcCreateTransform";

export type SwcTransforms<TLibs extends readonly SwcTransformingLib[]> =
  FlatObjectFirstLevel<{
    // [N in Names]: ReturnType<typeof swcCreateTransform<`${N}`>>;
    [TLib in TLibs[number] as TLib["path"]]: SwcTransform<
      TLib["path"],
      TLib["flat"]
    >;
  }>;

/**
 * @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
 *
 * @category tooling
 * @category swc
 */
export const swcCreateTransforms = <
  TLibs extends readonly SwcTransformingLib[],
>(
  libs: TLibs,
) =>
  libs.reduce(
    (map, lib) => ({
      ...map,
      ...swcCreateTransform(lib),
    }),
    {} as SwcTransforms<TLibs>,
  );

export default swcCreateTransforms;
