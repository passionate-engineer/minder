/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const RelatedKeyword = require('../lib/related-keyword');
const relatedKeyword = new RelatedKeyword();

(async () => {
  console.log(
    JSON.stringify(await relatedKeyword.getRelatedKeywords('テスト'))
  );
})();

(async () => {
  // console.log(JSON.stringify(await relatedKeyword.getTree('テスト')));
})();
