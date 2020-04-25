const fs = require("fs");
const snowball = require("node-snowball");

const stopWordsJson = fs.readFileSync("stop-words.json");
const stopWords = JSON.parse(stopWordsJson);

const getTextDictionary = (docText) =>
  docText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/\w+/gi)
    .map((w) => w.toLowerCase())
    .filter((w) => !stopWords.includes(w))
    .map((w) => snowball.stemword(w, "romanian"))
    .reduce((acc, w) => {
      acc[w] = acc[w] === undefined ? 1 : acc[w] + 1;
      return acc;
    }, {});

module.exports = getTextDictionary;
