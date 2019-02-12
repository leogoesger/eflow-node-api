import {
  getGaugeBoxPlotObject,
  ClassBoxPlot,
  nonDimValues,
  gaugeNonDimValues,
  getJulianOffsetDate,
} from '../utils/helpers';
import {Gauge, Condition} from '../models';

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY
      ? process.env.MAILGUN_API_KEY
      : 'abcdefghi',
    domain: process.env.MAILGUN_DOMAIN
      ? process.env.MAILGUN_DOMAIN
      : 'abcdefghi',
  },
};

export const nodeMailerMailgun = nodemailer.createTransport(mg(auth));

const setRedis = (req, nonDim, type, data) => {
  const dimHolder = nonDim ? 'nonDim' : 'dim';
  req.client.set(
    `${req.body[type]}_${req.tableName}_${req.body
      .metric}_${dimHolder}_boxplot_${req.body.condition}`,
    JSON.stringify(data),
    'EX',
    process.env.REDIS_TIMER
  );
};

export const getBoxPlotHelper = async (
  req,
  res,
  classModel,
  tableName,
  conditions,
  condition
) => {
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
            include: [
              {
                model: Condition,
                as: 'conditions',
              },
            ],
          },
        ],
      });

      //Non dimensionalize all metrics except timings ones
      if (req.body.metric && req.body.metric.includes('timing')) {
        fallMetric.forEach(metric => {
          const gaugeConditions =
            metric.gauge.conditions[0] && metric.gauge.conditions[0].conditions;
          const arrayWithNull = metric[req.body.metric].map(d => {
            if (!isNaN(Number(d))) {
              return getJulianOffsetDate(Number(d));
            }
            return null;
          });
          metric[req.body.metric] = arrayWithNull.filter(d => d);
          // removing by conditions
          if (condition && gaugeConditions && gaugeConditions.length > 0) {
            metric[req.body.metric] = metric[
              req.body.metric
            ].filter((d, index) => {
              return gaugeConditions[index] === condition;
            });
          }
        });
      } else if (
        req.body.metric &&
        !req.body.metric.includes('timing') &&
        req.body.nonDim
      ) {
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

    if (req.body.metric.includes('timing')) {
      const arrayWithNull = metric[0][req.body.metric].map(d => {
        if (!isNaN(Number(d))) {
          return getJulianOffsetDate(Number(d));
        }
        return null;
      });
      metric[0][req.body.metric] = arrayWithNull.filter(d => d);
    }

    if (!req.body.metric.includes('timing')) {
      metric = await gaugeNonDimValues(req, metric);
    }

    const boxPlotAttributes = getGaugeBoxPlotObject(
      metric[0][req.body.metric],
      req.body.metric,
      tableName,
      conditions,
      condition
    );

    if (process.env.NODE_ENV !== 'test') {
      setRedis(req, req.body.nonDim, 'gaugeId', boxPlotAttributes);
    }

    return res.status(200).send(boxPlotAttributes);
  } catch (e) {
    res.status(400).send(e.toString());
  }
};

export const getAllBoxPlotHelper = async (
  req,
  res,
  condition,
  classModel,
  tableName,
  classId,
  classMetric
) => {
  try {
    const metrics = await classModel.findAll({
      attributes: [classMetric],
      where: {
        '$gauge.classId$': classId,
      },
      include: [
        {
          model: Gauge,
          as: 'gauge',
          attributes: ['id'],
          include: [
            {
              model: Condition,
              as: 'conditions',
            },
          ],
        },
      ],
    });

    metrics.forEach((metric, idx) => {
      const gaugeConditions =
        metric.gauge.conditions[0] && metric.gauge.conditions[0].conditions;
      const arrayWithNull = metric[classMetric].map(d => {
        if (!isNaN(Number(d))) {
          return getJulianOffsetDate(Number(d));
        }
        return null;
      });
      metric[classMetric] = arrayWithNull.filter(d => d);
      // removing by conditions
      if (
        condition !== 'ALL' &&
        gaugeConditions &&
        gaugeConditions.length > 0
      ) {
        metric[classMetric] = metric[classMetric].filter((d, index) => {
          return gaugeConditions[index] === condition;
        });
      }
      metrics[idx] = metric;
    });

    const boxPlotClass = new ClassBoxPlot(metrics, classMetric, tableName)
      .boxPlotDataGetter;

    return boxPlotClass;
  } catch (err) {
    return res.status(400).send(err);
  }
};
