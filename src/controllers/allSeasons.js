import * as models from '../models';
import {getAllBoxPlotHelper} from './shared';
import {metricReferenceAs} from '../static/metricReference';

const getClassData = async (req, res, tableName, columnName) => {
  const promises = [];
  const classModel = models[tableName.slice(0, tableName.length - 1)];
  req.body.nonDim = false;

  for (let classId = 1; classId < 10; classId++) {
    promises.push(
      getAllBoxPlotHelper(
        req,
        res,
        req.body.condition,
        classModel,
        tableName,
        classId,
        columnName
      )
    );
  }
  return Promise.all(promises);
};

const setRedis = (req, data) => {
  const cacheKey =
    req.body.condition === 'ALL'
      ? 'NON_DIM_ALL_BOXPLOTS'
      : `NON_DIM_ALL_BOXPLOTS_COND_${req.body.condition}`;
  req.client.set(cacheKey, JSON.stringify(data), 'EX', process.env.REDIS_TIMER);
};

module.exports = {
  async getAllClassesBoxPlotAttributes(req, res) {
    const allMetricBoxPlots = {},
      promises = [],
      map = [],
      metricReference = metricReferenceAs;

    for (let i = 0; i < metricReference.length; i++) {
      const {tableName, columnName} = metricReference[i];
      map.push({tableName, columnName});
      promises.push(getClassData(req, res, tableName, columnName));
    }
    const classes = await Promise.all(promises).then(value => {
      value.forEach((data, index) => {
        if (!allMetricBoxPlots[map[index].tableName]) {
          allMetricBoxPlots[map[index].tableName] = {};
        }
        const newClassData = data.map((d, indx) => {
          return Object.assign({}, d, {classId: indx + 1});
        });
        allMetricBoxPlots[map[index].tableName][
          map[index].columnName
        ] = newClassData;
      });
      return allMetricBoxPlots;
    });

    if (req.body.POR) {
      return allMetricBoxPlots;
    }

    if (process.env.NODE_ENV !== 'test') {
      setRedis(req, classes);
    }

    return res.status(200).send(classes);
  },

  async getBoxPlotObjPercentilePOR(req, res) {
    // if (!req.body.percentile) {
    //   return res.status(400).send({message: 'Missing Percentile'});
    // }

    try {
      req.body.POR = true;
      req.body.condition = 'ALL';
      req.body.cacheCheck = true;

      // let boxPlot = await cache(req, res, null);

      // if (!boxPlot) {
      //   console.log('getting box..');
      //   boxPlot = await module.exports.getAllClassesBoxPlotAttributes(req, res);
      //   if (process.env.NODE_ENV !== 'test') {
      //     setRedis(req, boxPlot);
      //   }
      // }
      const boxPlot = await module.exports.getAllClassesBoxPlotAttributes(
        req,
        res
      );

      const fixedYAxisObj = [];

      metricReferenceAs.forEach(metric => {
        fixedYAxisObj[metric.tableName] = {};
        fixedYAxisObj[metric.tableName][metric.columnName] = [];
        const combainedWishkers = [];
        boxPlot[metric.tableName][metric.columnName].forEach(cls => {
          combainedWishkers.push(...cls.whiskers);
        });

        fixedYAxisObj.push({
          [metric.tableName]: {
            [metric.columnName]: [
              Math.min(...combainedWishkers),
              Math.max(...combainedWishkers),
            ],
          },
        });
      });

      if (process.env.NODE_ENV !== 'test') {
        req.client.set(
          'BP_Y_AXIS_FIXED_OBJ',
          JSON.stringify({yMax: fixedYAxisObj}),
          'EX',
          process.env.REDIS_TIMER
        );
      }

      return res.status(200).send({yMax: fixedYAxisObj});
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
};
