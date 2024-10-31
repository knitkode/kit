/**
 * @borrows [SO's asnwer](https://stackoverflow.com/a/326076)
 */
export const isWindowInsideIframe = () => window.self !== window.top;

export default isWindowInsideIframe;
