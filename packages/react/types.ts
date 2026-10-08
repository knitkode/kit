import type { JSX } from "react";

export type KitComponentProps<BaseComponentProps, ExtendableProps> =
  BaseComponentProps & ExtendableProps;

export type KitComponent<Props = any> =
  | string
  | React.ForwardRefExoticComponent<Props>
  | React.ExoticComponent<Props>
  | React.FC<Props>
  | ((props: Props) => JSX.Element);
