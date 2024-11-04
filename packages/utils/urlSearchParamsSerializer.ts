// import { objectSwap } from "./objectSwap";

/**
 * @param {string} searchParamName
 * @param {any} defaultValue
 * @param {(valueFromUrl: string) => DefaultValue} serializeFromUrlSearchParamValue
 * @param {(valueToUrl: DefaultValue) => string}  serializeToUrlSearchParamValue
 */
export type UrlSearchParamSerializer<NameInUrl extends string, DefaultValue> = [
  NameInUrl,
  DefaultValue,
  (valueFromUrl: string) => DefaultValue,
  (valueToUrl: DefaultValue) => string,
];

export const urlSearchParamsSerializer = <
  // `any` here allows for correct inferring of the generic `DefaultValue`
  Serializers extends Record<string, UrlSearchParamSerializer<any, any>>,
  Prefix extends string | undefined,
>(
  serializers: Serializers,
  prefix?: Prefix,
) => {
  const defaults = Object.keys(serializers).reduce(
    (out, key) => {
      // @ts-expect-error nevermind for now
      out[key] = serializers[key][1];
      return out;
    },
    {} as { [Key in keyof Serializers]: Serializers[Key][1] },
  );

  const getParamKey = (v: string) => (prefix ? `${prefix}_${v}` : v);

  const keysToSearchParamsNames = Object.keys(serializers).reduce(
    (out, key) => {
      // @ts-expect-error nevermind for now
      out[key] = getParamKey(serializers[key][0]);
      return out;
    },
    {} as {
      [Key in keyof Serializers]: Prefix extends undefined
        ? Serializers[Key][0]
        : `${Prefix}_${Serializers[Key][0]}`;
    },
    // {} as Prefix extends undefined ? {
    //   [Key in keyof Serializers]: Serializers[Key][0];
    // } : {
    //   [Key in keyof Serializers]: `${Prefix}_${Serializers[Key][0]}`;
    // },
  );

  // const searchParamsNamesToKeys = objectSwap(keysToSearchParamsNames);

  return {
    /**
     * Array of the search params `names` as they appear in the URL
     */
    names: Object.values(
      keysToSearchParamsNames,
    ) as (typeof keysToSearchParamsNames)[keyof typeof keysToSearchParamsNames][],
    /**
     * Map of the search params `state` name to the `name` as it appears in the URL
     */
    toNames: keysToSearchParamsNames,
    /**
     * Default state of the search params value
     */
    defaults,
    /**
     * Deserialize search params state from the URL ones
     */
    fromUrl: (searchParams: URLSearchParams) => {
      const out: { [Key in keyof Serializers]?: Serializers[Key][1] } = {};
      for (const key in serializers) {
        const [paramKey, defaultValue, fromUrl] = serializers[key];
        const value = searchParams.get(getParamKey(paramKey));
        out[key] = value ? fromUrl(value) : defaultValue;
      }

      // remove the `?` optional as we fallback to the provided default value
      return out as { [Key in keyof Serializers]: Serializers[Key][1] };
    },
    /**
     * Serialize state to URL search params
     */
    toUrl: (data: {
      [Key in keyof Serializers]?: Serializers[Key][1];
    }) => {
      const out: Record<string, string> = {};
      for (const key in defaults) {
        const [paramKey, defaultValue, , toUrl] = serializers[key];
        const value = toUrl(data[key] ?? defaultValue);
        if (value) {
          out[getParamKey(paramKey)] = value;
        }
      }

      return out;
    },
  };
};

export default urlSearchParamsSerializer;
