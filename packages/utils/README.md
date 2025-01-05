# @koine/utils

Libraries to encapsulate and re-export from here, the selection is based on:

- [x] full typescript support
- [x] treeshake-ability
- [x] docs in source comments

- [dhmk-utils](https://github.com/dhmk083/dhmk-utils)
- [mesqueeb/merge-anything](https://github.com/mesqueeb/merge-anything)
- [mesqueeb/filter-anything](https://github.com/mesqueeb/filter-anything)
- [mesqueeb/case-anything](https://github.com/mesqueeb/case-anything)
- [mesqueeb/nestify-anything](https://github.com/mesqueeb/nestify-anything)
- [mesqueeb/fast-sort (fork)](https://github.com/mesqueeb/fast-sort "fork")
- [mesqueeb/compare-anything](https://github.com/mesqueeb/compare-anything)
- [mesqueeb/copy-anything](https://github.com/mesqueeb/copy-anything)
- [mesqueeb/flatten-anything](https://github.com/mesqueeb/flatten-anything)

To consider:

- [dlv](https://www.npmjs.com/package/dlv)
- [lukeed/dset](https://github.com/lukeed/dset)
- [angus-c/just](https://github.com/angus-c/just)

About ts utilities types @see:

- [sindresorhus/type-fest](https://github.com/sindresorhus/type-fest)
- [millsp/ts-toolbelt](https://github.com/millsp/ts-toolbelt)
- [ts-essentials](https://github.com/ts-essentials/ts-essentials)

For inspiration look at [1loc.dev](https://1loc.dev).

About utilities useful examples @see:

- [chakra-ui](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src)

TODO: check typescript utilities in [TypeScript core](https://github.com/microsoft/TypeScript/blob/main/src/compiler/core.ts)

## Code

- Transformative functions like `truncate` or `titleCase` should allow for nullable inputs as much as possible, acceptin both `undefined` and `null`.
