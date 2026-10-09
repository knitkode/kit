---
"@knitkode/api": patch
---

Fix the requests URL, which got a double slash with an endpoint starting with `/` or a base URL ending with one, and let the headers passed to a request override the client ones (the client headers used to win).
