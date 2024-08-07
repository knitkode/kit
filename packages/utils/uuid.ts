/**
 * Uuid, tiny custom helper instead of node's uuid/v4
 *
 * @category uid
 * @see https://stackoverflow.com/a/2117523/1938970
 */
export let uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line eqeqeq
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export default uuid;
