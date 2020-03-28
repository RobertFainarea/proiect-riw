const buildIndexes = require("./build-indexes");

const inputPath = "temp/input";
const directIndexPath = "temp/output/index-direct.json";
const indirectIndexPath = "temp/output/index-indirect.json";

buildIndexes(inputPath, directIndexPath, indirectIndexPath);
