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
  
  let methods = ['use', 'delete', 'get', 'head', 'param', 'patch', 'post', 'put'];
  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    app[`${method}Async`] = function() {
      const fn = arguments[arguments.length - 1];
      assert.ok(typeof fn === 'function',
        `Last argument to \`${method}Async()\` must be a function`);
      const args = wrapArgs(arguments, method == 'param');
      return app[method].apply(app, args);
    };
  }
  
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
  const isErrorHandler = fn.length == 4 && !isParam;

  let wrapped = async function() {
    // Ensure next function is only ran once
    arguments[2 + isErrorHandler] = _once(arguments[2 + isErrorHandler]);
    try {
      const promise = fn.apply(null, arguments);
      if (promise && typeof promise.then === 'function') {
        await promise;
        arguments[1 + isErrorHandler].headersSent ? null : arguments[2 + isErrorHandler]();
      }
    } catch(err) {
      arguments[1 + isErrorHandler].headersSent ? null : arguments[2 + isErrorHandler](err);
    }
  };
  
  Object.defineProperty(wrapped, 'length', { // Length has to be set for express to recognize error handlers as error handlers
    value: isErrorHandler ? 4 : isParam ? 4 : 3
  });
  
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
