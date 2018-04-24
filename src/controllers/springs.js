import {Spring} from '../models';
import {getBoxPlotHelper} from './shared';

module.exports = {
  show(req, res) {
    return Spring.find({gaugeId: req.body.gaugeId})
      .then(allYear => res.status(200).send(allYear))
      .catch(err => res.status(400).send(err));
  },

  getBoxPlotAttributes(req, res) {
    if (!req.body.metric && Boolean(!req.body.gaugeId || !req.body.classId)) {
      res.status(400).send({message: 'Missing attributes'});
    }
    getBoxPlotHelper(req, res, Spring, 'Spring');
  },
};
