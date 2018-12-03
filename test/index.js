/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const RelatedKeyword = require('../lib/related-keyword');
const relatedKeyword = new RelatedKeyword();

(async () => {
  // console.log(await relatedKeyword.getKeywords('筋肉'));
  // console.log(await relatedKeyword.getKeywords('テスト'));
})();

(async () => {
  // console.log(JSON.stringify(await relatedKeyword.getTree('テスト')));
})();
