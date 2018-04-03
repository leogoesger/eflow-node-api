import {FallWinter, Gauge} from '../models';
import {getGaugeBoxPlotObject, ClassBoxPlot} from '../utils/helpers';

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
    try {
      //Search based on classId
      if (req.body.classId) {
        const metrics = await FallWinter.findAll({
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
        const boxPlotClass = new ClassBoxPlot(
          metrics,
          req.body.metric,
          'Fall Winter'
        ).boxPlotDataGetter;

        return res.status(200).send(boxPlotClass);
      }

      //Search based on gaugeId
      const metric = await FallWinter.findAll({
          attributes: [req.body.metric],
          where: {
            gaugeId: req.body.gaugeId,
          },
        }),
        boxPlotAttributes = getGaugeBoxPlotObject(
          metric[0][req.body.metric],
          req.body.metric,
          'Fall Winter'
        );

      return res.status(200).send(boxPlotAttributes);
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
