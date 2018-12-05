/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const puppeteer = require('puppeteer');
const _ = require('underscore');

// RelatedKeyword
module.exports = class RelatedKeyword {
  /**
   * constructor
   */
  constructor() {
    this.browser = null;
    this.page = null;
  }

  /**
   * openBrowser
   * [async]
   */
  async openBrowser() {
    if (this.browser) return;
    this.browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.goto('https://trends.google.co.jp/trends/?geo=JP');
  }

  /**
   * closeBrowser
   * [async]
   */
  async closeBrowser() {
    this.browser.close();
    this.browser = null;
    this.page = null;
  }

  /**
   * getKeywords
   * [async]
   * @param {String} keyword
   * @return {Array} keywords
   */
  async getKeywords(keyword) {
    await this.openBrowser();
    const relatedKeywords = new Promise((resolve, reject) => {
      this.page.on('response', async response => {
        const url = response.url();
        if (
          url.indexOf(
            'https://trends.google.co.jp/trends/api/widgetdata/relatedsearches'
          ) === 0 &&
          url.indexOf('QUERY') > 0
        ) {
          response.text().then(text => {
            const data = JSON.parse(text.slice(5));
            const rankedKeyword = data.default.rankedList[1].rankedKeyword;

            let keywords = [];
            rankedKeyword.forEach(relatedKeyword => {
              const query = relatedKeyword.query
                .trim()
                .replace(/:/g, '')
                .replace(/　/g, ' ');
              if (_.findWhere(keywords, { keyword: query })) return;
              keywords.push({ keyword: query, value: relatedKeyword.value });
            });
            resolve(keywords);
          });
        }
      });

      this.page.goto(
        'https://trends.google.co.jp/trends/explore?date=all&geo=JP&q=' +
          keyword
      );
    });

    return await relatedKeywords;
  }

  /**
   * getTree
   * [async]
   * @param {String} keyword
   * @return {Object} tree
   */
  async getTree(keyword) {
    let tree = { keyword: keyword, children: [] };
    const parentKeywords = await this.getKeywords(keyword);
    parentKeywords.splice(4);

    for (
      let parentIndex = 0;
      parentIndex < parentKeywords.length;
      parentIndex++
    ) {
      tree.children[parentIndex] = {
        keyword: parentKeywords[parentIndex].keyword,
        value: parentKeywords[parentIndex].value,
        children: []
      };
      const childKeywords = await this.getKeywords(
        parentKeywords[parentIndex].keyword
      );
      childKeywords.splice(4);
      childKeywords.forEach((value, childIndex) => {
        tree.children[parentIndex].children[childIndex] = {
          keyword: value.keyword,
          value: value.value,
          children: {}
        };
      });
    }
    return tree;
  }
};
