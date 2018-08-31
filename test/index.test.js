const assert = require('assert');
const express = require('express');
const superagent = require('superagent');
const { decorateApp, wrap } = require('../');

describe('decorateApp', function() {
  it('works', async function() {
    const app = decorateApp(express());

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

    app.use(wrap(async function(req, res, next) {
      throw new Error('Oops!');
    }));

    app.get('/', wrap(async function(req, res) {
      await new Promise(resolve => setTimeout(resolve, 10));
      res.send('Hello, World!');
    }));

    app.use(function(error, req, res, next) {
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
});
