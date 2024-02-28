/**
 * To easily get typed native `for in`
 *
 * @category native
 * @category object
 */
export let forin = <T>(
  object: T,
  cb: <K extends keyof T>(key: K, value: T[K]) => void,
) => {
  for (const key in object) {
    cb(key, object[key]);
  }
};

export default forin;
