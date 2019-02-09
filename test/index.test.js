const assert = require('assert');
const express = require('express');
const superagent = require('superagent');
const { addAsync, wrap } = require('../');

describe('addAsync', function() {
  it('works', async function() {
    const app = addAsync(express());

    app.useAsync(async function(req, res, next) {
      throw new Error('Oops!');
    });

    app.use(function(error, req, res, next) {
      res.send(error.message);
    });

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'Oops!');

    await server.close();
  });

  it('handles middleware in getter', async function() {
    const app = addAsync(express());

    const m = async function() {
      throw new Error('Oops!');
    };

    app.getAsync('*', m, async function(req, res, next) {
      throw new Error('Unexpected');
    });

    app.use(function(error, req, res, next) {
      res.send(error.message);
    });

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'Oops!');

    await server.close();
  });


  it('should work with mixed async and non-async handlers', async function() {
    const app = addAsync(express());

    app.getAsync('/', function (req,res,next) {
      req.helloMessage = 'Hello, World!';
    }, async function routeHandler(req, res) {
      await new Promise(resolve => setTimeout(resolve, 10));
      res.send(req.helloMessage);
    });

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');
    assert.equal(res.text, 'Hello, World!');

    await server.close();
  });

  it('should work with mixed async and non-async handlers, when throwing errors', async function() {
    const app = addAsync(express());

    app.getAsync('/', function (req,res,next) {
      throw new Error('Oops!');
    }, async function routeHandler(req, res) {
      await new Promise(resolve => setTimeout(resolve, 10));
      res.send(req.helloMessage);
    });

    app.useAsync(async function (err,req,res,next) {
      res.send(err.message);
    });

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'Oops!');

    await server.close();
  });
});

describe('wrap', function() {
  it('works', async function() {
    const app = express();

    app.use(wrap(async function(req, res, next) {
      await new Promise(resolve => setTimeout(resolve, 10));
      next();
    }));

    app.get('/', wrap(async function(req, res) {
      await new Promise(resolve => setTimeout(resolve, 10));
      res.send('Hello, World!');
    }));

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'Hello, World!');

    await server.close();
  });

  it('errors in middleware', async function() {
    const app = express();

    app.use(wrap(async function middleware(req, res, next) {
      throw new Error('Oops!');
    }));

    app.get('/', wrap(async function routeHandler(req, res) {
      await new Promise(resolve => setTimeout(resolve, 10));
      res.send('Hello, World!');
    }));

    app.use(function errorHandler(error, req, res, next) {
      res.send(error.message);
    });

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'Oops!');

    await server.close();
  });

  it('async error handlers', async function() {
    const app = express();

    app.use(wrap(async function(req, res, next) {
      throw new Error('Oops!');
    }));

    app.get('/', wrap(async function(req, res) {
      await new Promise(resolve => setTimeout(resolve, 10));
      res.send('Hello, World!');
    }));

    app.use(wrap(async function(error, req, res, next) {
      await new Promise(resolve => setTimeout(resolve, 10));
      next(new Error('New: ' + error.message));
    }));

    app.use(wrap(async function(error, req, res, next) {
      res.send(error.message);
    }));

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'New: Oops!');

    await server.close();
  });

  it('early exit', async function() {
    const app = express();
    let ran = false;

    app.use(wrap(async function(req, res) {
      res.send('Hello!');
    }));

    app.get('/', wrap(async function(req, res) {
      ran = true;
      res.send('Hello, World!');
    }));

    const server = await app.listen(3000);

    const res = await superagent.get('http://localhost:3000');

    assert.equal(res.text, 'Hello!');
    assert.ok(!ran);

    await server.close();
  });
});
