/**
 * FIXME: Type 'Set<any>' can only be iterated through when using the
 * '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
 * I am not sure I want to use those ts options here. Let's keep it commented
 * for now
 *
 * @category array
 */
export let removeDuplicates = <T extends any[]>(arr: T) => [...new Set(arr)];

export default removeDuplicates;
