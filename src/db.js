const { MongoClient } = require("mongodb");

const kDbUrl = "mongodb://localhost:27017";
const kDbName = "riw";
const kDirectIndexCollection = "directIndex";
const kIndirectIndexCollection = "indirectIndex";

class Db {
  constructor() {
    this.client = new MongoClient(kDbUrl, { useUnifiedTopology: true });
    this.db = null;
    this.dirIdxsColl = null;
    this.indIdxsColl = null;

    this.connect = this.connect.bind(this);
    this.close = this.close.bind(this);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(kDbName);
    this.dirIdxsColl = this.db.collection(kDirectIndexCollection);
    this.indIdxsColl = this.db.collection(kIndirectIndexCollection);
  }

  async close() {
    await this.client.close();
    this.db = null;
    this.client = null;
    this.dirIdxsColl = null;
    this.indIdxsColl = null;
  }

  insertDirectIndexes(docs) {
    return this.dirIdxsColl.insertMany(docs);
  }

  insertIndirectIndexes(docs) {
    return this.indIdxsColl.insertMany(docs);
  }

  // search(terms) {
  //   return this.indIdxsColl
  //     .aggregate([
  //       { $match: { term: { $in: terms } } },
  //       { $unwind: "$docs" },
  //       {
  //         $group: {
  //           _id: "$docs.d",
  //           wordsNo: { $sum: 1 },
  //           relevance: { $sum: "$docs.c" },
  //         },
  //       },
  //       { $sort: { wordsNo: -1, relevance: -1 } },
  //       {
  //         $project: {
  //           _id: 0,
  //           link: "$_id",
  //           wordsNo: "$wordsNo",
  //           relevance: "$relevance",
  //         },
  //       },
  //       { $limit: 5 },
  //     ])
  //     .toArray();
  // }

  search(terms, query) {
    return this.indIdxsColl
      .aggregate([
        { $match: { term: { $in: terms } } },
        { $unwind: "$docs" },
        {
          $group: {
            _id: "$docs.d",
            terms: { $push: { t: "$term", c: "$docs.c" } },
          },
        },
        { $match: query },
        { $unwind: "$terms" },
        {
          $group: {
            _id: "$_id",
            wordsNo: { $sum: 1 },
            relevance: { $sum: "$terms.c" },
          },
        },
        { $sort: { wordsNo: -1, relevance: -1 } },
        {
          $project: {
            _id: 0,
            link: "$_id",
            wordsNo: "$wordsNo",
            relevance: "$relevance",
          },
        },
        // { $limit: 5 },
      ])
      .toArray();
  }

  clear() {
    const clearDirectIndexPromise = this.dirIdxsColl.deleteMany({});
    const clearIndirectIndexPromise = this.indIdxsColl.deleteMany({});

    return Promise.all([clearDirectIndexPromise, clearIndirectIndexPromise]);
  }
}

module.exports = new Db();
