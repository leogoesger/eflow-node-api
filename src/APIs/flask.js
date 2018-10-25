import request from 'superagent';
import {UploadData} from '../models';
import {FailedUpload} from '../models';

module.exports = {
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
<<<<<<< HEAD
      } = JSON.parse(response.body);
=======
      } = response.body;
>>>>>>> FF-359 upload FailedUpload on error

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
      }).then(d => res.status(200).send(d));
    } catch (e) {
      FailedUpload.create({
        flows: req.body.flows,
        dates: req.body.dates,
        userId: req.user.id,
        name: req.body.name,
      })
        .then(d => res.status(400).send({error: e.toString(), data: d}))
        .catch(() => res.status(400).send(e.toString()));
    }
  },
};
