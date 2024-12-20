import {
  type ObjectMergeInstance,
  objectMergeCreate,
} from "./objectMergeCreate";

/**
 * @borrows [unjs/defu](https://github.com/unjs/defu)
 */
export let objectMerge = objectMergeCreate() as ObjectMergeInstance;

export default objectMerge;
