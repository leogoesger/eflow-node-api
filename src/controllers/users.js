const bcrypt = require('bcrypt');

module.exports = {
  downServer(req, res, io) {
    if (!req.body.secret) {
      return res.status(400).send('Secret not found');
    }
    if (bcrypt.compareSync(req.body.secret, process.env.SERVER_SECRET)) {
      io.emit('message', req.body.message);
      res.status(200).send({msg: 'Message broadcasted!'});
    } else {
      return res.status(404).send('Something went wrong!');
    }
  },
};
