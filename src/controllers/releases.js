const bcrypt = require('bcrypt');
import {Release} from '../models';

module.exports = {
  getReleases(req, res) {
    return Release.findAll()
      .then(releases => {
        res.status(200).send(releases);
      })
      .catch(err => res.status(400).send(err));
  },

  createRelease(req, res) {
    if (!req.body.secret) {
      return res.status(400).send('Secret not found');
    }
    if (bcrypt.compareSync(req.body.secret, process.env.SERVER_SECRET)) {
      Release.create({
        title: req.body.title,
        version: req.body.version,
        date: req.body.date,
        tasks: req.body.tasks,
      }).then(release => res.status(200).send(release));
    } else {
      res.status(400).send({msg: 'Wrong password'});
    }
  },
};
