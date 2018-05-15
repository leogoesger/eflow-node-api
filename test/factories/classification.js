const Classification = require('../../src/models').Classification;

module.exports = factory => {
  const classification = factory.define(
    'classification',
    Classification,
    async () => {
      return {
        name: factory.chance('first'),
        description: factory.chance('sentence', {words: 5}),
        abbreviation: factory.chance('first'),
      };
    }
  );
  return classification;
};
