import urlSearchParamsSerializer, {
  UrlSearchParamSerializer,
} from "./urlSearchParamsSerializer";

describe("urlSearchParamsSerializer", () => {
  const createSerializableParam = <NameInUrl extends string, DefaultValue>(
    nameInUrl: NameInUrl,
    defaultValue: DefaultValue,
    serializeFromUrlSearchParamValue: (value: string) => DefaultValue,
    serializeToUrlSearchParamValue: (value: DefaultValue) => string
  ): UrlSearchParamSerializer<NameInUrl, DefaultValue> => [
    nameInUrl,
    defaultValue,
    serializeFromUrlSearchParamValue,
    serializeToUrlSearchParamValue,
  ];

  const serializers = {
    param1: createSerializableParam("paramOne", "default1", (v) => v, (v) => v),
    param2: createSerializableParam("paramTwo", 0, (v) => parseInt(v, 10), (v) => v.toString()),
    param3: createSerializableParam("paramThree", true, (v) => v === "true", (v) => (v ? "true" : "false")),
  };

  describe("Basic functionality", () => {
    it("should return the correct defaults for each serializer", () => {
      const { defaults } = urlSearchParamsSerializer(serializers);
      expect(defaults).toEqual({
        param1: "default1",
        param2: 0,
        param3: true,
      });
    });

    it("should map keys to URL param names without prefix", () => {
      const { toNames } = urlSearchParamsSerializer(serializers);
      expect(toNames).toEqual({
        param1: "paramOne",
        param2: "paramTwo",
        param3: "paramThree",
      });
    });

    it("should correctly apply prefix to URL param names", () => {
      const { toNames } = urlSearchParamsSerializer(serializers, "testPrefix");
      expect(toNames).toEqual({
        param1: "testPrefix_paramOne",
        param2: "testPrefix_paramTwo",
        param3: "testPrefix_paramThree",
      });
    });
  });

  describe("Serialization and Deserialization", () => {
    it("should deserialize from URLSearchParams correctly without prefix", () => {
      const { fromUrl } = urlSearchParamsSerializer(serializers);
      const searchParams = new URLSearchParams({
        paramOne: "value1",
        paramTwo: "42",
        paramThree: "false",
      });
      const result = fromUrl(searchParams);
      expect(result).toEqual({
        param1: "value1",
        param2: 42,
        param3: false,
      });
    });

    it("should deserialize from URLSearchParams correctly with prefix", () => {
      const { fromUrl } = urlSearchParamsSerializer(serializers, "testPrefix");
      const searchParams = new URLSearchParams({
        testPrefix_paramOne: "value1",
        testPrefix_paramTwo: "42",
        testPrefix_paramThree: "false",
      });
      const result = fromUrl(searchParams);
      expect(result).toEqual({
        param1: "value1",
        param2: 42,
        param3: false,
      });
    });

    it("should use default values when URL params are missing", () => {
      const { fromUrl } = urlSearchParamsSerializer(serializers);
      const searchParams = new URLSearchParams();
      const result = fromUrl(searchParams);
      expect(result).toEqual({
        param1: "default1",
        param2: 0,
        param3: true,
      });
    });

    it("should serialize data to URL search params correctly without prefix", () => {
      const { toUrl } = urlSearchParamsSerializer(serializers);
      const result = toUrl({
        param1: "custom1",
        param2: 100,
        param3: false,
      });
      expect(result).toEqual({
        paramOne: "custom1",
        paramTwo: "100",
        paramThree: "false",
      });
    });

    it("should serialize data to URL search params correctly with prefix", () => {
      const { toUrl } = urlSearchParamsSerializer(serializers, "testPrefix");
      const result = toUrl({
        param1: "custom1",
        param2: 100,
        param3: false,
      });
      expect(result).toEqual({
        testPrefix_paramOne: "custom1",
        testPrefix_paramTwo: "100",
        testPrefix_paramThree: "false",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing or undefined values by using defaults", () => {
      const { toUrl } = urlSearchParamsSerializer(serializers);
      const result = toUrl({});
      expect(result).toEqual({
        paramOne: "default1",
        paramTwo: "0",
        paramThree: "true",
      });
    });

    it("should handle empty string values appropriately", () => {
      const { fromUrl } = urlSearchParamsSerializer(serializers);
      const searchParams = new URLSearchParams({
        paramOne: "",
        paramTwo: "",
        paramThree: "",
      });
      const result = fromUrl(searchParams);
      expect(result).toEqual({
        param1: "default1",
        param2: 0,
        param3: true,
      });
    });

    it("should handle prefix collision correctly", () => {
      const { toUrl } = urlSearchParamsSerializer(serializers, "prefix");
      const result = toUrl({
        param1: "value1",
        param2: 200,
      });
      expect(result).toEqual({
        prefix_paramOne: "value1",
        prefix_paramTwo: "200",
        prefix_paramThree: "true",
      });
    });
  });
});
// const curatorAspects = urlSearchParamsSerializer({
//   screen: ["s" as const, "products" as CuratorScreen, (v) => v, (v) => v],
//   productId: ["pid" as const, null as null | string, (v) => v, (v) => v],
//   editId: ["eid" as const, null as null | number, ensureInt, (v) => v],
//   /** API:NOTE: we use `0` to flag unsupported content types */
//   contentTypeApprovables: [
//     "cta" as const,
//     null as null | Curation.ContentTypeApprovables | 0,
//     (v) => v,
//     (v) => v,
//   ],
//   /** API:NOTE: we use `0` to flag unsupported content types */
//   contentTypeRevisions: [
//     "ctr" as const,
//     null as null | Curation.ContentTypeRevisions | 0,
//     (v) => v,
//     (v) => v,
//   ],
// });