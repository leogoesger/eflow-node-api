import {Classification, Hydrograph, Gauge} from '../models';

module.exports = {
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
};
