const AllYear = require('../../src/models').AllYear;

module.exports = factory => {
  const allYear = factory.define('allYear', AllYear, async () => {
    return {
      average: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      standardDeviation: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      coeffientVariance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      gaugeId: factory.assoc('gauge', 'id'),
    };
  });
  return allYear;
};
