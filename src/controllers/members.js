import {Member, Paper} from '../models';

module.exports = {
  index(req, res) {
    return Member.findAll({
      include: [{model: Paper, foreignKey: 'memberId', as: 'papers'}],
    })
      .then(members => {
        res.status(200).send(members);
      })
      .catch(err => res.status(400).send(err));
  },
};
