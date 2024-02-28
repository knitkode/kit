export type NoJsProps = Record<string, never>;

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

export default NoJs;
