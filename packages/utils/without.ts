// TODO: finish this up, this is not exported yet
// ready to copy-paste to https://www.typescriptlang.org/play

// type EmptyObject = Record<string, never>;
// type EmptyArray = never[];
// type EmptyString = "";

// type WithoutEmptyObject<T> = T extends EmptyObject ? never : T;
// type WithoutEmptyArray<T> = T extends EmptyArray ? never : T;
// type WithoutEmptyString<T> = T extends EmptyString ? never : T;

// type WithoutEmpty<T> = T extends EmptyObject | EmptyArray | EmptyString | null | undefined ? never : T;

// function withoutEmptyObject<T>(arg: WithoutEmptyObject<T>) {
//   return arg;
// }

// function withoutEmptyArray<T>(arg: WithoutEmptyArray<T>) {
//   return arg;
// }

// function withoutEmptyString<T>(arg: WithoutEmptyString<T>) {
//   return arg;
// }

// function withoutEmpty<T>(arg: WithoutEmpty<T>) {
//   return arg;
// }

// // @ts-expect-error
// const o1 = withoutEmptyObject({});
// //   ^?
// const o2 = withoutEmptyObject({ accepted: 1 });

// // @ts-expect-error
// const a1 = withoutEmptyArray([]);
// //   ^?
// const a2 = withoutEmptyArray(["accepted"]);
// //   ^?
// const a3 = withoutEmptyArray("accepted");
// //   ^?
// const a4 = withoutEmptyArray("accepted" === "accepted");
// //   ^?

// // @ts-expect-error
// const s1 = withoutEmptyString("");
// //   ^?
// const s2 = withoutEmptyString("accepted");
// //   ^?

// // @ts-expect-error
// const w1 = withoutEmpty("");
// //   ^?
// // @ts-expect-error
// const w2 = withoutEmpty(undefined);
// //   ^?
// // @ts-expect-error
// const w3 = withoutEmpty(null);
// //   ^?
// // @ts-expect-error
// const w4 = withoutEmpty({});
// //   ^?
// // @ts-expect-error
// const w5 = withoutEmpty([]);
// //   ^?
