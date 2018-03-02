import {GeoClass} from '../models';

module.exports = {
  index(req, res) {
    return GeoClass.findAll()
      .then(geoClass => res.status(200).send(geoClass))
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return GeoClass.findAll({where: {classId: req.params.classId}})
      .then(geoClass => res.status(200).send(geoClass))
      .catch(err => res.status(400).send(err));
  },
};
