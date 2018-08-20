const User = require('../models').User;

const authenticate = (req, res, next) => {
  const token = req.body.ff_jwt;
  User.findByToken(token)
    .then(user => {
      if (!user) {
        res.status(401).send({message: 'No user found!'});
      }
      req.user = user;
      next();
    })
    .catch(e => {
      res.status(401).send({message: 'Authentication did not work!', error: e});
    });
};

const authenticateAdmin = (req, res, next) => {
  const token = req.body.ff_jwt;
  User.findByTokenAdmin(token)
    .then(user => {
      if (!user) {
        res.status(401).send({message: 'No user found!'});
      }
      req.user = user;
      next();
    })
    .catch(e => {
      res.status(401).send({message: 'Authentication did not work!', error: e});
    });
};

module.exports = {authenticate, authenticateAdmin};
