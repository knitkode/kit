/**
 * Determine the document's height
 *
 * @see https://github.com/cferdinandi/smooth-scroll (credits)
 */
export let getDocumentHeight = () => {
  const { body, documentElement } = document;

  return Math.max(
    body.scrollHeight,
    documentElement.scrollHeight,
    body.offsetHeight,
    documentElement.offsetHeight,
    body.clientHeight,
    documentElement.clientHeight,
  );
};

export default getDocumentHeight;
