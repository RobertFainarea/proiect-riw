const stemmWord = require("./stemm-word");

const buildNots = (text) => {
  const [t, ...nin] = text.split(/\*+/g);

  if (nin.length === 0) {
    return { "terms.t": stemmWord(t) };
  } else if (nin.length >= 1) {
    return {
      $and: [
        { "terms.t": stemmWord(t) },
        { "terms.t": { $nin: nin.map(stemmWord) } },
      ],
    };
  }

  return {};
};

const buildAnds = (text) => {
  const ands = text.split(/\++/g);

  if (ands.length === 1) {
    return buildNots(ands[0]);
  } else if (ands.length > 1) {
    return { $and: ands.map((a) => buildNots(a)) };
  }

  return {};
};

const buildOrs = (text) => {
  const ors = text.split(/\ +/g);

  if (ors.length === 1) {
    return buildAnds(ors[0]);
  } else if (ors.length > 1) {
    return { $or: ors.map((o) => buildAnds(o)) };
  }

  return {};
};

const buildQueryFilter = (text) => buildOrs(text);

module.exports = buildQueryFilter;
