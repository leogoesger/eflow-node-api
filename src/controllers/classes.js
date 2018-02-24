const Gauge = require('../models').Gauge;
const Year = require('../models').Year;

module.exports = {
  create(req, res) {
    Gauge.create(req.body)
      .then(gauge => res.status(201).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  list(req, res) {
    return Gauge.findAll({
      include: [{modal: Year, as: 'years'}],
    })
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Gauge.findById(req.params.gaugeId, {
      include: [{modal: Year, as: 'years'}],
    })
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },
};
