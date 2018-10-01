const express = require('express');
const http = require('http');
const relatedKeyword = require('./related-keyword')

module.exports = class Server {
  static start () {
    const app = express();

    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.get('/', (req, res) => {
      // console.log(req.query.keyword);
      const keyword = req.query.keyword;
      if (!keyword) {
        return res.status(400).send('');
      }

      (async() => {
        const tree = await relatedKeyword.getTree(keyword);
        if (tree) {
          return res.json(tree);
        } else {
          return res.status(400).send('');
        }
      })();
    });

    const port = '8888';
    http.createServer(app).listen(port, () => {
      console.log('Express server listening on port ' + port);
    });
  }
}
