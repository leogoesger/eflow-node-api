import {Fall, Condition} from '../models';

import {getBoxPlotHelper} from './shared';

module.exports = {
  show(req, res) {
    return Fall.find({gaugeId: req.body.gaugeId})
      .then(allYear => res.status(200).send(allYear))
      .catch(err => res.status(400).send(err));
  },

  async getBoxPlotAttributes(req, res) {
    if (!req.body.metric && Boolean(!req.body.gaugeId || !req.body.classId)) {
      res.status(400).send({message: 'Missing attributes'});
    }
    const {conditions} = await Condition.findOne({
      where: {gaugeId: req.body.gaugeId},
    });

    getBoxPlotHelper(req, res, Fall, 'Fall', conditions, req.body.condition);
  },
};
