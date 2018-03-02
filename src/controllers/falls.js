import {Fall} from '../models';

module.exports = {
  show(req, res) {
    return Fall.find({gaugeId: req.body.gaugeId})
      .then(allYear => res.status(200).send(allYear))
      .catch(err => res.status(400).send(err));
  },
};
