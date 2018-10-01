const puppeteer = require('puppeteer')
const fetch = require('node-fetch')

module.exports = class Keyword {
  static async getRelatedKeywords(keyword) {
    try {
      /*
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      })

      const page = await browser.newPage()
      await page.goto('https://goodkeyword.net/search.php?formquery=' + encodeURIComponent(keyword))

      const scrapingData = await page.evaluate(() => {
        const dataList = []
        const nodeList = document.querySelectorAll("#column3-result-around-in a")
        nodeList.forEach(_node => {
          dataList.push(_node.innerText)
        })
        return dataList
      })
      browser.close()
      return scrapingData
      */

      /*
      const response = await fetch('https://qdjnvxwje1.execute-api.us-east-1.amazonaws.com/blue/keyword_ideas?query=' + encodeURIComponent(keyword) + '&language=ja&country=jp&google=http:%2F%2Fwww.google.com&service=0')
      const result = await response.json()
      let list = result.results.splice(1, 4)
      return list.map((value) => {
        return value.keyword
      })
      */

      // const browser = await puppeteer.launch({headless: false})
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      })
      const page = await browser.newPage()
      await page.goto('https://trends.google.co.jp/trends/?geo=JP')
      await page.goto('https://trends.google.co.jp/trends/explore?date=all&geo=JP&q=' + keyword)
      await page.waitForSelector('.fe-related-queries')
      const scrapingData = await page.evaluate(async() => {
        const dataList = []
        const nodeList = document.querySelectorAll('.fe-related-queries .progress-label span')
        nodeList.forEach(_node => {
          dataList.push(_node.innerText.replace(/ - .*$/, '').trim())
        })
        return dataList
      })
      browser.close()
      return scrapingData
    } catch (e) {
      return null
    }
  }

  static async getTree(keyword) {
    try {
      let tree = {keyword: keyword, children: []}
      const parentKeywords = await this.getRelatedKeywords(keyword)
      parentKeywords.splice(4)

      for (let parentIndex = 0; parentIndex < parentKeywords.length; parentIndex++) {
        tree.children[parentIndex] = {keyword: parentKeywords[parentIndex], children: []}
        const childKeywords = await this.getRelatedKeywords(parentKeywords[parentIndex])
        childKeywords.splice(4)
        childKeywords.forEach((value, childIndex) => {
          tree.children[parentIndex].children[childIndex] = {keyword: value, children: {}}
        })
      }
      return tree
    } catch (e) {
      return null
    }
  }
}
