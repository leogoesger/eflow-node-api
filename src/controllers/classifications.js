import {Classification, Hydrograph} from '../models';

module.exports = {
  create(req, res) {
    Classification.create(req.body)
      .then(classInfo => res.status(201).send(classInfo))
      .catch(err => res.status(400).send(err));
  },

  index(req, res) {
    return Classification.findAll()
      .then(classInfo => res.status(200).send(classInfo))
      .catch(err => res.status(400).send(err));
  },

  show(req, res) {
    return Classification.findById(req.params.classId, {
      include: [{model: Hydrograph, as: 'hydrographs'}],
    })
      .then(classInfo => res.status(200).send(classInfo))
      .catch(err => res.status(400).send(err));
  },
};
