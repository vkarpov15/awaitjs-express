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

  app.useAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `useAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.use.apply(app, args);
  };

  app.deleteAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `deleteAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.delete.apply(app, args);
  };

  app.getAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `getAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.get.apply(app, args);
  };

  app.headAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `headAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.head.apply(app, args);
  };

  app.paramAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `paramAsync()` must be a function');
    const args = wrapArgs(arguments, true);
    return app.param.apply(app, args);
  }

  app.patchAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `patchAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.patch.apply(app, args);
  };

  app.postAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `postAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.post.apply(app, args);
  };

  app.putAsync = function() {
    const fn = arguments[arguments.length - 1];
    assert.ok(typeof fn === 'function',
      'Last argument to `putAsync()` must be a function');
    const args = wrapArgs(arguments);
    return app.put.apply(app, args);
  };

  return app;
}

/**
 * Call `wrap()` (or `wrapParam()`) on all args
 */

function wrapArgs(fns, isParam) {
  const ret = [];
  for (const fn of fns) {
    if (typeof fn !== 'function') {
      ret.push(fn);
      continue;
    }
    ret.push(isParam ? wrapParam(fn) : wrap(fn));
  }
  return ret;
}

/**
 * Given a function that returns a promise, converts it into something you
 * can safely pass into `app.param()`.
 */

function wrapParam(fn) {
  return async function wrappedParamMiddleware(req, res, next, id) {
    next = _once(next);
    try {
      await fn(req, res, next, id);
      res.headersSent ? null : next();
    } catch(err) {
      res.headersSent ? null : next(err);
    }
  };
}

/**
 * Given an error handler that returns a promise, converts it into something you
 * can safely pass into `app.use()`.
 */

function wrapError(fn) {
  return async function wrappedErrorHandler(error, req, res, next) {
    next = _once(next);
    try {
      await fn(error, req, res, next);
      res.headersSent ? null : next();
    } catch(err) {
      res.headersSent ? null : next(err);
    }
  };
}

/**
 * Given a function that returns a promise, converts it into something you
 * can safely pass into `app.use()`, `app.get()`, etc.
 */

function wrap(fn) {
  // Error handling middleware
  if (fn.length === 4) {
    return wrapError(fn);
  }

  return async function wrappedMiddleware(req, res, next) {
    next = _once(next);
    try {
      await fn(req, res, next);
      res.headersSent ? null : next();
    } catch(err) {
      res.headersSent ? null : next(err);
    }
  };
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
