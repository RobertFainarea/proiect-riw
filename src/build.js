const db = require("./db");
const buildIndexes = require("./build-indexes");
const inputPath = "static/";

async function main() {
  await db.clear();
  await buildIndexes(inputPath);
}

db.connect().then(main).then(db.close);
