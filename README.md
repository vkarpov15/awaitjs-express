# @awaitjs/express

Write Express middleware and route handlers using async/await

# Usage

```javascript
const { addAsync } = require('@awaitjs/express');

// Or, if you want to use `wrap()`
const { wrap } = require('@awaitjs/express');
```


# API

## addAsync()


The `addAsync()` function is the preferred way to add async/await
support to your Express app. This function adds several helper functions
to your Express app.


### It adds `useAsync()`, `getAsync()`, etc. to your Express app


The `addAsync()` function adds `useAsync()`, `deleteAsync()`, `getAsync()`,
`headAsync()`, `paramAsync()`, `patchAsync()`, `postAsync()`, and `putAsync()`.


```javascript
const express = require('express');
const app = addAsync(express());

// `useAsync()` is like `app.use()`, but supports async functions
app.useAsync(async function(req, res, next) {
  await new Promise(resolve => setTimeout(resolve, 50));
});

// `getAsync()` is like `app.get()`, but supports async functions
app.getAsync('*', async function(req, res, next) {
  throw new Error('Oops!');
});

// Because of `getAsync()`, this error handling middleware will run.
// `addAsync()` also enables async error handling middleware.
app.use(function(error, req, res, next) {
  res.send(error.message);
});

const server = await app.listen(3000);
```

## Router()


This module exports a `Router()` function that is a drop-in
replacement for `express.Router()`, except the returned
router has `getAsync()`, `useAsync()`, etc.


### It exports a `Router` function that returns a new async-friendly router

```javascript
const express = require('express');
const app = express(); // This app isn't async friendly.

const router = Router(); // But this router is.
router.getAsync('/foo', async function(req, res, next) {
  throw new Error('Oops!');
});

app.use(router);
app.use(function(err, req, res, next) {
  res.send(err.message);
});

const server = await app.listen(3000);
```

## decorateApp

acquit:ignore:end

### It is an alias for addAsync()

```javascript
assert.equal(decorateApp, addAsync)
```

## decorateRouter

### It is an alias for addAsync()

```javascript
assert.equal(decorateRouter, addAsync)
```

## wrap()


If you need more fine-grained control than what `addAsync()` gives
you, you can use the `wrap()` function. This function wraps an async
Express middleware or route handler for better error handling.


### It wraps an async function with Express-compatible error handling

```javascript
const express = require('express');
const app = express();

// `wrap()` takes an async middleware or route handler and adds a
// `.catch()` to handle any errors. It also prevents double-calling
// `next()`.
app.get('*', wrap(async function(req, res, next) {
  throw new Error('Oops!');
}));

// `wrap()` also supports async error handling middleware.
app.use(wrap(async function(error, req, res, next) {
  throw new Error('foo');
}));

app.use(function(error, req, res, next) {
  res.send(error.message); // Will send back 'foo'
});

const server = await app.listen(3000);
```
