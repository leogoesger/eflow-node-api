import {FallWinter, Condition} from '../models';

import {getBoxPlotHelper} from './shared';

module.exports = {
  show(req, res) {
    return FallWinter.find({gaugeId: req.body.gaugeId})
      .then(allYear => res.status(200).send(allYear))
      .catch(err => res.status(400).send(err));
  },

  async getBoxPlotAttributes(req, res) {
    if (!req.body.metric && Boolean(!req.body.gaugeId || !req.body.classId)) {
      res.status(400).send({message: 'Missing attributes'});
    }
    const data = await Condition.findOne({
      where: {gaugeId: req.body.gaugeId},
    });
    let conditions;
    if (data) {
      conditions = data.conditions;
    }
    getBoxPlotHelper(
      req,
      res,
      FallWinter,
      'FallWinter',
      conditions,
      req.body.condition
    );
  },
};
