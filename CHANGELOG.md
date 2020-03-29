0.5.1 / 2020-03-29
==================
 * fix: add `decorateRouter` and `decorateApp` to TypeScript types #15 [zone117x](https://github.com/zone117x)

0.5.0 / 2020-03-19
==================
 * feat: add TypeScript types #11 [brandon-leapyear](https://github.com/brandon-leapyear)

0.4.0 / 2019-12-29
==================
 * feat: add `routeAsync()` to support chaining syntax with `getAsync()`, etc #9

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
