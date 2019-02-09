0.3.0 / 2019-02-09
==================
 * feat: add `addAsync()` as an alias for `decorateApp()` and `decorateRouter()` #4 #1 [SapienTech](https://github.com/SapienTech)
 * fix: avoid error when using non-async middleware with `useAsync()`, etc. #7 #6 [0xCAFEADD1C7](https://github.com/0xCAFEADD1C7)

0.2.0 / 2019-01-14
==================
 * fix: handle multiple handlers in `getAsync()`, `useAsync()`, etc #5

0.1.4 / 2018-09-12
==================
 * fix: discontinue middleware chain if middleware calls `res.send()`

0.1.3 / 2018-09-02
==================
 * fix: add missing deleteAsync() and patchAsync()
