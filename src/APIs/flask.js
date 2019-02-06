import request from 'superagent';
import {UploadData, Prediction, User} from '../models';
import {nodeMailerMailgun} from '../controllers/shared';

import {getMetrics, getClassPredictions} from './helpers';

module.exports = {
  async predictClass(req, res) {
    try {
      const id = req.body.id;
      const data = await UploadData.findById(id);
      let metric = getMetrics(data);

      // console.log(metric);
      metric = metric[0].map((col, i) => metric.map(row => row[i]));

      const response = await request
        .post(`${process.env.FLASK_SERVER_ADDRESS}/api/class-predict`)
        .send({metric});

      const d = getClassPredictions(JSON.parse(response.body));

      const pred_ins = await Prediction.create({
        prediction: d.predictClass,
        ...d.classPredictions,
        uploadDataId: id,
      }).catch(e => res.status(400).send(e.toString()));
      res.status(200).send(pred_ins);
    } catch (error) {
      res.status(400).send(error.toString());
    }
  },
  async calculateMetrics(req, res) {
    try {
      const response = await request
        .post(`${process.env.FLASK_SERVER_ADDRESS}/api`)
        .send(req.body);

      const {
        flow_matrix,
        start_date,
        DRH,
        all_year,
        winter,
        fall,
        summer,
        spring,
        fall_winter,
        year_ranges,
      } = JSON.parse(response.body);

      UploadData.create({
        flowMatrix: flow_matrix,
        startDate: start_date,
        DRH,
        allYear: all_year,
        winter,
        fall,
        summer,
        spring,
        userId: req.user.id,
        fallWinter: fall_winter,
        name: req.body.name,
        yearRanges: year_ranges,
        flows: req.body.flows,
        dates: req.body.dates,
        failed: false,
      }).then(d => res.status(200).send(d));
    } catch (e) {
      const user = await User.findById(req.user.id);
      const mailOptions = {
        from: 'Leo Qiu <leoq91@gmail.com>',
        to: 'funcflow@gmail.com',
        subject: 'UC Davis Eflow Failed Upload',
        html: `
        <div>
          <div>There is an error uploading data from user ${user.firstName}, ${
          user.lastName
        } with ${user.email}</div>
          <div>Dates: ${JSON.stringify(req.body.dates)}</div>
          <div>Flows: ${JSON.stringify(req.body.flows)}</div>
        </div>`,
      };

      if (process.env.NODE_ENV) {
        nodeMailerMailgun.sendMail(mailOptions, error => {
          if (error) {
            throw error;
          }
        });
      }

      UploadData.create({
        flows: req.body.flows,
        startDate: req.body.start_date,
        dates: req.body.dates,
        userId: req.user.id,
        name: req.body.name,
        failed: true,
      })
        .then(d => res.status(400).send({error: e.toString(), data: d}))
        .catch(_ => {
          res.status(400).send(e.toString());
        });
    }
  },
};
