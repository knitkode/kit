// type-fest start
/**
 * @borrows type-fest@v5.1.0
 *
 * These types should not be documented by using [`excludeExternals` TypeDoc flag](https://typedoc.org/options/input/#excludeexternals)
 */
export type {
  AbstractClass,
  AbstractConstructor,
  AllExtend,
  AllExtendOptions,
  AllUnionFields,
  Alphanumeric,
  And,
  Arrayable,
  ArrayIndices,
  ArraySlice,
  ArraySplice,
  ArrayTail,
  ArrayValues,
  Asyncify,
  AsyncReturnType,
  CamelCase,
  CamelCasedProperties,
  CamelCasedPropertiesDeep,
  CamelCaseOptions,
  Class,
  ConditionalExcept,
  ConditionalKeys,
  ConditionalPick,
  ConditionalPickDeep,
  ConditionalPickDeepOptions,
  ConditionalSimplify,
  ConditionalSimplifyDeep,
  Constructor,
  DelimiterCase,
  DelimiterCasedProperties,
  DelimiterCasedPropertiesDeep,
  DigitCharacter,
  DistributedOmit,
  DistributedPick,
  EmptyObject,
  Entries,
  Entry,
  Exact,
  Except,
  ExceptOptions,
  ExcludeRestElement,
  ExcludeStrict,
  ExtendsStrict,
  ExtractRestElement,
  ExtractStrict,
  FindGlobalInstanceType,
  FindGlobalType,
  Finite,
  FixedLengthArray,
  Float,
  Get,
  GetOptions,
  GetTagMetadata,
  GlobalThis,
  GreaterThan,
  GreaterThanOrEqual,
  HasOptionalKeys,
  HasReadonlyKeys,
  HasRequiredKeys,
  HasWritableKeys,
  If,
  IfAny,
  IfEmptyObject,
  IfNever,
  IfNull,
  IfUnknown,
  Includes,
  IntClosedRange,
  Integer,
  IntRange,
  InvariantOf,
  IsAny,
  IsBooleanLiteral,
  IsEmptyObject,
  IsEqual,
  IsFloat,
  IsInteger,
  IsLiteral,
  IsLowercase,
  IsNegative,
  IsNever,
  IsNull,
  IsNullable,
  IsNumericLiteral,
  IsOptional,
  IsOptionalKeyOf,
  IsReadonlyKeyOf,
  IsRequiredKeyOf,
  IsStringLiteral,
  IsSymbolLiteral,
  IsTuple,
  IsTupleOptions,
  IsUndefined,
  IsUnion,
  IsUnknown,
  IsUppercase,
  IsWritableKeyOf,
  IterableElement,
  Join,
  JsonArray,
  Jsonifiable,
  Jsonify,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  KebabCase,
  KebabCasedProperties,
  KebabCasedPropertiesDeep,
  KeyAsString,
  KeysOfUnion,
  LastArrayElement,
  LessThan,
  LessThanOrEqual,
  LiteralToPrimitive,
  LiteralToPrimitiveDeep,
  LiteralUnion,
  LowercaseLetter,
  Merge,
  MergeDeep,
  MergeDeepOptions,
  MergeExclusive,
  MultidimensionalArray,
  MultidimensionalReadonlyArray,
  Negative,
  NegativeFloat,
  NegativeInfinity,
  NegativeInteger,
  NonEmptyObject,
  NonEmptyString,
  NonEmptyTuple,
  NonNegative,
  NonNegativeInteger,
  OmitDeep,
  OmitIndexSignature,
  Opaque,
  OptionalKeysOf,
  Or,
  OverrideProperties,
  PackageJson,
  PartialDeep,
  PartialDeepOptions,
  PartialOnUndefinedDeep,
  PartialOnUndefinedDeepOptions,
  PascalCase,
  PascalCasedProperties,
  PascalCasedPropertiesDeep,
  Paths,
  PathsOptions,
  PickDeep,
  PickIndexSignature,
  PositiveInfinity,
  Primitive,
  Promisable,
  ReadonlyDeep,
  ReadonlyKeysOf,
  ReadonlyTuple,
  RemovePrefix,
  RemovePrefixOptions,
  Replace,
  ReplaceOptions,
  RequireAllOrNone,
  RequireAtLeastOne,
  RequiredDeep,
  RequiredKeysOf,
  RequireExactlyOne,
  RequireOneOrNone,
  Schema,
  SchemaOptions,
  ScreamingSnakeCase,
  SetFieldType,
  SetFieldTypeOptions,
  SetNonNullable,
  SetNonNullableDeep,
  SetOptional,
  SetParameterType,
  SetReadonly,
  SetRequired,
  SetRequiredDeep,
  SetReturnType,
  SharedUnionFields,
  SharedUnionFieldsDeep,
  SharedUnionFieldsDeepOptions,
  Simplify,
  SimplifyDeep,
  SingleKeyObject,
  SnakeCase,
  SnakeCasedProperties,
  SnakeCasedPropertiesDeep,
  Split,
  SplitOnRestElement,
  SplitOptions,
  Spread,
  Stringified,
  StringRepeat,
  StringSlice,
  StructuredCloneable,
  Subtract,
  Sum,
  Tagged,
  TaggedUnion,
  Trim,
  TsConfigJson,
  TupleOf,
  TupleToObject,
  TupleToUnion,
  TypedArray,
  UndefinedOnPartialDeep,
  UnionToIntersection,
  UnionToTuple,
  UnknownArray,
  UnknownMap,
  UnknownRecord,
  UnknownSet,
  UnwrapOpaque,
  UnwrapTagged,
  UppercaseLetter,
  ValueOf,
  Words,
  WordsOptions,
  Writable,
  WritableDeep,
  WritableKeysOf,
  Xor,
} from "type-fest";
export { type AccentsSet, accentsSets } from "./accentsSets";
export { addOrReplaceAtIdx } from "./addOrReplaceAtIdx";
export { areEqual } from "./areEqual";
export { arrayFilterFalsy } from "./arrayFilterFalsy";
export { arrayFindLastIndex } from "./arrayFindLastIndex";
export { type ArrayOfAll, arrayOfAll } from "./arrayOfAll";
export { arraySum } from "./arraySum";
export { arrayToLookup } from "./arrayToLookup";
export { arrayUniqueByProperties } from "./arrayUniqueByProperties";
export { buildUrlQueryString } from "./buildUrlQueryString";
export { capitalize } from "./capitalize";
export { changeCaseCamel } from "./changeCaseCamel";
export { changeCaseConstant } from "./changeCaseConstant";
export { changeCaseDot } from "./changeCaseDot";
export { changeCaseEnvVarName } from "./changeCaseEnvVarName";
export { changeCaseKebab } from "./changeCaseKebab";
export { changeCasePascal } from "./changeCasePascal";
export { changeCasePath } from "./changeCasePath";
export { changeCaseSentence } from "./changeCaseSentence";
export { changeCaseSnake } from "./changeCaseSnake";
export { changeCaseTrain } from "./changeCaseTrain";
export { chunkByChunks } from "./chunkByChunks";
export { chunkBySize } from "./chunkBySize";
export { clamp } from "./clamp";
export { type ClsxClassValue, clsx } from "./clsx";
export { convertRange } from "./convertRange";
export {
  type CookieAttributesClient,
  type CookieAttributesServer,
} from "./cookie";
export { createConsole } from "./createConsole";
export { createPalette } from "./createPalette";
export { Defer, type Deferred } from "./Defer";
export { debounce } from "./debounce";
export {
  type DebouncedFunction,
  type DebounceOptions,
  debouncePromise,
} from "./debouncePromise";
export { debounceRaf } from "./debounceRaf";
export { decode } from "./decode";
export { Emitter } from "./Emitter";
export { encode } from "./encode";
export { ensureInt } from "./ensureInt";
// export {} from "./env"
export { errorToString } from "./errorToString";
export { escapeRegExp } from "./escapeRegExp";
export { findDuplicatedIndexes } from "./findDuplicatedIndexes";
export { forin } from "./forin";
export { gbToBytes } from "./gbToBytes";
export { getEmptyArray } from "./getEmptyArray";
export { getKeys } from "./getKeys";
export {
  type GetMediaQueryWidthResolversBreakpoints,
  getMediaQueryWidthResolvers,
} from "./getMediaQueryWidthResolvers";
export { getMediaQueryWidthTailwindScreens } from "./getMediaQueryWidthTailwindScreens";
export { getNonce } from "./getNonce";
export { getParamAmong } from "./getParamAmong";
export { getParamAsInt } from "./getParamAsInt";
export { getParamAsString } from "./getParamAsString";
export {
  type AnyAsyncFunction,
  type AnyClass,
  type AnyFunction,
  getType,
  type PlainObject,
  type TypeGuard,
} from "./getType";
export { getUrlHashParams } from "./getUrlHashParams";
export { getUrlHashPathname } from "./getUrlHashPathname";
export { getUrlPathnameParts } from "./getUrlPathnameParts";
export { getUrlQueryParams } from "./getUrlQueryParams";
export { hashAny } from "./hashAny";
export { imgEmptyPixel } from "./imgEmptyPixel";
export { isAbsoluteUrl } from "./isAbsoluteUrl";
export { isAnyObject } from "./isAnyObject";
export { isArray } from "./isArray";
export { isBlob } from "./isBlob";
export { isBoolean } from "./isBoolean";
export { isBrowser } from "./isBrowser";
export { isBrowserNow } from "./isBrowserNow";
export { isDate } from "./isDate";
export { isEmptyArray } from "./isEmptyArray";
export { isEmptyObject } from "./isEmptyObject";
export { isEmptyString } from "./isEmptyString";
export { isError } from "./isError";
export { isExternalUrl } from "./isExternalUrl";
export { isFile } from "./isFile";
export { isFloat } from "./isFloat";
export { isFormData } from "./isFormData";
export { isFullArray } from "./isFullArray";
export { isFullObject } from "./isFullObject";
export { isFullString } from "./isFullString";
export { isFunction } from "./isFunction";
export { isInt } from "./isInt";
export { isMap } from "./isMap";
export { isNaNValue } from "./isNaNValue";
export { isNegativeNumber } from "./isNegativeNumber";
export { isNull } from "./isNull";
export { isNullOrUndefined } from "./isNullOrUndefined";
export { isNumber } from "./isNumber";
export { isNumericLiteral } from "./isNumericLiteral";
export { isObject } from "./isObject";
export { isObjectLike } from "./isObjectLike";
export { isObjectStringKeyed } from "./isObjectStringKeyed";
export { isOneOf } from "./isOneOf";
export { isPlainObject } from "./isPlainObject";
export { isPositiveNumber } from "./isPositiveNumber";
export { isPrimitive } from "./isPrimitive";
export { isPromise } from "./isPromise";
export { isRegExp } from "./isRegExp";
export { isServer } from "./isServer";
export { isServerNow } from "./isServerNow";
export { isSet } from "./isSet";
export { isString } from "./isString";
export { isSymbol } from "./isSymbol";
export { isType } from "./isType";
export { isUndefined } from "./isUndefined";
export { isWeakMap } from "./isWeakMap";
export { isWeakSet } from "./isWeakSet";
export { kbToBytes } from "./kbToBytes";
export { type AnyQueryParams } from "./location";
export { lowercase } from "./lowercase";
export { mapListBy } from "./mapListBy";
export { matchSorter } from "./matchSorter";
export { mbToBytes } from "./mbToBytes";
export { mergeUrlQueryParams } from "./mergeUrlQueryParams";
export { moveSortableArrayItemByKey } from "./moveSortableArrayItemByKey";
export { noop } from "./noop";
export { normaliseUrl } from "./normaliseUrl";
export { normaliseUrlPathname } from "./normaliseUrlPathname";
export { objectEntries } from "./objectEntries";
export { objectFlat } from "./objectFlat";
export { objectFlip } from "./objectFlip";
export { objectKeys } from "./objectKeys";
export { objectKeysMap } from "./objectKeysMap";
export { objectMerge } from "./objectMerge";
export { objectMergeArrayFn } from "./objectMergeArrayFn";
export { type ObjectMerge, objectMergeCreate } from "./objectMergeCreate";
export { objectMergeFn } from "./objectMergeFn";
export {
  type ObjectMergeWithDefaults,
  objectMergeWithDefaults,
} from "./objectMergeWithDefaults";
export { objectOmit } from "./objectOmit";
export { objectPick } from "./objectPick";
export { objectSort } from "./objectSort";
export { objectSortByKeysMatching } from "./objectSortByKeysMatching";
export { objectSwap } from "./objectSwap";
export { objectToArray } from "./objectToArray";
export { parseCookie } from "./parseCookie";
export { parseURL } from "./parseURL";
export { promiseAllSorted } from "./promiseAllSorted";
export { quaranteneProps } from "./quaranteneProps";
export { randomInt } from "./randomInt";
export { randomKey } from "./randomKey";
export { readCookie } from "./readCookie";
export { removeAccents } from "./removeAccents";
export { removeCookie } from "./removeCookie";
// export {} from "./removeDuplicates";
export { removeDuplicatesByKey } from "./removeDuplicatesByKey";
export { removeDuplicatesComparing } from "./removeDuplicatesComparing";
export { removeIndexesFromArray } from "./removeIndexesFromArray";
export { removeTrailingSlash } from "./removeTrailingSlash";
export { removeUrlQueryParams } from "./removeUrlQueryParams";
export { round } from "./round";
export { roundTo } from "./roundTo";
export { serializeCookie } from "./serializeCookie";
export { setCookie } from "./setCookie";
export { shuffle } from "./shuffle";
export { slugify } from "./slugify";
export { split } from "./split";
export { splitReverse } from "./splitReverse";
export { throttle } from "./throttle";
export { titleCase } from "./titleCase";
export { toNumber } from "./toNumber";
export { toRgba } from "./toRgba";
export { transformToUrlPathname } from "./transformToUrlPathname";
export { truncate } from "./truncate";
export { tryUntil } from "./tryUntil";
export type {
  AnythingFalsy,
  ExactlyAs,
  FlatObjectFirstLevel,
  KeysOfValue,
  KeysStartsWith,
  KeysTailsStartsWith,
  NonNullableObjectDeep,
  NullableObjectDeep,
  OmitNever,
  OverloadsToTuple,
  PickStartsWith,
  PickStartsWithTails,
  RequiredNonNullableObjectDeep,
  RequiredObjectDeep,
  Reverse,
  TestIsEqualUnion,
  TestType,
} from "./types";
export { uid } from "./uid";
export { updateLinkParams } from "./updateLinkParams";
export { updateUrlQueryParams } from "./updateUrlQueryParams";
export { uppercase } from "./uppercase";
export {
  type UrlSearchParamSerializer,
  urlSearchParamsSerializer,
} from "./urlSearchParamsSerializer";
export { uuid } from "./uuid";
export { uuidNumeric } from "./uuidNumeric";
export { wait } from "./wait";
