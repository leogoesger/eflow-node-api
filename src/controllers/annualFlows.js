import {indexOf} from 'lodash';
import {
  AnnualFlow,
  AllYear,
  Fall,
  FallWinter,
  Spring,
  Summer,
  Winter,
  Year,
  Gauge,
} from '../models';

import {metricReferenceAs} from '../static/metricReference';

const models = {
  Falls: Fall,
  FallWinters: FallWinter,
  Springs: Spring,
  Summers: Summer,
  Winters: Winter,
  AllYears: AllYear,
};

module.exports = {
  async show(req, res) {
    if (!req.body.gaugeId) {
      return res.status(404).send({message: 'Missing Params!'});
    }
    try {
      const annualFlowData = {},
        promises = [],
        years = await Year.find({where: {gaugeId: req.body.gaugeId}});

      const yearIndex = req.body.year
        ? indexOf(years.year, Number(req.body.year))
        : 0;

      metricReferenceAs.forEach(metric => {
        promises.push(
          models[metric.tableName]
            .find({where: {gaugeId: req.body.gaugeId}})
            .then(d => {
              annualFlowData[metric.tableName] = {};
              const columns = metricReferenceAs.filter(
                m => m.tableName === metric.tableName
              );

              columns.forEach(column => {
                annualFlowData[metric.tableName][column.columnName] =
                  d[column.columnName][yearIndex] === 0
                    ? 0.01
                    : d[column.columnName][yearIndex];
              });
            })
        );
      });

      promises.push(
        Gauge.find({
          where: {
            id: req.body.gaugeId,
          },
          attributes: [
            'id',
            'stationName',
            'unimpairedStartYear',
            'unimpairedEndYear',
            'classId',
          ],
        }).then(d => {
          annualFlowData.Gauge = d;
        })
      );

      promises.push(
        AnnualFlow.find({
          where: {
            gaugeId: req.body.gaugeId,
            year: years.year[yearIndex],
          },
          attributes: ['year', 'flowData', 'gaugeId'],
        }).then(result => {
          const newData = result.flowData.map(d => {
            return Number(d) === 0 ? 0.01 : d;
          });
          result.flowData = newData;
          annualFlowData.AnnualFlows = result;
          annualFlowData.Years = years;
        })
      );

      Promise.all(promises).then(() => {
        let cacheKey = `${req.path}_`;
        Object.keys(req.body).forEach(key => {
          cacheKey = cacheKey + key + req.body[key];
        });
        req.client.set(cacheKey, JSON.stringify(annualFlowData));
        res.status(200).send(annualFlowData);
      });
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
