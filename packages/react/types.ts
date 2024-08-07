export type KoineComponentProps<BaseComponentProps, ExtendableProps> =
  BaseComponentProps & ExtendableProps;

export type KoineComponent<Props = any> =
  | string
  | React.ForwardRefExoticComponent<Props>
  | React.ExoticComponent<Props>
  | React.FC<Props>
  | ((props: Props) => JSX.Element);
