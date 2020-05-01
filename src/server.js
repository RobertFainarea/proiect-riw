const express = require("express");
const app = express();

const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

const db = require("./db");
const getTextDictionary = require("./get-text-dictionary");
const getTextFromHTML = require("./get-text-from-html");
const buildQueryFilter = require("./build-query-filter");

app.use("/static", express.static("static"));
app.use(express.static("public"));

app.get("/search/:text", async (req, res) => {
  const { text } = req.params;
  const searchDict = getTextDictionary(text);
  const queryFilter = buildQueryFilter(text);

  console.log("\n===========================================================");
  console.log("searchUrl:", req.url, `(${text})`);
  console.log("searchTerms:", Object.keys(searchDict));
  console.log("queryFilter:", JSON.stringify(queryFilter, null, 2));

  const results = await db.search(Object.keys(searchDict), queryFilter);

  for (let i = 0; i < results.length; i++) {
    const filePath = path.join("./static", results[i].link);
    const fileHTML = await readFileAsync(filePath);
    const fileText = getTextFromHTML(fileHTML);

    results[i].sample = fileText.substring(0, 200);
  }

  res.send(JSON.stringify(results));
});

const kPort = 3000;
db.connect().then(() =>
  app.listen(kPort, () => console.log(`app listening on port ${kPort}`))
);
