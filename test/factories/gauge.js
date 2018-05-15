const Gauge = require('../../src/models').Gauge;

module.exports = factory => {
  const gauge = factory.define('gauge', Gauge, async () => {
    return {
      stationName: factory.chance('sentence', {words: 5}),
      geometry: factory.chance('sentence', {words: 5}),
      unimpairedStartYear: 1900,
      unimpairedEndYear: 1950,
      classId: factory.assoc('classification', 'id'),
    };
  });
  return gauge;
};
