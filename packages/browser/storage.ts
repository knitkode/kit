import { storageClient } from "./storageClient";

/**
 * Storage, for `localStorage` and `sessionStorage`
 *
 * @category storage
 */
export let storage = {
  l: storageClient(),
  s: storageClient(true),
};

export default storage;
