import {Member} from '../models';

module.exports = {
  index(req, res) {
    return Member.findAll()
      .then(members => {
        res.status(200).send(members);
      })
      .catch(err => res.status(400).send(err));
  },
};
