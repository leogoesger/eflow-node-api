import request from 'superagent';
import {UploadData} from '../models';

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
      } = response.body;
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
      res.status(400).send(e.toString());
    }
  },
};