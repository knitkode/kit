import { objectPick } from "./objectPick";

describe("objectPick", () => {
  const testObject = {
    id: 1,
    name: "Alice",
    age: 30,
    email: "alice@example.com",
  };

  test("should pick the specified keys from the object", () => {
    const picked = objectPick(testObject, ["id", "name"]);
    expect(picked).toEqual({
      id: 1,
      name: "Alice",
    });
  });

  test("should return an empty object if no keys are specified", () => {
    const picked = objectPick(testObject, []);
    expect(picked).toEqual({});
  });

  test("should handle picking a single key", () => {
    const picked = objectPick(testObject, ["age"]);
    expect(picked).toEqual({
      age: 30,
    });
  });

  test("should ignore keys that do not exist in the object", () => {
    const picked = objectPick(testObject, ["id", "nonExistentKey" as "age"]);
    expect(picked).toEqual({
      id: 1,
    });
  });

  test("should return all keys if all keys are specified", () => {
    const picked = objectPick(testObject, ["id", "name", "age", "email"]);
    expect(picked).toEqual(testObject);
  });

  test("should handle nested objects correctly", () => {
    const nestedObject = {
      id: 1,
      profile: {
        name: "Alice",
        age: 30,
      },
    };
    const picked = objectPick(nestedObject, ["profile"]);
    expect(picked).toEqual({
      profile: {
        name: "Alice",
        age: 30,
      },
    });
  });

  test("should preserve types of the picked properties", () => {
    const picked = objectPick(testObject, ["id", "email"]);
    expect(picked.id).toBe(1);
    expect(typeof picked.email).toBe("string");
  });

  test("should work with an object that has optional properties", () => {
    interface User {
      id: number;
      name?: string;
      age?: number;
    }

    const user: User = {
      id: 2,
      age: 25,
    };

    const picked = objectPick(user, ["id", "name"]);
    expect(picked).toEqual({
      id: 2,
    });
  });
});
