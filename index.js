const assert = require('assert');
const express = require('express');

module.exports = {
  addAsync,
  decorateApp: addAsync,
  decorateRouter: addAsync,
  Router: function asyncRouter() {
    return addAsync(express.Router.apply(express, arguments));
  },
  wrap
};

function addAsync(app) {
  app.routeAsync = function() {
    return addAsync(this.route.apply(this, arguments));
  };
  
  ['use', 'delete', 'get', 'head', 'param', 'patch', 'post', 'put'].forEach(method => {
    app[`${method}Async`] = function() {
      const fn = arguments[arguments.length - 1];
      assert.ok(typeof fn === 'function',
        `Last argument to \`${method}Async()\` must be a function`);
      const args = wrapArgs(arguments);
      return app[method].apply(app, args);
    };
  });
  
  return app;
}

/**
 * Call `wrap()` on all args
 */

function wrapArgs(fns, isParam) {
  const ret = [];
  for (const fn of fns) {
    if (typeof fn !== 'function') {
      ret.push(fn);
      continue;
    }
    ret.push(wrap(fn, isParam));
  }
  return ret;
}

/**
 * Given a function that returns a promise, converts it into something you
 * can safely pass into `app.use()`, `app.get()`, `app.param()`, etc.
 */

function wrap(fn, isParam) {
  const isErrorHandler = !isParam && fn.length == 4 ? 1 : 0;
  async function wrapped() {
    next = _once(arguments[2 + isErrorHandler]);
    res = arguments[1 + isErrorHandler];
    try {
      await fn.apply(null, arguments);
      if (!res.headersSent) next();
    } catch(err) {
      if (!res.headersSent) next(err);
    }
  };
  
  Object.defineProperty(wrapped, 'name', { // Define a name for stack traces
    value: isErrorHandler ? 'wrappedErrorHandler' : isParam ? 'wrappedParamMiddleware' : 'wrappedMiddleware' 
  });
  
  return wrapped;
}

function _once(fn) {
  let called = false;
  return function() {
    if (called) {
      return;
    }
    called = true;
    fn.apply(null, arguments);
  };
}
