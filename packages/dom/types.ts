import type {
  AnythingFalsy,
  // KeysOfValue,
  // LiteralUnion,
  // OverloadsToTuple,
  PickStartsWith,
} from "@koine/utils";

export type AnyWindowEventType = AnyDOMEventType<typeof window>;

/**
 * We use it either throwing an error on unexisting element or falling back
 * to `window` in case of _scroll_ or _resize_ events
 */
export type AnyDOMEventTargetLoose = AnyDOMEventTarget | AnythingFalsy;

type MapEventTargetsByTargetName = HTMLElementTagNameMap &
  SVGElementTagNameMap &
  MathMLElementTagNameMap/*  & {
    window: typeof window;
    document: Document;
  } */;

export type AnyDOMEventTarget =
  MapEventTargetsByTargetName[keyof MapEventTargetsByTargetName]
  | typeof window
  | Document;

////////////////////////////// approach 1 (faster):

type MapByEventTargetName = {
  window: {
    target: typeof window;
    events: WindowEventMap;
  };
  document: {
    target: Document;
    events: DocumentEventMap;
  }
} & {
  [Name in keyof MapEventTargetsByTargetName]: {
    target: MapEventTargetsByTargetName[Name];
    events: {
        [Method in keyof PickStartsWith<
          MapEventTargetsByTargetName[Name],
          "on"
        > as Method extends `on${infer EventType}`
          ? EventType
          : never]: MapEventTargetsByTargetName[Name][Method] extends
          | ((this: any, ev: infer EventArg) => any)
          | null
          ? Exclude<EventArg, string | undefined>
          : never;
      } extends infer O
      ? O
      : never;
  };
} extends infer O
  ? O
  : never;

type ExtractEventsByTargetName<Target extends AnyDOMEventTarget> = {
  [Name in keyof MapByEventTargetName]: MapByEventTargetName[Name] extends {
    target: Target;
  }
    ? MapByEventTargetName[Name]["events"]
    : never;
}[keyof MapByEventTargetName] extends infer O
  ? O
  : never;

export type AnyDOMEventType<Target extends AnyDOMEventTargetLoose> =
  Target extends AnyDOMEventTarget
    ? keyof ExtractEventsByTargetName<Target>
    : never;

export type AnyDOMEvent<
  Target extends AnyDOMEventTargetLoose,
  Type extends AnyDOMEventType<Target>,
> = Target extends AnyDOMEventTarget
  ? Type extends keyof ExtractEventsByTargetName<Target>
    ? NonNullable<ExtractEventsByTargetName<Target>[Type]>
    : never
  : never;

// type $ShouldBe_MouseEvent = AnyDOMEvent<HTMLDivElement, "click">;
// type $ShouldBe_Event = AnyDOMEvent<HTMLAudioElement, "waitingforkey">;

////////////////////////////// approach 2 (slower):

// type GetAnyDOMEventTargetName<Target extends AnyDOMEventTarget> = KeysOfValue<
//   MapEventTargetsByTargetName,
//   Target
// >;

// type AnyDOMEventTypeMapByTargetName = {
//   [Name in keyof MapEventTargetsByTargetName]: MapEventTargetsByTargetName[Name] extends {
//     addEventListener: Function;
//   }
//     ? Parameters<OverloadsToTuple<MapEventTargetsByTargetName[Name]["addEventListener"]>[0]>[0]
//     // ? MapEventTargetsByTargetName[Name]["addEventListener"] extends { (type: infer Type, ...args: any): any; } ? Type : never
//     : never;
// };

// export type AnyDOMEventType<Target extends AnyDOMEventTargetLoose> =
//   Target extends AnyDOMEventTarget
//     ? AnyDOMEventTypeMapByTargetName[GetAnyDOMEventTargetName<Target>]
//     : never;

// export type AnyDOMEvent<Target extends AnyDOMEventTargetLoose, Type extends AnyDOMEventType<Target>> =
//   Target extends AnyDOMEventTarget
//     ? Type extends keyof GetEventMapByEventTarget<Target>
//       ? GetEventMapByEventTarget<Target>[Type]
//       : never
//     : never;

// type GetEventMapByEventTarget<TTarget> =
//   TTarget extends Document
//     ? DocumentEventMap
//     : TTarget extends typeof window
//       ? WindowEventMap
//       : TTarget extends HTMLVideoElement
//         ? HTMLVideoElementEventMap
//           : TTarget extends HTMLMediaElement
//           ? HTMLMediaElementEventMap
//             : TTarget extends MathMLElement
//             ? MathMLElementEventMap
//               : TTarget extends SVGSVGElement
//               ? SVGSVGElementEventMap
//                 : TTarget extends SVGElement
//                 ? SVGElementEventMap
//                   : TTarget extends ShadowRoot
//                   ? ShadowRootEventMap
//                     : TTarget extends HTMLElement
//                       ? HTMLElementEventMap
//                       : TTarget extends Element
//                         ? ElementEventMap
//                         : never;

// type $$ShouldBe_MouseEvent = GetEventMapByEventTarget<Document>["click"];
// type $$ShouldBe_Event = GetEventMapByEventTarget<HTMLAudioElement>["waitingforkey"];


// DocumentEventMap
// HTMLBodyElementEventMap
// HTMLElementEventMap
// HTMLFrameSetElementEventMap
// HTMLMediaElementEventMap
// HTMLVideoElementEventMap
// MathMLElementEventMap
// SVGElementEventMap
// SVGSVGElementEventMap
// WindowEventMap
