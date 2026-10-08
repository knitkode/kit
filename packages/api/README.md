# @knitkode/api

[![npm](https://img.shields.io/npm/v/@knitkode/api)](https://www.npmjs.com/package/@knitkode/api)

A small, type-safe API client built on `fetch`: describe your endpoints once and get typed `get`/`post`/`put`/`patch`/`delete` methods, optional [SWR](https://swr.vercel.app) hooks and Next.js API route helpers.

## Install

```bash
pnpm add @knitkode/api
# or: npm install @knitkode/api
```

`swr` and `next` are optional peer dependencies, needed only for `@knitkode/api/swr`, `@knitkode/api/swr-mutation` and `@knitkode/api/next`.

## Usage

```ts
import { createApi } from "@knitkode/api";

type User = { id: string; name: string };

type Endpoints = {
  users: {
    GET: { query: { page: number }; ok: User[] };
    POST: { json: { name: string }; ok: User };
  };
};

const api = createApi<Endpoints>("myApi", "https://api.example.com", {
  headers: { Authorization: "Bearer <token>" },
});

const result = await api.get("users", { query: { page: 2 } });
if (result.ok) {
  result.data; // User[]
}

await api.post("users", { json: { name: "Ada" } });
```

With SWR, `createSwrApi` (from `@knitkode/api/swr`) takes the same arguments and adds React hooks next to the plain methods.

## Entry points

Import from `@knitkode/api`, or from one of its subpaths:

<details>
<summary>All 8 subpaths</summary>

- `@knitkode/api/ApiError`
- `@knitkode/api/createApi`
- `@knitkode/api/createApiResultFail`
- `@knitkode/api/createApiResultOk`
- `@knitkode/api/next`
- `@knitkode/api/swr`
- `@knitkode/api/swr-mutation`
- `@knitkode/api/types`

</details>

The ambient `Kit.Api` helper types are opt-in:

```ts
/// <reference types="@knitkode/api/typings" />
```

## Requirements

ES modules only, with TypeScript declarations included. Use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in TypeScript projects. See the [repository README](../../README.md#requirements).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Upgrading from `@koine/*`? Read the [migration guide](../../docs/migrating-to-v3.md).

## License

[MIT](./LICENSE)
