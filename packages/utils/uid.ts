let lastId = 0;

/**
 * Super basic UID increment-based generator
 *
 * @category uid
 */
export let uid = (prefix = "id") => {
  lastId++;
  return `${prefix}-${lastId}`;
};
