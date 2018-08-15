import * as d3 from 'd3';
import {sortBy, find} from 'lodash';
import {AllYear, Gauge} from '../models';

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

export function getJulianOffsetDate(julianDate) {
  let offsetJulianDate;
  if (julianDate < 274) {
    offsetJulianDate = julianDate + 365 - 274;
  } else {
    offsetJulianDate = julianDate - 274;
  }
  if (offsetJulianDate > 365) {
    offsetJulianDate = offsetJulianDate - 365;
  }
  return offsetJulianDate;
}

export function getCalenderDate(offsetJulianDate) {
  let julianDate;
  if (offsetJulianDate < 365 - 274) {
    julianDate = 274 + offsetJulianDate;
  } else {
    julianDate = offsetJulianDate - 365 + 274;
  }
  return julianDate;
}

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
          ? 0.01
          : round(d3.quantile(this.quantileData, 0.25), 4),
        round(d3.quantile(this.quantileData, 0.5), 4) === 0
          ? 0.01
          : round(d3.quantile(this.quantileData, 0.5), 4),
        round(d3.quantile(this.quantileData, 0.75), 4) === 0
          ? 0.01
          : round(d3.quantile(this.quantileData, 0.75), 4),
      ],
      whiskers: [
        round(d3.quantile(this.quantileData, 0.1), 4) === 0
          ? 0.01
          : round(d3.quantile(this.quantileData, 0.1), 4),
        round(d3.quantile(this.quantileData, 0.9), 4) === 0
          ? 0.01
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

export const getGaugeBoxPlotObject = (
  metricArray,
  metricName,
  category,
  conditions,
  condition
) => {
  const filteredMetricArray = removeNaN(metricArray).filter((v, index) => {
    if (!condition || !conditions || conditions.length < 0) {
      return true;
    }
    if (conditions[index] === condition) {
      return true;
    }
    return false;
  });
  const boxPlotAttributes = {
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
