import { number, string } from "@kuus/yup";
import { decodeForm, encodeForm } from "./forms";

/** Each character is encoded as its 3 digits zero padded char code */
const EMAIL = "101109097105108"; // "email"
const NAME = "110097109101"; // "name"
const AGE = "097103101"; // "age"

describe("forms", () => {
  describe("encodeForm", () => {
    it("maps each input name to its encoded name", () => {
      const { encodedNames } = encodeForm({
        email: string().required(),
        name: string(),
      });

      expect(encodedNames).toEqual({ email: EMAIL, name: NAME });
    });

    it("skips the underscore prefixed names", () => {
      const { encodedNames, encodedSchema } = encodeForm({
        email: string(),
        _token: string().required(),
      });

      expect(encodedNames).toEqual({ email: EMAIL });
      expect(Object.keys(encodedSchema.fields)).toEqual([EMAIL]);
    });

    it("returns a schema validating the encoded names with the given rules", () => {
      const { encodedSchema } = encodeForm({
        email: string().email().required(),
        age: number().min(18),
      });

      expect(encodedSchema.isValidSync({ [EMAIL]: "a@b.co", [AGE]: 20 })).toBe(
        true,
      );
      expect(encodedSchema.isValidSync({ [EMAIL]: "a@b.co" })).toBe(true);
      expect(encodedSchema.isValidSync({ [EMAIL]: "not-an-email" })).toBe(
        false,
      );
      expect(encodedSchema.isValidSync({ [EMAIL]: "a@b.co", [AGE]: 10 })).toBe(
        false,
      );
      expect(encodedSchema.isValidSync({ [AGE]: 20 })).toBe(false);
    });

    it("does not validate the decoded names", () => {
      const { encodedSchema } = encodeForm({ email: string().required() });

      expect(encodedSchema.isValidSync({ email: "a@b.co" })).toBe(false);
    });
  });

  describe("decodeForm", () => {
    it("decodes the encoded names when the honeypot inputs are empty", () => {
      const data = decodeForm({
        [EMAIL]: "a@b.co",
        email: "",
        [NAME]: "Ada",
        name: "",
      });

      expect(data).toEqual({ email: "a@b.co", name: "Ada" });
    });

    it("drops the values whose honeypot input has been filled", () => {
      const data = decodeForm({
        [EMAIL]: "a@b.co",
        email: "bot@spam.com",
        [NAME]: "Ada",
        name: "",
      });

      expect(data).toEqual({ name: "Ada" });
    });

    it("drops the values whose honeypot input is missing", () => {
      const data = decodeForm({ [EMAIL]: "a@b.co" });

      expect(data).toEqual({});
    });

    it("never outputs the honeypot inputs", () => {
      const data = decodeForm({ email: "", name: "bot" });

      expect(data).toEqual({});
    });

    it("keeps the underscore prefixed values removing the prefix", () => {
      const data = decodeForm({
        _token: "csrf",
        _locale: "en",
        [EMAIL]: "a@b.co",
        email: "",
      });

      expect(data).toEqual({ token: "csrf", locale: "en", email: "a@b.co" });
    });

    it("keeps non string values", () => {
      const data = decodeForm<{ age: number; terms: boolean }>({
        [AGE]: 42,
        age: "",
        _terms: true,
      });

      expect(data).toEqual({ age: 42, terms: true });
    });

    it("round-trips the names encoded by encodeForm", () => {
      const { encodedNames } = encodeForm({
        email: string(),
        name: string(),
      });
      const submitted = {
        [encodedNames.email]: "a@b.co",
        email: "",
        [encodedNames.name]: "Ada",
        name: "",
      };

      expect(decodeForm(submitted)).toEqual({ email: "a@b.co", name: "Ada" });
    });
  });
});
