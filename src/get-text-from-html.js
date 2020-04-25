const cheerio = require("cheerio");

const getTextFromHTML = (html) => {
  return cheerio.load(html).text().replace(/\s\s/g, "");
};

module.exports = getTextFromHTML;
