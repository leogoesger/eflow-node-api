import * as d3 from 'd3';
import {
  AllYear,
  Gauge,
  Classification,
  Fall,
  Spring,
  Summer,
  Winter,
  FallWinter,
} from '../models';
import {metricReferenceAs} from '../static/metricReference';
import {removeNaN, getJulianOffsetDate, getCalenderDate} from './helpers';

export const calculatePercentileClourse = async id => {
  let classId = id;

  const calculatePercentile = async () => {
    if (classId > 9) {
      return null;
    }

    const gauges = await Gauge.findAll({
      where: {classId},
      include: [
        {
          model: AllYear,
          as: 'allYears',
          attributes: ['average', 'standardDeviation', 'coeffientVariance'],
        },
        {
          model: Fall,
          as: 'falls',
          attributes: ['timing', 'magnitude', 'timingWet', 'duration'],
        },
        {
          model: Spring,
          as: 'springs',
          attributes: ['timing', 'magnitude', 'rateOfChange', 'duration'],
        },
        {
          model: Summer,
          as: 'summers',
          attributes: [
            'timing',
            'magnitude10',
            'magnitude50',
            'durationFlush',
            'durationWet',
            'noFlowCount',
          ],
        },
        {
          model: Winter,
          as: 'winters',
          attributes: [
            'timing2',
            'timing5',
            'timing10',
            'timing20',
            'timing50',
            'duration2',
            'duration5',
            'duration10',
            'duration20',
            'duration50',
            'frequency2',
            'frequency5',
            'frequency10',
            'frequency20',
            'frequency50',
            'magnitude2',
            'magnitude5',
            'magnitude10',
            'magnitude20',
            'magnitude50',
          ],
        },
        {
          model: FallWinter,
          as: 'fallWinters',
          attributes: ['magWet'],
        },
      ],
    });

    const combined = {};
    metricReferenceAs.forEach(reference => {
      combined[reference.short] = [];
      gauges.forEach(gauge => {
        if (gauge[reference.as][0]) {
          let data = [];
          if (
            reference.name.includes('Timing') &&
            !reference.name.includes('summer')
          ) {
            data = gauge[reference.as][0][reference.columnName].map(d =>
              getJulianOffsetDate(Number(d))
            );
          } else {
            data = gauge[reference.as][0][reference.columnName];
          }
          combined[reference.short] = [...combined[reference.short], ...data];
        }
      });
    });
    const combinedPercentile = {};
    Object.keys(combined).forEach(key => {
      const sortedData = removeNaN(combined[key]);
      combinedPercentile[key] = [
        d3.quantile(sortedData, 0.1),
        d3.quantile(sortedData, 0.5),
        d3.quantile(sortedData, 0.9),
      ];
    });

    metricReferenceAs.forEach(reference => {
      if (
        reference.name.includes('Timing') &&
        !reference.name.includes('summer')
      ) {
        combinedPercentile[reference.short] = combinedPercentile[
          reference.short
        ].map(d => getCalenderDate(Number(d)));
      }
    });

    const updateClass = await Classification.findById(classId);
    updateClass
      .update(combinedPercentile, {
        fields: Object.keys(combinedPercentile),
      })
      .then(() => {
        classId = classId + 1;
        calculatePercentile(classId);
      });
  };
  calculatePercentile();
};

export const updateGaugePercentiles = async classId => {
  const gauges = await Gauge.findAll({
    where: {id: classId},
    include: [
      {
        model: AllYear,
        as: 'allYears',
        attributes: ['average', 'standardDeviation', 'coeffientVariance'],
      },
      {
        model: Fall,
        as: 'falls',
        attributes: ['timing', 'magnitude', 'timingWet', 'duration'],
      },
      {
        model: Spring,
        as: 'springs',
        attributes: ['timing', 'magnitude', 'rateOfChange', 'duration'],
      },
      {
        model: Summer,
        as: 'summers',
        attributes: [
          'timing',
          'magnitude10',
          'magnitude50',
          'durationFlush',
          'durationWet',
          'noFlowCount',
        ],
      },
      {
        model: Winter,
        as: 'winters',
        attributes: [
          'timing2',
          'timing5',
          'timing10',
          'timing20',
          'timing50',
          'duration2',
          'duration5',
          'duration10',
          'duration20',
          'duration50',
          'frequency2',
          'frequency5',
          'frequency10',
          'frequency20',
          'frequency50',
          'magnitude2',
          'magnitude5',
          'magnitude10',
          'magnitude20',
          'magnitude50',
        ],
      },
      {
        model: FallWinter,
        as: 'fallWinters',
        attributes: ['magWet'],
      },
    ],
  });

  const promises = [];
  gauges.forEach(gauge => {
    const metrics = {};
    metricReferenceAs.forEach(reference => {
      let data;
      if (
        reference.name.includes('Timing') &&
        !reference.name.includes('summer')
      ) {
        data = gauge[reference.as][0][reference.columnName].map(d =>
          getJulianOffsetDate(Number(d))
        );
      } else {
        data = gauge[reference.as][0][reference.columnName];
      }

      const sortedData = removeNaN(data);
      metrics[reference.short] = [
        d3.quantile(sortedData, 0.1),
        d3.quantile(sortedData, 0.5),
        d3.quantile(sortedData, 0.9),
      ];
    });

    metricReferenceAs.forEach(reference => {
      if (
        reference.name.includes('Timing') &&
        !reference.name.includes('summer')
      ) {
        metrics[reference.short] = metrics[reference.short].map(d =>
          getCalenderDate(Number(d))
        );
      }
    });

    promises.push(gauge.update(metrics, {fields: Object.keys(metrics)}));
  });

  return Promise.all(promises);
};
