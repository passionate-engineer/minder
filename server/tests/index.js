// import Keyword from './keyword';
const relatedKeyword = require('../modules/related-keyword');

(async () => {
  // console.log(JSON.stringify(await relatedKeyword.getRelatedKeywords('テスト')));
})();

(async () => {
  console.log(JSON.stringify(await relatedKeyword.getTree('テスト')));
})();
