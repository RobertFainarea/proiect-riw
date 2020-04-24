const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const getDocumentText = require("./get-document-text");
const getTextDictionary = require("./get-text-dictionary");
const db = require("./db");

function buildDirectIndex(inputPath) {
  const queue = [""];
  const docs = [];

  function readDir() {
    queue.forEach((queuedPath) => {
      fs.readdirSync(path.join(inputPath, queuedPath)).forEach((item) => {
        const relPath = path.join(queuedPath, item);
        const absPath = path.join(inputPath, relPath);
        const itemStats = fs.statSync(absPath);

        if (itemStats.isDirectory()) {
          return queue.push(relPath);
        }

        const htmlAsString = fs.readFileSync(absPath);
        const $doc = cheerio.load(htmlAsString);
        const documentText = getDocumentText($doc);
        const textDictionary = getTextDictionary(documentText);

        docs.push({ doc: relPath.replace(/\\/g, "/"), terms: textDictionary });
      });
    });
  }

  while (queue.length > 0) {
    readDir();
    queue.shift();
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

const buildIndexes = async (inputPath) => {
  const dirIndexDocs = buildDirectIndex(inputPath);
  await db.insertDirectIndexes(dirIndexDocs);

  const indIndexDocs = buildIndirectIndex(dirIndexDocs);
  await db.insertIndirectIndexes(indIndexDocs);
};

module.exports = buildIndexes;
