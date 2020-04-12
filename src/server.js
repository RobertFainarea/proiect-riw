const express = require("express");
const app = express();

const db = require("./db");
const getTextDictionary = require("./get-text-dictionary");

app.use("/static", express.static("static"));
app.use(express.static("public"));

app.get("/search/:text", async (req, res) => {
  const { text } = req.params;
  const textDictionary = getTextDictionary(text);

  const results = await db.searchIndirectIndex(
    Object.keys(textDictionary).join(" ")
  );
  res.send(JSON.stringify(results));
});

const kPort = 3000;
db.connect().then(() =>
  app.listen(kPort, () => console.log(`app listening on port ${kPort}`))
);
