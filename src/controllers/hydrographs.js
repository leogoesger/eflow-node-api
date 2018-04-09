import {Hydrograph} from '../models';

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
};
