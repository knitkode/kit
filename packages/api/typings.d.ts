declare namespace Koine.Api {
  type Endpoints = import("./types").Api.Endpoints;
  type GenerateGetShortcuts<E extends Endpoints> =
    import("./types").Api.Generate.GetShortcuts<E>;
  type GeneratePostShortcuts<E extends Endpoints> =
    import("./types").Api.Generate.PostShortcuts<E>;
  type GenerateRequestShortcuts<E extends Endpoints> =
    import("./types").Api.Generate.RequestShortcuts<E>;
  type GenerateResponseShortcuts<E extends Endpoints> =
    import("./types").Api.Generate.ResponseShortcuts<E>;
  type GenerateResultShortcuts<E extends Endpoints> =
    import("./types").Api.Generate.ResultShortcuts<E>;
}
