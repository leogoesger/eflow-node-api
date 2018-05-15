import {
  getGaugeBoxPlotObject,
  ClassBoxPlot,
  nonDimValues,
  gaugeNonDimValues,
} from '../utils/helpers';
import {Gauge} from '../models';

const setRedis = (req, nonDim, type, data) => {
  const dimHolder = nonDim ? 'nonDim' : 'dim';
  req.client.set(
    `${req.body[type]}_${req.tableName}_${req.body
      .metric}_${dimHolder}_boxplot`,
    JSON.stringify(data),
    'EX',
    process.env.REDIS_TIMER
  );
};

export const getBoxPlotHelper = async (req, res, classModel, tableName) => {
  try {
    //Search based on classId
    if (req.body.classId) {
      let fallMetric = await classModel.findAll({
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
      if (!req.body.metric.includes('timing') && req.body.nonDim) {
        fallMetric = await nonDimValues(req, fallMetric);
      }

      const boxPlotClass = new ClassBoxPlot(
        fallMetric,
        req.body.metric,
        tableName
      ).boxPlotDataGetter;

      if (process.env.NODE_ENV !== 'test') {
        setRedis(req, req.body.nonDim, 'classId', boxPlotClass);
      }

      return res.status(200).send(boxPlotClass);
    }

    //Search based on gaugeId
    let metric = await classModel.findAll({
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
      tableName
    );

    if (process.env.NODE_ENV !== 'test') {
      setRedis(req, req.body.nonDim, 'gaugeId', boxPlotAttributes);
    }

    return res.status(200).send(boxPlotAttributes);
  } catch (e) {
    res.status(400).send(e.toString());
  }
};
