import {Gauge} from '../models';
import {Year} from '../models';

module.exports = {
  create(req, res) {
    Gauge.create(req.body)
      .then(gauge => res.status(201).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  index(req, res) {
    return Gauge.findAll()
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Gauge.findAll({include: [{model: Year, as: 'years'}]})
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },
};
