import {classInfo} from '../static/classes';

export const getMetrics = data => [
  data.allYear.average_annual_flows,
  data.allYear.standard_deviations,
  data.allYear.coefficient_variations,
  data.spring.timings,
  data.spring.magnitudes,
  data.spring.durations,
  data.spring.rocs,
  data.summer.timings,
  data.summer.magnitudes_ten,
  data.summer.magnitudes_fifty,
  data.summer.durations_flush,
  data.summer.durations_wet,
  data.summer.no_flow_counts,
  data.fall.timings,
  data.fall.magnitudes,
  data.fall.wet_timings,
  data.fall.durations,
  data.fallWinter.baseflows,
  data.winter.timings.two,
  data.winter.durations.two,
  data.winter.frequencys.two,
  data.winter.magnitudes.two,
  data.winter.timings.five,
  data.winter.durations.five,
  data.winter.frequencys.five,
  data.winter.magnitudes.five,
  data.winter.timings.ten,
  data.winter.durations.ten,
  data.winter.frequencys.ten,
  data.winter.magnitudes.ten,
  data.winter.timings.twenty,
  data.winter.durations.twenty,
  data.winter.frequencys.twenty,
  data.winter.magnitudes.twenty,
];

export const getClassPredictions = pred => {
  // get json response from flask, and convert it to each class, and find the predicted class
  const classList = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];

  const classPredictions = {
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    seven: [],
    eight: [],
    nine: [],
  };

  pred.map(p => classList.map(c => classPredictions[c].push(p.summary[c])));

  let predictClass = null;
  let highAvg = 0;
  Object.keys(classPredictions).forEach(k => {
    const avg =
      classPredictions[k].reduce((prev, curr) => prev + curr) /
      classPredictions[k].length;
    if (avg > highAvg) {
      predictClass = classInfo[k].fullName;
      highAvg = avg;
    }
  });

  return {predictClass, classPredictions};
};
