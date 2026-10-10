declare let __webpack_nonce__: string;

/**
 * @category security
 * @see https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/nonce.ts
 */
export let getNonce = () =>
  typeof __webpack_nonce__ === "undefined" ? null : __webpack_nonce__;

export default getNonce;
