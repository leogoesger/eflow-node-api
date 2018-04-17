import * as d3 from 'd3';
import {sortBy, find} from 'lodash';
import {AllYear, Gauge} from '../models';

export const removeNaN = array => {
  const filteredArray = array.filter(ele => !isNaN(Number(ele)));
  return sortBy(filteredArray.map(Number));
};

export const getGaugeBoxPlotObject = (metricArray, metricName, category) => {
  const filteredMetricArray = removeNaN(metricArray),
    boxPlotAttributes = {
      type: 'Gauge',
      metricName: `${category.toLowerCase()}${metricName[0].toUpperCase()}${metricName.slice(
        1
      )}`,
      quartile: [
        d3.quantile(filteredMetricArray, 0.25),
        d3.quantile(filteredMetricArray, 0.5),
        d3.quantile(filteredMetricArray, 0.75),
      ],
      whiskers: [
        d3.quantile(filteredMetricArray, 0.1),
        d3.quantile(filteredMetricArray, 0.9),
      ],
    };
  return boxPlotAttributes;
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
        d3.quantile(this.quantileData, 0.25),
        d3.quantile(this.quantileData, 0.5),
        d3.quantile(this.quantileData, 0.75),
      ],
      whiskers: [
        d3.quantile(this.quantileData, 0.1),
        d3.quantile(this.quantileData, 0.9),
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
