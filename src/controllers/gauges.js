const Op = require('sequelize').Op;
const sequelize = require('sequelize');

import {Gauge} from '../models';
import {Hydrograph} from '../models';
import {updateGaugePercentiles} from '../utils/calculatePercentiles';

module.exports = {
  index(req, res) {
    return Gauge.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    })
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Gauge.findById(req.params.gaugeId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'geometry'],
      },
      include: [{model: Hydrograph, as: 'hydrographs'}],
    })
      .then(gauge => res.status(200).send(gauge))
      .catch(err => res.status(400).send(err));
  },

  search(req, res) {
    try {
      return Gauge.findAll({
        attributes: ['id', 'stationName', 'classId'],
        where: {
          [Op.or]: [
            {stationName: {[Op.iLike]: `%${req.body.keyWord}%`}},
            sequelize.where(
              sequelize.cast(sequelize.col('Gauge.id'), 'varchar'),
              {[Op.iLike]: `%${req.body.keyWord}%`}
            ),
          ],
        },
        limit: 5,
      }).then(gauges => {
        res.status(200).send(gauges);
      });
    } catch (e) {
      res.status(404).send(e.toString());
    }
  },

  updatePercentiles(req, res) {
    try {
      updateGaugePercentiles(req.params.id).then(() =>
        res.status(200).send('Success')
      );
    } catch (error) {
      throw error;
    }
  },
};
