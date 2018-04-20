import {Classification, Hydrograph, Gauge} from '../models';
import {calculatePercentileClourse} from '../utils/helpers';

module.exports = {
  create(req, res) {
    Classification.create(req.body)
      .then(classInfo => res.status(201).send(classInfo))
      .catch(err => res.status(400).send(err));
  },

  index(req, res) {
    return Classification.findAll({
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: Gauge,
          as: 'gauges',
          attributes: [
            'id',
            'stationName',
            'unimpairedStartYear',
            'unimpairedEndYear',
          ],
        },
      ],
    })
      .then(classifications => {
        res.status(200).send(classifications);
      })
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Classification.findById(req.params.classId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [{model: Hydrograph, as: 'hydrographs'}],
    })
      .then(classInfo => res.status(200).send(classInfo))
      .catch(err => res.status(400).send(err));
  },

  async update(req, res) {
    try {
      await calculatePercentileClourse(1);
      res.status(200).send('success');
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
