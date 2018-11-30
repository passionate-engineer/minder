/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const express = require('express');
const http = require('http');

const RelatedKeyword = require('./related-keyword');
const relatedKeyword = new Relatedkeyword();

class Server {
  start(port) {
    const app = express();

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'minder.1day-release.cf');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

    app.get('/api/keyword-tree', (req, res) => {
      // console.log(req.query.keyword);
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

    http.createServer(app).listen(port, () => {
      console.log('Express server listening on port ' + port);
    });
  }
}

module.exports = Server;
