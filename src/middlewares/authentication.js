const User = require('../models').User;

const authenticate = (req, res, next) => {
  const token = req.body.ff_jwt;
  User.findByToken(token)
    .then(user => {
      if (!user) {
        res.status(401).send({message: 'No user found!'});
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      res.status(401).send({message: 'Authentication did not work!', error: e});
    });
};

module.exports = {authenticate};
