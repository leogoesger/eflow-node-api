import {Fall, Gauge} from '../models';
import {
  getGaugeBoxPlotObject,
  ClassBoxPlot,
  nonDimValues,
  gaugeNonDimValues,
} from '../utils/helpers';

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
    try {
      //Search based on classId
      if (req.body.classId) {
        let fallMetric = await Fall.findAll({
          attributes: [req.body.metric],
          where: {
            '$gauge.classId$': req.body.classId,
          },
          include: [
            {
              model: Gauge,
              as: 'gauge',
              attributes: ['id'],
            },
          ],
        });

        //Non dimensionalize all metrics except timings ones
        if (!req.body.metric.includes('timing')) {
          fallMetric = await nonDimValues(req, fallMetric);
        }

        const boxPlotClass = new ClassBoxPlot(
          fallMetric,
          req.body.metric,
          'Fall'
        ).boxPlotDataGetter;

        return res.status(200).send(boxPlotClass);
      }

      //Search based on gaugeId
      let metric = await Fall.findAll({
        attributes: [req.body.metric],
        where: {
          gaugeId: req.body.gaugeId,
        },
      });
      if (!req.body.metric.includes('timing')) {
        metric = await gaugeNonDimValues(req, metric);
      }
      const boxPlotAttributes = getGaugeBoxPlotObject(
        metric[0][req.body.metric],
        req.body.metric,
        'Fall'
      );

      return res.status(200).send(boxPlotAttributes);
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
