import * as models from '../models';
import {getBoxPlotHelper} from './shared';
import {metricReferenceAs} from '../static/metricReference';

const getClassData = async (req, res, tableName, columnName) => {
  const promises = [];
  const classModel = models[tableName.slice(0, tableName.length - 1)];
  req.body.nonDim = false;

  for (let i = 1; i < 10; i++) {
    promises.push(
      getBoxPlotHelper(
        req,
        res,
        classModel,
        tableName,
        null,
        null,
        i,
        columnName
      )
    );
  }
  return Promise.all(promises);
};

const setRedis = (req, data) => {
  req.client.set(
    'NON_DIM_ALL_BOXPLOTS',
    JSON.stringify(data),
    'EX',
    process.env.REDIS_TIMER
  );
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

    if (process.env.NODE_ENV !== 'test') {
      setRedis(req, classes);
    }

    return res.status(200).send(classes);
  },
};
