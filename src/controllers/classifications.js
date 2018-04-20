import * as d3 from 'd3';
import {
  Classification,
  Hydrograph,
  Gauge,
  AllYear,
  Fall,
  Spring,
  Summer,
  Winter,
  FallWinter,
} from '../models';
import {metricReferenceAs} from '../static/metricReference';
import {removeNaN} from '../utils/helpers';

let classId = 1;
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
        combined[reference.short] = [
          ...combined[reference.short],
          ...gauge[reference.as][0][reference.columnName],
        ];
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

module.exports = {
  create(req, res) {
    Classification.create(req.body)
      .then(classInfo => res.status(201).send(classInfo))
      .catch(err => res.status(400).send(err));
  },

  index(req, res) {
    return Classification.findAll({
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: Gauge,
          as: 'gauges',
          attributes: [
            'id',
            'stationName',
            'unimpairedStartYear',
            'unimpairedEndYear',
          ],
        },
      ],
    })
      .then(classifications => {
        res.status(200).send(classifications);
      })
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Classification.findById(req.params.classId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [{model: Hydrograph, as: 'hydrographs'}],
    })
      .then(classInfo => res.status(200).send(classInfo))
      .catch(err => res.status(400).send(err));
  },

  async update(req, res) {
    try {
      await calculatePercentile();
      res.status(200).send('success');
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
