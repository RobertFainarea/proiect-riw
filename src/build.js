const db = require("./db");
const { buildDirectIndex, buildIndirectIndex } = require("./build-indexes");

const inputPath = "static/";

async function main() {
  await db.clear();

  const dirIndexDocs = buildDirectIndex(inputPath);
  await db.insertDirectIndexes(dirIndexDocs);

  const indIndexDocs = buildIndirectIndex(dirIndexDocs);
  await db.insertIndirectIndexes(indIndexDocs);
}

db.connect().then(main).then(db.close);
