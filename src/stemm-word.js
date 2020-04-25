const snowball = require("node-snowball");

const stemmWord = (word) => {
  normalizedWord = word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return snowball.stemword(normalizedWord, "romanian");
};

module.exports = stemmWord;
