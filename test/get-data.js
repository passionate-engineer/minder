/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'ap-northeast-1' });

const RelatedKeyword = require('../lib/related-keyword');
const relatedKeyword = new RelatedKeyword();

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let stack = [process.argv[2]];
let count = 0;
const autoPutItem = () => {
  const keyword = stack[0];
  if (++count > 10000) return;
  console.log(count + ':' + keyword + ':' + String(new Date()).slice(16, 24));

  let params = {
    TableName: 'minder',
    Key: {
      keyword: { S: keyword }
    }
  };

  dynamodb.getItem(params, async (err, res) => {
    // console.log(res);
    if ((res && !res.Item) || count === 0) {
      const relatedKeywords = await relatedKeyword.getKeywords(keyword);

      const putRelatedKeywords = JSON.stringify(
        relatedKeywords.map(keyword => {
          return [keyword.keyword, keyword.value];
        })
      );

      params = {
        TableName: 'minder',
        Item: {
          keyword: { S: keyword },
          related_keywords: { S: putRelatedKeywords }
        }
      };

      dynamodb.putItem(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          relatedKeywords.forEach(relatedKeyword => {
            stack.push(relatedKeyword.keyword);
          });
          stack.shift();
          shuffle(stack);
          stack.splice(100);
          // console.log(stack);
          autoPutItem();
        }
      });
    } else {
      console.log('重複');
      shuffle(stack);
      autoPutItem();
    }
  });
};

autoPutItem();
