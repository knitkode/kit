declare namespace Kit.Api {
  type Endpoints = import("./types.js").Api.Endpoints;
  type GenerateGetShortcuts<E extends Endpoints> =
    import("./types.js").Api.Generate.GetShortcuts<E>;
  type GeneratePostShortcuts<E extends Endpoints> =
    import("./types.js").Api.Generate.PostShortcuts<E>;
  type GenerateRequestShortcuts<E extends Endpoints> =
    import("./types.js").Api.Generate.RequestShortcuts<E>;
  type GenerateResponseShortcuts<E extends Endpoints> =
    import("./types.js").Api.Generate.ResponseShortcuts<E>;
  type GenerateResultShortcuts<E extends Endpoints> =
    import("./types.js").Api.Generate.ResultShortcuts<E>;
}
