/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const http = require('http');
const express = require('express');
const cluster = require('express-cluster');

const RelatedKeyword = require('./related-keyword');
const relatedKeyword = new RelatedKeyword();

// Server
class Server {
  /**
   * constructor
   */
  constructor() {
    this.app = express();
  }

  /**
   * start
   * @param {Number} port
   * @return {String} allowOrigin
   */
  start(port, allowOrigin) {
    this.setHeaders(allowOrigin);
    this.setRouters();
    this.listen(port);
  }

  /**
   * setHeaders
   */
  setHeaders(allowOrigin) {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', allowOrigin);
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });
  }

  /**
   * setRouters
   */
  setRouters() {
    // /api/keyword-tree
    this.app.get('/api/keyword-tree', (req, res) => {
      const keyword = req.query.keyword;
      if (!keyword) {
        return res.status(400).send('');
      }

      (async () => {
        const tree = await relatedKeyword.getTree(keyword);
        if (tree) {
          return res.json(tree);
        } else {
          return res.status(400).send('');
        }
      })();
    });
  }

  /**
   * listen
   */
  listen(port) {
    const server = http.createServer(this.app);
    cluster(worker => {
      server.listen(port, () => {
        console.log('Express server listening on port ' + port);
      });
    });
  }
}

module.exports = Server;
