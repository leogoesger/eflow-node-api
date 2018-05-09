import csv from 'csvtojson';
import request from 'request';

const Fall = require('../models').Fall;
const AllYear = require('../models').AllYear;
const FallWinter = require('../models').FallWinter;
const Spring = require('../models').Spring;
const Summer = require('../models').Summer;
const Winter = require('../models').Winter;
const Year = require('../models').Year;
const AnnualFlow = require('../models').AnnualFlow;
const Hydrograph = require('../models').Hydrograph;

import {metricReference} from '../static/metricReference';
import gaugeReference from '../static/gaugeReference';

const _inputFlowToDatabase = (result, file) => {
  Year.findOne({
    where: {
      gaugeId: file,
    },
  }).then(year => {
    year.update({allYears: Object.keys(result)});
  });
  Object.keys(result).forEach(key => {
    AnnualFlow.create({
      year: key,
      flowData: result[key],
      gaugeId: file,
    }).catch(e => {
      throw e;
    });
  });
};

export const uploadFlowDataToDatabase = async () => {
  console.log('Flow Data updating...'); // eslint-disable-line
  const new_url = `${process.env.S3_BUCKET}annual_flow_matrix/`;
  try {
    await AnnualFlow.destroy({where: {}});
    gaugeReference.forEach(gauge => {
      const csvFilePath = `${new_url}${gauge.id}.csv`;
      let firstRow = true;
      const result = {};
      const mapping = {};
      csv({
        noheader: true,
      })
        .fromStream(request.get(csvFilePath))
        .on('csv', csvRow => {
          if (firstRow) {
            csvRow.forEach((ele, index) => {
              result[Number(ele)] = [];
              mapping[index] = Number(ele);
              firstRow = false;
            });
          } else {
            csvRow.forEach((ele, index) => {
              result[mapping[index]].push(ele);
            });
          }
        })
        .on('done', () => {
          _inputFlowToDatabase(result, gauge.id);
        });
    });
  } catch (e) {
    throw e;
  }
};

export const uploadResultToDatabase = async () => {
  console.log('Metric Result Data updating...'); // eslint-disable-line
  const new_url = `${process.env.S3_BUCKET}annual_flow_result/`;
  try {
    await Year.destroy({where: {}});
    await AllYear.destroy({where: {}});
    await Fall.destroy({where: {}});
    await Winter.destroy({where: {}});
    await Summer.destroy({where: {}});
    await Spring.destroy({where: {}});
    await FallWinter.destroy({where: {}});

    gaugeReference.forEach(gauge => {
      const csvFilePath = `${new_url}${gauge.id}_annual_result_matrix.csv`;
      const current_result = {
        Year: {},
        AllYear: {},
        Spring: {},
        Summer: {},
        Fall: {},
        FallWinter: {},
        Winter: {},
      };
      csv({
        noheader: true,
      })
        .fromStream(request.get(csvFilePath))
        .on('csv', csvRow => {
          if (!metricReference[`${csvRow[0]}`]) {
            return;
          }
          const seasonName = metricReference[`${csvRow[0]}`][0];
          const dataEntryName = metricReference[`${csvRow[0]}`][1];
          current_result[seasonName][dataEntryName] = csvRow.slice(1);
          current_result[seasonName].gaugeId = gauge.id;
        })
        .on('done', () => {
          Year.create(current_result.Year);
          AllYear.create(current_result.AllYear);
          Spring.create(current_result.Spring);
          Summer.create(current_result.Summer);
          Fall.create(current_result.Fall);
          FallWinter.create(current_result.FallWinter);
          Winter.create(current_result.Winter);
        });
    });
  } catch (e) {
    throw e;
  }
};

const PERCENTILLE = ['TEN', 'TWENTYFIVE', 'FIFTY', 'SEVENTYFIVE', 'NINTY'];
export const uploadClassHydrographToDatabase = async () => {
  console.log('Class Hydrograph Data updating...'); // eslint-disable-line
  const new_url = `${process.env.S3_BUCKET}DRH_Class/`;
  try {
    await Hydrograph.destroy({where: {type: 'CLASS'}});
    const classNames = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    classNames.forEach(classNumber => {
      const csvFilePath = `${new_url}Class_${classNumber}_aggregate.csv`;
      csv({
        noheader: true,
      })
        .fromStream(request.get(csvFilePath))
        .on('csv', (csvRow, rowIndex) => {
          Hydrograph.create({
            data: csvRow,
            classId: classNumber,
            percentille: PERCENTILLE[rowIndex],
            type: 'CLASS',
          });
        });
    });
  } catch (e) {
    throw e;
  }
};

export const uploadGaugeHydrographToDatabase = async () => {
  console.log('Gauge Hydrograph Data updating...'); // eslint-disable-line
  const new_url = `${process.env.S3_BUCKET}DRH_Gauge/`;
  try {
    await Hydrograph.destroy({where: {type: 'GAUGE'}});
    gaugeReference.forEach(gauge => {
      const csvFilePath = `${new_url}plot_data_${gauge.id}.csv`;
      csv({
        noheader: true,
      })
        .fromStream(request.get(csvFilePath))
        .on('csv', (csvRow, rowIndex) => {
          Hydrograph.create({
            data: csvRow,
            gaugeId: gauge.id,
            percentille: PERCENTILLE[rowIndex],
            type: 'GAUGE',
          });
        });
    });
  } catch (e) {
    throw e;
  }
};
