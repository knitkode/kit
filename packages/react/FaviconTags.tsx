export type FaviconTagsProps = {
  name: string;
  color?: string;
  safariTabColor?: string;
  tileColor?: string;
  themeColor?: string;
};

/**
 * Favicon tags.
 *
 * This component is meant to be wrapped in a `<head>` manager component.
 *
 * These tags have been produced by [realfavicongenerator.net](https://realfavicongenerator.net/)
 * on _**16 Feb 2022**_.
 *
 * @see https://realfavicongenerator.net/
 */
export let FaviconTags = ({
  name,
  color,
  safariTabColor,
  tileColor,
  themeColor,
}: FaviconTagsProps) => {
  return (
    <>
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color={safariTabColor || color}
      />
      <meta name="apple-mobile-web-app-title" content={name} />
      <meta name="application-name" content={name} />
      <meta name="msapplication-TileColor" content={tileColor || color} />
      <meta name="theme-color" content={themeColor || color}></meta>
    </>
  );
};

export default FaviconTags;
