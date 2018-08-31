# @awaitjs/express

Write Express middleware and route handlers using async/await


# API

## decorateApp()


The `decorateApp()` function is the preferred way to add async/await
support to your Express app. This function adds several helper functions
to your Express app.


### It adds `useAsync()`, `getAsync()`, etc. to your Express app


The `decorateApp()` function adds `useAsync()`, `getAsync()`,
`putAsync()`, `postAsync()`, and `headAsync()`.


```javascript
const express = require('express');
const app = decorateApp(express());

// `useAsync()` is like `app.use()`, but supports async functions
app.useAsync(async function(req, res, next) {
  await new Promise(resolve => setTimeout(resolve, 50));
});

// `getAsync()` is like `app.get()`, but supports async functions
app.getAsync('*', async function(req, res, next) {
  throw new Error('Oops!');
});

app.use(function(error, req, res, next) {
  res.send(error.message);
});

const server = await app.listen(3000);
```
