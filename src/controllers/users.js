const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import {omit} from 'lodash';

import {UploadData, User} from '../models';

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
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('email not found');
    }
    if (
      req.body.secret &&
      bcrypt.compareSync(req.body.secret, process.env.SERVER_SECRET)
    ) {
      const body = omit(req.body, 'secret');
      User.create(
        Object.assign(body, {
          password: bcrypt.hashSync(body.password, 10),
        })
      )
        .then(user => {
          const ff_jwt = jwt.sign(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            },
            process.env.FF_JWT_TOKEN
          );
          return res.status(200).send({
            ff_jwt,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            uploadData: [],
          });
        })
        .catch(err => res.status(400).send(err));
    } else {
      const body = omit(req.body, ['secret', 'role']);
      User.create(
        Object.assign(body, {
          password: bcrypt.hashSync(body.password, 10),
        })
      )
        .then(user => {
          const ff_jwt = jwt.sign(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            },
            process.env.FF_JWT_TOKEN
          );
          res.status(200).send({
            ff_jwt,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            uploadData: [],
          });
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
      include: [
        {
          model: UploadData,
          as: 'uploadData',
          attributes: [
            'name',
            'createdAt',
            'yearRanges',
            'id',
            'flowMatrix',
            'DRH',
            'allYear',
            'winter',
            'fall',
            'summer',
            'spring',
            'fallWinter',
          ],
        },
      ],
    })
      .then(user => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const ff_jwt = jwt.sign(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            },
            process.env.FF_JWT_TOKEN
          );
          return res.status(200).send({
            ff_jwt,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            uploadData: user.uploadData,
          });
        }
        res.status(404).send({message: 'Wrong Password!'});
      })
      .catch(() =>
        res.status(400).send({message: 'Could not find your email!'})
      );
  },

  getMe(req, res) {
    User.findById(req.user.id, {
      include: [
        {
          model: UploadData,
          as: 'uploadData',
          attributes: [
            'name',
            'yearRanges',
            'createdAt',
            'id',
            'flowMatrix',
            'DRH',
            'allYear',
            'winter',
            'fall',
            'summer',
            'spring',
            'fallWinter',
          ],
        },
      ],
    })
      .then(user =>
        res.status(200).send({
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email,
          uploadData: user.uploadData,
        })
      )
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

  deleteUploadedFile(req, res) {
    UploadData.findById(req.body.id, {
      include: [{model: User, as: 'user', attributes: ['id']}],
    }).then(d => {
      if (d.user.id === req.user.id) {
        d.destroy();
        res.status(200).send({message: 'Deleted!'});
      } else {
        res.status(400).send({message: 'Not allowed!'});
      }
    });
  },
};
