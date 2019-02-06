import csv from 'csvtojson';
import request from 'request';
import {
  Fall,
  AllYear,
  FallWinter,
  UploadData,
  Spring,
  Summer,
  Winter,
  Year,
  AnnualFlow,
  Hydrograph,
  Condition,
  User,
} from '../models';

import {
  calculatePercentileClourse,
  updateGaugePercentiles,
} from '../utils/calculatePercentiles';
import {metricReference} from '../static/metricReference';
import gaugeReference from '../static/gaugeReference';
import {inputFlowToDatabase} from '../utils/uploadToDatabase';
// import S3 from '../utils/S3';

const PERCENTILLE = [
  'TEN',
  'TWENTYFIVE',
  'FIFTY',
  'SEVENTYFIVE',
  'NINTY',
  'MIN',
  'MAX',
];

module.exports = {
  async uploadFlowData(req, res) {
    const new_url = `${process.env.S3_BUCKET}annual_flow_matrix/`;
    const promises = [];
    try {
      await AnnualFlow.destroy({where: {}});
      gaugeReference.forEach(gauge => {
        const csvFilePath = `${new_url}${gauge.id}.csv`;
        let firstRow = true;
        const result = {};
        const mapping = {};
        promises.push(
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
              inputFlowToDatabase(result, gauge.id);
            })
        );
      });
      Promise.all(promises).then(() =>
        res.status(200).send({message: 'Flow Data Uploaded!'})
      );
    } catch (e) {
      res.status(400).send({message: e.toString()});
    }
  },

  async uploadAnnualCondition(req, res) {
    const url = `${process.env.S3_BUCKET}annual_conditions/`;
    const promises = [];
    await Condition.destroy({where: {}});

    const files = gaugeReference.map(d => `${url}${d.id}.csv`);

    files.forEach(file => {
      const annual_conditions = {
        gaugeId: file.split('/')[5].split('.')[0],
        conditions: [],
      };

      csv({
        noheader: false,
      })
        .fromStream(request.get(file))
        .on('csv', csvRow => {
          if (csvRow[1] === 'nan') {
            annual_conditions.conditions.push('NOT AVAILABLE');
          } else {
            annual_conditions.conditions.push(csvRow[1].toUpperCase());
          }
        })
        .on('done', () => {
          promises.push(Condition.create(annual_conditions));
        });
    });

    Promise.all(promises)
      .then(() => res.status(200).send({message: 'success'}))
      .catch(e => res.status(404).send({message: e.toString()}));
  },

  // async uploadAnnualCondition(req, res) {
  //   // const url = `${process.env.S3_BUCKET}annual_conditions/`;
  //   await Condition.destroy({where: {}});
  //   const folder = encodeURIComponent('annual_conditions') + '/';
  //   S3.listObjects({Prefix: folder}, (err, data) => {
  //     const files = data.Contents
  //       .map(f => f.Key)
  //       .filter((f, i) => i !== 0)
  //       .map(f => `${process.env.S3_BUCKET}${f}`);

  //     const promises = [];

  //     files.forEach(file => {
  //       const annual_conditions = {
  //         gaugeId: file.split('/')[5].split('.')[0],
  //         conditions: [],
  //       };

  //       csv({
  //         noheader: false,
  //       })
  //         .fromStream(request.get(file))
  //         .on('csv', csvRow => {
  //           if (csvRow[1] === 'nan') {
  //             annual_conditions.conditions.push('NOT AVAILABLE');
  //           } else {
  //             annual_conditions.conditions.push(csvRow[1].toUpperCase());
  //           }
  //         })
  //         .on('done', () => {
  //           promises.push(Condition.create(annual_conditions));
  //         });
  //     });

  //     Promise.all(promises)
  //       .then(() => res.status(200).send({message: 'success'}))
  //       .catch(e => res.status(404).send({message: e.toString()}));
  //   });
  // },

  async uploadMetricResult(req, res) {
    const new_url = `${process.env.S3_BUCKET}annual_flow_result/`;
    try {
      const destoryPromises = [
        Year.destroy({where: {}}),
        AllYear.destroy({where: {}}),
        Fall.destroy({where: {}}),
        Winter.destroy({where: {}}),
        Summer.destroy({where: {}}),
        Spring.destroy({where: {}}),
        FallWinter.destroy({where: {}}),
      ];
      await Promise.all(destoryPromises);

      const promises = [];
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
        promises.push(
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
            })
        );
      });
      Promise.all(promises).then(() =>
        res.status(200).send({message: 'Metric Result Uploaded!'})
      );
    } catch (e) {
      res.status(400).send({message: e.toString()});
    }
  },

  async uploadClassHydrograph(req, res) {
    const new_url = `${process.env.S3_BUCKET}DRH_Class/`;
    try {
      await Hydrograph.destroy({where: {type: 'CLASS'}});
      const classNames = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const promises = [];
      classNames.forEach(classNumber => {
        const csvFilePath = `${new_url}Class_${classNumber}_aggregate.csv`;
        promises.push(
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
            })
        );
      });
      return Promise.all(promises).then(() =>
        res.status(200).send({message: 'Class Hydrograph Uploaded!'})
      );
    } catch (e) {
      res.status(400).send({message: e.toString()});
    }
  },

  async uploadGaugeHydrograph(req, res) {
    const new_url = `${process.env.S3_BUCKET}DRH_Gauge/`;
    const promises = [];
    try {
      await Hydrograph.destroy({where: {type: 'GAUGE'}});
      gaugeReference.forEach(gauge => {
        const csvFilePath = `${new_url}plot_data_${gauge.id}.csv`;
        promises.push(
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
            })
        );
      });
      return Promise.all(promises).then(() =>
        res.status(200).send({message: 'Gauge Hydrograph Uploaded!'})
      );
    } catch (e) {
      res.status(400).send({message: e.toString()});
    }
  },

  async updateClassMetricData(req, res) {
    try {
      await calculatePercentileClourse(1);
      res.status(200).send('success');
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },

  updateGaugeMetricData(req, res) {
    try {
      updateGaugePercentiles(req.params.id).then(() =>
        res.status(200).send('Success')
      );
    } catch (error) {
      throw error;
    }
  },

  broadcastDownServerMsg(req, res, io) {
    io.emit('msg', req.body.message);
    res.status(200).send({message: req.body.message});
  },

  getUploads(req, res) {
    UploadData.findAll({
      limit: 10,
      where: {failed: false},
      attributes: ['flows', 'dates', 'id', 'name', 'createdAt'],
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName', 'id', 'role'],
        },
      ],
    })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(_ => {
        res.status(404).send({message: 'Invalid Submission'});
      });
  },

  failedUploads(req, res) {
    UploadData.findAll({
      limit: 10,
      where: {failed: true},
      attributes: ['flows', 'dates', 'id', 'name', 'createdAt'],
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName', 'id', 'role'],
        },
      ],
    })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(_ => {
        res.status(404).send({message: 'Invalid Submission'});
      });
  },
};
