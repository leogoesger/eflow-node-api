const Op = require('sequelize').Op;
const sequelize = require('sequelize');

import {Gauge, Hydrograph, Year} from '../models';

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
      include: [
        {model: Hydrograph, as: 'hydrographs'},
        {
          model: Year,
          as: 'years',
          attributes: ['allYears'],
        },
      ],
    })
      .then(gauge => {
        console.log(gauge.get({plain: true}));
        res.status(200).send(gauge);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
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
};
