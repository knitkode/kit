export type MetaProps = {
  /**
   * Allows the users to zoom the page. When `false` we add
   * `maximum-scale=1, user-scalable=0` to the `meta->viewport` content.
   *
   * Zooming is an opt in instead of the default browser behaviour as disabling
   * it helps prevent weird zooming on input fields on iPhone iOS devices.
   * @see https://www.warrenchandler.com/2019/04/02/stop-iphones-from-zooming-in-on-form-fields/
   * @see https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
   *
   * @default false
   */
  zoom?: boolean;
};

export let Meta = ({ zoom }: MetaProps) => {
  return (
    <meta
      name="viewport"
      content={`width=device-width, initial-scale=1${
        zoom ? "" : ", maximum-scale=1, user-scalable=0"
      }`}
    />
  );
};

export default Meta;
