import * as d3 from 'd3';
import {sortBy, find} from 'lodash';
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

export const removeNaN = array => {
  const filteredArray = array.filter(ele => !isNaN(Number(ele)));
  return sortBy(filteredArray.map(Number));
};

export const round = (number, precision) => {
  const shift = (number2, precision2, reverseShift) => {
    let cPercision = precision2;
    if (reverseShift) {
      cPercision = -cPercision;
    }
    const numArray = String(number2).split('e');
    return Number(
      numArray[0] +
        'e' +
        (numArray[1] ? Number(numArray[1]) + cPercision : cPercision)
    );
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
};

export class ClassBoxPlot {
  constructor(rawData, metricName, category) {
    this.rawData = rawData;
    this.metricName = metricName;
    this.filteredData = null;
    this.quantileData = [];
    this.category = category;
    this.getFilteredData();
    this.getQuantiles();
  }

  getFilteredData() {
    this.filteredData = this.rawData.map(data =>
      removeNaN(data[this.metricName])
    );
  }

  getQuantiles() {
    this.filteredData.forEach(data => {
      data.forEach(d => this.quantileData.push(d));
    });
    this.quantileData = sortBy(this.quantileData);
  }

  get boxPlotDataGetter() {
    return this.boxPlotData();
  }

  boxPlotData() {
    const boxPlotData = {
      type: 'Class',
      metricName: `${this.category.toLowerCase()}${this.metricName[0].toUpperCase()}${this.metricName.slice(
        1
      )}`,
      quartile: [
        round(d3.quantile(this.quantileData, 0.25), 4) === 0
          ? 0.0001
          : round(d3.quantile(this.quantileData, 0.25), 4),
        round(d3.quantile(this.quantileData, 0.5), 4) === 0
          ? 0.0001
          : round(d3.quantile(this.quantileData, 0.5), 4),
        round(d3.quantile(this.quantileData, 0.75), 4) === 0
          ? 0.0001
          : round(d3.quantile(this.quantileData, 0.75), 4),
      ],
      whiskers: [
        round(d3.quantile(this.quantileData, 0.1), 4) === 0
          ? 0.0001
          : round(d3.quantile(this.quantileData, 0.1), 4),
        round(d3.quantile(this.quantileData, 0.9), 4) === 0
          ? 0.0001
          : round(d3.quantile(this.quantileData, 0.9), 4),
      ],
    };

    return boxPlotData;
  }
}

export const nonDimValues = async (req, metrics) => {
  const nonDimArray = [],
    avgFlow = await AllYear.findAll({
      attributes: ['average'],
      where: {
        '$gauge.classId$': req.body.classId,
      },
      include: [
        {
          model: Gauge,
          as: 'gauge',
          attributes: ['id'],
        },
      ],
    });

  metrics.forEach(metric => {
    //This will output the datastructure similar to sequelize
    //which will be input into class method
    nonDimArray.push({[req.body.metric]: []});
    const averageArray = find(
      avgFlow,
      d => d.gauge.id === Number(metric.gauge.id)
    );
    averageArray.average.forEach((v, i) => {
      if (!isNaN(Number(v)) && !isNaN(Number(metric[req.body.metric][i]))) {
        nonDimArray[nonDimArray.length - 1][req.body.metric].push(
          Number(metric[req.body.metric][i]) / Number(v)
        );
      }
    });
  });
  return nonDimArray;
};

export const getGaugeBoxPlotObject = (metricArray, metricName, category) => {
  const filteredMetricArray = removeNaN(metricArray),
    boxPlotAttributes = {
      type: 'Gauge',
      metricName: `${category.toLowerCase()}${metricName[0].toUpperCase()}${metricName.slice(
        1
      )}`,
      quartile: [
        round(d3.quantile(filteredMetricArray, 0.25), 4) === 0
          ? 0.0001
          : round(d3.quantile(filteredMetricArray, 0.25), 4),
        round(d3.quantile(filteredMetricArray, 0.5), 4) === 0
          ? 0.0001
          : round(d3.quantile(filteredMetricArray, 0.5), 4),
        round(d3.quantile(filteredMetricArray, 0.75), 4) === 0
          ? 0.0001
          : round(d3.quantile(filteredMetricArray, 0.75), 4),
      ],
      whiskers: [
        round(d3.quantile(filteredMetricArray, 0.1), 4) === 0
          ? 0.0001
          : round(d3.quantile(filteredMetricArray, 0.1), 4),
        round(d3.quantile(filteredMetricArray, 0.9), 4) === 0
          ? 0.0001
          : round(d3.quantile(filteredMetricArray, 0.9), 4),
      ],
    };
  return boxPlotAttributes;
};

export const gaugeNonDimValues = async (req, metric) => {
  const nonDimArray = [],
    avgFlow = await AllYear.findAll({
      attributes: ['average'],
      where: {
        gaugeId: req.body.gaugeId,
      },
    });
  metric[0][req.body.metric].forEach((v, i) => {
    if (!isNaN(Number(v)) && !isNaN(Number(avgFlow[0].average[i]))) {
      nonDimArray.push(Number(v) / Number(avgFlow[0].average[i]));
    }
  });
  return [{[req.body.metric]: nonDimArray}];
};

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
  calculatePercentile();
};
