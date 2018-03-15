import {Gauge} from '../models';
import {Hydrograph} from '../models';

module.exports = {
  create(req, res) {
    Gauge.create(req.body)
      .then(gauge => res.status(201).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  index(req, res) {
    return Gauge.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    })
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Gauge.findById(req.params.gaugeId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'geometry'],
      },
      include: [{model: Hydrograph, as: 'hydrographs'}],
    })
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },
};
