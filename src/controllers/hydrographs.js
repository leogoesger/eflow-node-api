import {quantile} from 'd3';
import {sortBy} from 'lodash';

import {Hydrograph, AnnualFlow} from '../models';

module.exports = {
  show(req, res) {
    if (req.params.featureId < 1000) {
      return Hydrograph.findAll({where: {classId: req.params.featureId}})
        .then(hydrograph => res.status(200).send(hydrograph))
        .catch(err => res.status(400).send(err));
    }
    return Hydrograph.findAll({where: {gaugeId: req.params.featureId}})
      .then(hydrograph => res.status(200).send(hydrograph))
      .catch(err => res.status(400).send(err));
  },

  getDimHydrograph(req, res) {
    if (!req.params.gaugeId) {
      return res.status(404).send({message: 'Missing Params!'});
    }
    const hydrograph = {
      TEN: [],
      TWENTYFIVE: [],
      FIFTY: [],
      SEVENTYFIVE: [],
      NINTY: [],
    };
    // Add average annual flow data
    AnnualFlow.findAll({
      where: {gaugeId: req.params.gaugeId},
      attributes: ['year', 'flowData', 'gaugeId'],
    }).then(result => {
      result[0].flowData.forEach((d, index) => {
        let currentHydrograph = [];
        result.forEach(f => {
          if (
            !isNaN(Number(f.flowData[index])) &&
            Number(f.flowData[index]) !== 0
          ) {
            currentHydrograph.push(Number(f.flowData[index]));
          }
        });
        currentHydrograph = sortBy(currentHydrograph);
        hydrograph.TEN.push({
          date: index,
          flow: quantile(currentHydrograph, 0.1),
        });
        hydrograph.TWENTYFIVE.push({
          date: index,
          flow: quantile(currentHydrograph, 0.25),
        });
        hydrograph.FIFTY.push({
          date: index,
          flow: quantile(currentHydrograph, 0.5),
        });
        hydrograph.SEVENTYFIVE.push({
          date: index,
          flow: quantile(currentHydrograph, 0.75),
        });
        hydrograph.NINTY.push({
          date: index,
          flow: quantile(currentHydrograph, 0.9),
        });
      });
      res.status(200).send(hydrograph);
    });
  },
};
