---
"@knitkode/react": patch
---

`decodeForm` only reads the encoded input names and ignores the plain (honeypot) ones explicitly, instead of relying on `decode` mangling them. It keeps working with the `decode` of this release, which leaves non encoded text as it is.
