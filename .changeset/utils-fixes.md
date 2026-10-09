---
"@knitkode/utils": patch
---

Fix several helpers:

- `isExternalUrl` compares against the given `currentUrl` (it used to always fall back to `location.href`) and works outside the browser. It only matches URLs starting with `http(s)://`, compares hosts case-insensitively and supports hosts without a dot such as `localhost`.
- `isServerNow` and `isBrowserNow` no longer throw where `window` is not declared, like in Node.js.
- `round` rounds when `decimals` is falsy (`round(1.7)` is `2`, it used to truncate to `1`). With `trailingZeroes` it returns the formatted string (`round(1.2, 2, true)` is `"1.20"`), the only way to keep the zeroes.
- `ensureInt` truncates numbers like it already did with strings (`ensureInt(1.9)` is `1`, it used to round to `2`). Non numeric input gives `NaN`.
- `slugify` replaces underscores and the other punctuation with the separator (`slugify("foo_bar")` is `"foo-bar"`).
- `removeAccents` keeps the case of the replaced letters (`"École"` gives `"Ecole"`, it used to give `"ecole"`).
- `titleCase` capitalises words starting with any letter (`"élan vital"` gives `"Élan Vital"`).
- `isFloat(Infinity)` is `false`.
- The `Split` type matches the runtime for empty strings and trailing delimiters (`split("a,", ",")` is typed `["a", ""]`).
- `encode` encodes line breaks and characters from code point 1000 up (`€`, CJK, emoji), which it used to corrupt, and `decode` reverses them. The output of the other characters is unchanged, and `decode` still reads values encoded by previous versions.
