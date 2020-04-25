const fs = require("fs");
const path = require("path");

const getTextFromHTML = require("./get-text-from-html");
const getTextDictionary = require("./get-text-dictionary");

function buildDirectIndex(inputPath) {
  const queue = [""];
  const docs = [];

  while (queue.length > 0) {
    const queuedPath = queue.shift();

    fs.readdirSync(path.join(inputPath, queuedPath)).forEach((item) => {
      const relPath = path.join(queuedPath, item);
      const absPath = path.join(inputPath, relPath);
      const itemStats = fs.statSync(absPath);

      if (itemStats.isDirectory()) {
        return queue.push(relPath);
      }

      const fileHTML = fs.readFileSync(absPath);
      const fileText = getTextFromHTML(fileHTML);
      const fileDict = getTextDictionary(fileText);

      docs.push({ doc: relPath.replace(/\\/g, "/"), terms: fileDict });
    });
  }

  return docs.map((d) => ({
    doc: d.doc,
    terms: Object.keys(d.terms).map((key) => ({ t: key, c: d.terms[key] })),
  }));
}

function buildIndirectIndex(dirIndexDocs) {
  const docsObj = {};

  dirIndexDocs.forEach((d) => {
    d.terms.forEach(({ t, c }) => {
      if (docsObj[t] === undefined) docsObj[t] = [];
      docsObj[t].push({ d: d.doc, c });
    });
  });

  return Object.keys(docsObj).map((key) => ({ term: key, docs: docsObj[key] }));
}

module.exports = { buildDirectIndex, buildIndirectIndex };
