import csv from 'csvtojson';
import fs from 'fs';

const Gauge = require('../models').Gauge;
const Fall = require('../models').Fall;
const AllYear = require('../models').AllYear;
const FallWinter = require('../models').FallWinter;
const Spring = require('../models').Spring;
const Summer = require('../models').Summer;
const Winter = require('../models').Winter;
const Year = require('../models').Year;
const AnnualFlow = require('../models').AnnualFlow;

import regular_gauges from '../public/gaugeReference';
import metricReference from '../public/metricReference';

const _getFileNameList = dir => {
  return new Promise(resolve => {
    fs.readdir(dir, (err, filenames) => {
      const nameList = filenames.reduce(filename => filename.includes('.csv'));
      resolve(nameList);
    });
  });
};

export const uploadFlowDataToDatabase = async () => {
  console.log('Uploading Flow Data to Database...'); // eslint-disable-line
  try {
    await AnnualFlow.destroy({where: {}});
    fs.readdir('src/public/annual_flow_matrix', (err, filenames) => {
      filenames.forEach(filename => {
        if (!filename.includes('.csv')) {
          return;
        }
        let firstRow = true;
        const result = {};
        const mapping = {};
        csv({
          noheader: true,
        })
          .fromFile(`src/public/annual_flow_matrix/${filename}`)
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
            Object.keys(result).forEach(key => {
              AnnualFlow.create({
                year: key,
                flowData: result[key],
                gaugeId: Number(filename.slice(0, -4)),
              });
            });
          });
      });
    });
  } catch (e) {
    throw e;
  }
};

export const uploadResultToDatabase = async () => {
  console.log('Uploading Result to Database...'); // eslint-disable-line
  try {
    await Gauge.destroy({where: {}});
    await Gauge.bulkCreate(regular_gauges);
    fs.readdir('src/public/annual_result_matrix', (err, filenames) => {
      filenames.forEach(file => {
        if (!file.includes('.csv')) {
          return;
        }
        const csvFilePath = `src/public/annual_result_matrix/${file}`;
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
          .fromFile(csvFilePath)
          .on('csv', csvRow => {
            const seasonName = metricReference[`${csvRow[0]}`][0];
            const dataEntryName = metricReference[`${csvRow[0]}`][1];
            current_result[seasonName][dataEntryName] = csvRow.slice(1);
            current_result[seasonName].gaugeId = Number(file.slice(0, -25));
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
    });
  } catch (e) {
    throw e;
  }
};
