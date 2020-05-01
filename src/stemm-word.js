const snowball = require("node-snowball");

const stemmWord = (word) => {
  normalizedWord = word.toLowerCase();
  return snowball.stemword(normalizedWord, "romanian");
};

module.exports = stemmWord;
