import {AnnualFlow} from '../models';

module.exports = {
  async show(req, res) {
    if (!req.body.gaugeId) {
      return res.status(404).send({message: 'Missing Params!'});
    }
    try {
      const annualFlows = await AnnualFlow.findAll({
        where: {
          gaugeId: req.body.gaugeId,
        },
        attributes: ['year', 'flowData', 'gaugeId'],
      });
      res.status(200).send(annualFlows);
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
