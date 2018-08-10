module.exports = function wrap(fn) {
  // Error handling middleware
  if (fn.length === 4) {
    return function wrappedErrorHandler(error, req, res, next) {
      next = _once(next);
      fn(error, req, res, next).then(next, next);
    };
  }

  return function wrappedMiddleware(req, res, next) {
    next = _once(next);
    fn(req, res, next).then(next, next);
  };
};

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
