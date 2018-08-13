const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const User = require('../models').User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import {omit} from 'lodash';

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY
      ? process.env.MAILGUN_API_KEY
      : 'abcdefghi',
    domain: process.env.MAILGUN_DOMAIN
      ? process.env.MAILGUN_DOMAIN
      : 'abcdefghi',
  },
};

const nodeMailerMailgun = nodemailer.createTransport(mg(auth));

module.exports = {
  signUp(req, res) {
    if (!req.body.email || !req.body.password || !req.body.secret) {
      return res.status(400).send('email not found');
    }
    if (bcrypt.compareSync(req.body.secret, process.env.SERVER_SECRET)) {
      const body = omit(req.body, 'secret');
      User.create(
        Object.assign(body, {
          password: bcrypt.hashSync(body.password, 10),
        })
      )
        .then(user => {
          const FF_JWT = jwt.sign(
            {firstName: user.firstName, email: body.email},
            process.env.FF_JWT_TOKEN
          );
          res.status(200).send({FF_JWT, user});
        })
        .catch(err => res.status(400).send(err));
    }
  },

  login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('email not found');
    }
    User.find({
      where: {
        email: req.body.email,
      },
    })
      .then(user => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const FF_JWT = jwt.sign(
            {firstName: user.firstName, email: req.body.email},
            process.env.FF_JWT_TOKEN
          );
          return res.status(200).send({FF_JWT, user});
        }
        res.status(404).send({message: 'Wrong Password!'});
      })
      .catch(() =>
        res.status(400).send({message: 'Could not find your email!'})
      );
  },

  getMe(req, res) {
    User.findById(req.user.id)
      .then(user => res.status(200).send(user))
      .catch(err => res.status(404).send(err));
  },

  emailReport(req, res) {
    const {name, email, msg} = req.body;
    if (!name || !email || !msg) {
      return res.status(400).send('Invalid form');
    }

    const mailOptions = {
      from: `${name} <${email}>`,
      to: 'funcflow@gmail.com',
      subject: 'UC Davis Eflow Bug Report',
      text: msg,
    };
    nodeMailerMailgun.sendMail(mailOptions, error => {
      if (error) {
        throw error;
      }
      res.status(200).send({message: 'Form Submitted!'});
    });
  },
};
