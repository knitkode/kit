import { getDocumentHeight } from "./getDocumentHeight";

describe("getDocumentHeight", () => {
  const sources = [
    ["body", "scrollHeight"],
    ["documentElement", "scrollHeight"],
    ["body", "offsetHeight"],
    ["documentElement", "offsetHeight"],
    ["body", "clientHeight"],
    ["documentElement", "clientHeight"],
  ] as const;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each(sources)(
    "returns %s.%s when it is the largest measurement",
    (tallestNode, tallestProp) => {
      for (const [node, prop] of sources) {
        const isTallest = node === tallestNode && prop === tallestProp;
        vi.spyOn(document[node], prop, "get").mockReturnValue(
          isTallest ? 2400 : 800,
        );
      }

      expect(getDocumentHeight()).toBe(2400);
    },
  );

  test("returns 0 when nothing has a height", () => {
    for (const [node, prop] of sources) {
      vi.spyOn(document[node], prop, "get").mockReturnValue(0);
    }

    expect(getDocumentHeight()).toBe(0);
  });
});
