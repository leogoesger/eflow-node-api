import {Member, Paper} from '../models';

module.exports = {
  index(req, res) {
    return Paper.findAll({
      include: [
        {
          model: Member,
          foreignKey: 'paperId',
          as: 'members',
        },
      ],
    })
      .then(papers => {
        res.status(200).send(papers);
      })
      .catch(err => res.status(400).send(err));
  },
};
