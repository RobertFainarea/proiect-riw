const cheerio = require("cheerio");

const getTextFromHTML = (html) => {
  return cheerio.load(html).text().replace(/\s+/g, " ");
};

module.exports = getTextFromHTML;
