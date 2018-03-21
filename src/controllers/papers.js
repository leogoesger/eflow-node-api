import {Paper} from '../models';

module.exports = {
  index(req, res) {
    return Paper.findAll()
      .then(papers => {
        res.status(200).send(papers);
      })
      .catch(err => res.status(400).send(err));
  },
};
