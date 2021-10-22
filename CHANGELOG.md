0.9.0 / 2021-10-22
==================
 * fix(index.d.ts): add workaround for TS linters that enforce no-misused-promises #30 #28

0.8.0 / 2021-07-13
==================
 * fix: avoid automatically calling `next()` if middleware doesn't return a promise #27 [letalumil](https://github.com/letalumil)

0.7.2 / 2021-02-15
==================
 * fix: fix race condition #23 [EvanSmith-git](https://github.com/EvanSmith-git)

0.7.1 / 2021-02-01
==================
 * refactor: DRY up code #21 [EvanSmith-git](https://github.com/EvanSmith-git)

0.7.0 / 2021-01-13
==================
 * feat: paramAsync() wrapped function #17 [saltire](https://github.com/saltire)

0.6.3 / 2020-10-19
==================
 * fix: add missing export #18

0.6.2 / 2020-10-19
==================
 * fix: add `wrap()` to TypeScript type definitions #18

0.6.1 / 2020-05-31
==================
 * fix: add `Router` export to typescript definitions #16 [saltire](https://github.com/saltire)

0.6.0 / 2020-04-23
==================
 * feat: export `Router` function that returns a new async-friendly Router #13

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
