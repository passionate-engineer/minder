/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

module.exports = class Keyword {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async openBrowser() {
    if (this.browser) return;
    this.browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.goto('https://trends.google.co.jp/trends/?geo=JP');
  }

  async closeBrowser() {
    this.browser.close();
    this.browser = null;
    this.page = null;
  }

  async getRelatedKeywords(keyword) {
    await this.openBrowser();
    await this.page.goto(
      'https://trends.google.co.jp/trends/explore?date=all&geo=JP&q=' + keyword
    );
    await this.page.waitForSelector('.fe-related-queries');
    const scrapingData = await this.page.evaluate(async () => {
      const dataList = [];
      const nodeList = document.querySelectorAll(
        '.fe-related-queries:nth-child(3) .progress-label span'
      );
      nodeList.forEach(_node => {
        dataList.push(_node.innerText.replace(/ - .*$/, '').trim());
      });
      return dataList;
    });
    // await page.click('a[href^="index.php?query="]');
    await this.closeBrowser();
    return scrapingData;
  }

  async getTree(keyword) {
    try {
      await this.openBrowser();
      let tree = { keyword: keyword, children: [] };
      const parentKeywords = await this.getRelatedKeywords(keyword);
      parentKeywords.splice(4);

      for (
        let parentIndex = 0;
        parentIndex < parentKeywords.length;
        parentIndex++
      ) {
        tree.children[parentIndex] = {
          keyword: parentKeywords[parentIndex],
          children: []
        };
        const childKeywords = await this.getRelatedKeywords(
          parentKeywords[parentIndex]
        );
        childKeywords.splice(4);
        childKeywords.forEach((value, childIndex) => {
          tree.children[parentIndex].children[childIndex] = {
            keyword: value,
            children: {}
          };
        });
      }
      await this.closeBrowser();
      return tree;
    } catch (e) {
      return [];
    }
  }
};
