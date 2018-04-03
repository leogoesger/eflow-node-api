import * as d3 from 'd3';

export const removeNaN = array => {
  const filteredArray = array.filter(ele => !isNaN(Number(ele))).sort();
  return filteredArray;
};

export const getGaugeBoxPlotObject = (metricArray, metricName) => {
  const filteredMetricArray = removeNaN(metricArray),
    boxPlotAttributes = {
      metricName,
      count: metricArray.length,
      filteredCount: filteredMetricArray.length,
      quartile: [
        d3.quantile(filteredMetricArray, 0.25),
        d3.quantile(filteredMetricArray, 0.5),
        d3.quantile(filteredMetricArray, 0.75),
      ],
      whiskers: [
        Number(d3.min(filteredMetricArray)),
        Number(d3.max(filteredMetricArray)),
      ],
    };
  return boxPlotAttributes;
};

export class ClassBoxPlot {
  constructor(rawData, metricName) {
    this.rawData = rawData;
    this.metricName = metricName;
    this.filteredData = null;
    this.quantileData = null;
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
      boxPlot[key].sort();
      attributeData[key] = {
        quartile: [
          d3.quantile(boxPlot[key], 0.25),
          d3.quantile(boxPlot[key], 0.5),
          d3.quantile(boxPlot[key], 0.75),
        ],
        whiskers: [Number(d3.min(boxPlot[key])), Number(d3.max(boxPlot[key]))],
      };
    });
    attributeData.metricName = this.metricName;
    return attributeData;
  }
}
