import { type ObjectShape, object } from "@kuus/yup";
import { decode, encode, isUndefined } from "@koine/utils";

/**
 * Encode form
 *
 * Takes a record of yup validations and outputs a `yup` schema with encoded
 * names (antispam technique) and a record of the encoded/decoded input `name`s.
 *
 * We skip the names prefixed wth an underscore which are considered programmatic
 * form data not created by user input.
 *
 * FIXME: types https://github.com/jquense/yup/issues/1700
 */
export let encodeForm = <T extends ObjectShape = ObjectShape>(
  validationRules: T,
) => {
  const encoded = {} as Record<string, T[keyof T]>;
  const encodedNames = {} as Record<keyof T, string>;

  for (const name in validationRules) {
    if (!name.startsWith("_")) {
      const encodedName = encode(name);
      encoded[encodedName] = validationRules[name];
      encodedNames[name] = encodedName;
    }
  }

  // we need `.required()` to correctly infer the type @see
  // https://github.com/jquense/yup/issues/946
  const encodedSchema = object(encoded).required();

  return { encodedSchema, encodedNames };
};

/**
 * Decode form data
 *
 * This function is meant to be used inside an api endpoint to gather an encoded
 * form submit data and transform it to the decoded desired json data.
 *
 * Here too we skip encoding/decoding process for names prefixed wth an underscore
 * which are considered programmatic form data not created by user input.
 */
export let decodeForm = <
  ReturnAs extends Record<string, unknown> = Record<string, unknown>,
  FormData extends Record<string, unknown> = Record<string, unknown>,
>(
  formData: FormData,
) => {
  const json = {};

  for (const encodedName in formData) {
    const decodedName = decode(encodedName);
    // always add underscore prefixed names as they are treated as internal
    // private inputs outside of the honeypot system, normalise them here removing
    // the underscore prefix
    if (encodedName.startsWith("_")) {
      // @ts-expect-error nevermind
      json[encodedName.substring(1)] = formData[encodedName];
    }
    // if the decoded `name` is empty and the encoded `name` is defined honeypot passed
    else if (
      !isUndefined(formData[encodedName]) &&
      formData[decodedName] === ""
    ) {
      // @ts-expect-error nevermind
      json[decodedName] = formData[encodedName];
    }
  }
  // console.log(formData, decoded, json);
  return json as ReturnAs;
};
