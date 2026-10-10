export type NoJsProps = Record<string, never>;

export let NoJs = (_props: NoJsProps) => {
  return (
    <script
      id="no-js"
      dangerouslySetInnerHTML={{
        __html: `(function(c){c.remove("no-js");c.add("js")})(document.documentElement.classList)`,
      }}
    ></script>
  );
};

export default NoJs;
