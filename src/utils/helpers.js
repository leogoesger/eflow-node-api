import * as d3 from 'd3';
import {sortBy} from 'lodash';

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
    this.quantileData = null;
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
    this.quantileData = this.filteredData.map(data => {
      return {
        twentyFive: d3.quantile(data, 0.25),
        fifty: d3.quantile(data, 0.5),
        seventyFive: d3.quantile(data, 0.75),
      };
    });
  }

  get boxPlotDataGetter() {
    return this.boxPlotData();
  }

  boxPlotData() {
    const boxPlot = {twentyFive: [], fifty: [], seventyFive: []},
      attributeData = {};

    this.quantileData.forEach(d => {
      boxPlot.twentyFive.push(d.twentyFive);
      boxPlot.fifty.push(d.fifty);
      boxPlot.seventyFive.push(d.seventyFive);
    });

    Object.keys(boxPlot).forEach(key => {
      boxPlot[key] = sortBy(boxPlot[key]);
      attributeData[key] = {
        type: 'Class',
        metricName: `${this.category.toLowerCase()}${this.metricName[0].toUpperCase()}${this.metricName.slice(
          1
        )}`,
        quartile: [
          d3.quantile(boxPlot[key], 0.25),
          d3.quantile(boxPlot[key], 0.5),
          d3.quantile(boxPlot[key], 0.75),
        ],
        whiskers: [
          d3.quantile(boxPlot[key], 0.1),
          d3.quantile(boxPlot[key], 0.9),
        ],
      };
    });
    attributeData.metricName = this.metricName;
    return attributeData;
  }
}
