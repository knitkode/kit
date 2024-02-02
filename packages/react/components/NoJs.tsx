export type NoJsProps = object;

export let NoJs = (_props: NoJsProps) => {
  return (
    <script
      id="no-js"
      dangerouslySetInnerHTML={{
        __html: `document.querySelector("html").className=document.querySelector("html").className.replace(/no-js/,"") + "js";`,
      }}
    ></script>
  );
};
