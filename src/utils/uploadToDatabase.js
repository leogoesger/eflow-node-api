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

export const uploadFlowDataToDatabase2 = () => {
  console.log('Uploading Flow Data to Database...'); // eslint-disable-line
  AnnualFlow.destroy({where: {}}).then(() => {
    let firstRow = true;
    const result = {};
    const mapping = {};
    csv({
      noheader: true,
    })
      .fromFile('src/public/10255800_annual_result_matrix.csv')
      .on('csv', csvRow => {
        if (firstRow) {
          csvRow.forEach((ele, index) => {
            result[ele] = [];
            mapping[index] = ele;
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
            gaugeId: 10255800,
          });
        });
      });
  });
};

export const uploadFlowDataToDatabase = () => {
  console.log('Uploading Flow Data to Database...'); // eslint-disable-line
  AnnualFlow.destroy({where: {}}).then(() => {
    new Promise(resolve => {
      fs.readdir('src/public/annual_flow_matrix', (err, filenames) => {
        resolve(filenames);
      });
    }).then(filenames => {
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
  });
};

export const uploadResultToDatabase = () => {
  console.log('Uploading Result to Database...'); // eslint-disable-line
  Gauge.destroy({where: {}}).then(() => {
    Gauge.bulkCreate(regular_gauges)
      .then(() => {
        new Promise(resolve => {
          return fs.readdir(
            'src/public/annual_result_matrix',
            (err, filenames) => {
              resolve(filenames);
            }
          );
        }).then(filenames => {
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
      })
      .catch(err => {
        return err;
      });
  });
};
