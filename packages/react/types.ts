export type KoineComponentProps<BaseComponentProps, ExtendableProps> =
  BaseComponentProps & ExtendableProps;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KoineComponent<Props = any> =
  | string
  | React.ForwardRefExoticComponent<Props>
  | React.ExoticComponent<Props>
  | React.FC<Props>
  | ((props: Props) => JSX.Element);
