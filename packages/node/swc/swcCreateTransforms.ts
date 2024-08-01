import type { FlatObjectFirstLevel } from "@koine/utils";
import { type SwcTransform, swcCreateTransform } from "./swcCreateTransform";

export type SwcTransforms<
  Names extends string,
  Prefix extends string,
> = FlatObjectFirstLevel<{
  // [N in Names]: ReturnType<typeof swcCreateTransform<`${Prefix}${N}`>>;
  [N in Names]: SwcTransform<`${Prefix}${N}`>;
}>;

/**
 * @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
 *
 * @category tooling
 * @category swc
 */
export const swcCreateTransforms = <
  TLibs extends readonly string[],
  TScope extends string,
>(
  libs: TLibs,
  scope?: TScope,
) =>
  libs.reduce(
    (map, lib) => ({
      ...map,
      ...swcCreateTransform(scope ? `${scope}/${lib}` : lib),
    }),
    {} as SwcTransforms<
      TLibs[number],
      TScope extends string ? `${TScope}/` : ``
    >,
  );

export default swcCreateTransforms;
