const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
import {omit, unzip, sortBy} from 'lodash';
import {quantile} from 'd3';

import {UploadData, User, Prediction} from '../models';

const op = Sequelize.Op;

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

const insertDimHydrograph = uploadData => {
  if (!uploadData || !uploadData.length) {
    return;
  }

  uploadData.forEach((data, indx) => {
    const hydrograph = {
      TEN: [],
      TWENTYFIVE: [],
      FIFTY: [],
      SEVENTYFIVE: [],
      NINTY: [],
    };
    const result = unzip(data.flowMatrix);
    result[0].forEach((d, index) => {
      let currentHydrograph = [];
      result.forEach(f => {
        if (!isNaN(Number(f[index])) && Number(f[index]) !== 0) {
          currentHydrograph.push(Number(f[index]));
        }
      });

      currentHydrograph = sortBy(currentHydrograph);
      hydrograph.TEN.push({
        date: index,
        flow: quantile(currentHydrograph, 0.1),
      });
      hydrograph.TWENTYFIVE.push({
        date: index,
        flow: quantile(currentHydrograph, 0.25),
      });
      hydrograph.FIFTY.push({
        date: index,
        flow: quantile(currentHydrograph, 0.5),
      });
      hydrograph.SEVENTYFIVE.push({
        date: index,
        flow: quantile(currentHydrograph, 0.75),
      });
      hydrograph.NINTY.push({
        date: index,
        flow: quantile(currentHydrograph, 0.9),
      });
    });
    uploadData[indx].hydrograph = hydrograph;
  });

  return uploadData;
};

module.exports = {
  getUsersInfo(req, res) {
    User.findAll().then(d => res.status(200).send(d.length));
  },
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
        .catch(_ => res.status(400).send({message: 'Invalide Submission'}));
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
          where: {failed: false},
          required: false,
          order: [['createdAt', 'DESC']],
          attributes: [
            'name',
            'riverName',
            'location',
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
          include: [{model: Prediction, as: 'predictions', required: false}],
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

          const usr = user.get({plain: true});

          return res.status(200).send({
            ff_jwt,
            firstName: usr.firstName,
            lastName: usr.lastName,
            role: usr.role,
            email: usr.email,
            uploadData: insertDimHydrograph(usr.uploadData.slice(0, 5)),
            uploadCount: usr.uploadData.length,
          });
        }
        return res.status(404).send({message: 'Wrong Password!'});
      })
      .catch(_ => {
        res.status(400).send({message: 'Could not find your email!'});
      });
  },

  getUploadById(req, res) {
    UploadData.findOne({
      where: {[op.and]: {id: req.params.id, failed: false}},
      attributes: [
        'name',
        'riverName',
        'location',
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
        'startDate',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName', 'id'],
        },
      ],
    })
      .then(data => {
        if (data) {
          const d = data.get({plain: true});
          const hydrograph = insertDimHydrograph([d]);

          d.hydrograph = hydrograph[0].hydrograph;

          res.status(200).send(d);
        } else {
          res.status(404).send({message: 'Invalid Submission'});
        }
      })
      .catch(_ => {
        res.status(404).send({message: 'Invalid Submission'});
      });
  },

  getMe(req, res) {
    User.findById(req.user.id, {
      include: [
        {
          model: UploadData,
          as: 'uploadData',
          where: {failed: false},
          required: false,
          order: [['createdAt', 'DESC']],
          attributes: [
            'name',
            'riverName',
            'location',
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
            'startDate',
          ],
          include: [{model: Prediction, as: 'predictions', required: false}],
        },
      ],
    })
      .then(user => {
        const usr = user.get({plain: true});

        res.status(200).send({
          firstName: usr.firstName,
          lastName: usr.lastName,
          role: usr.role,
          email: usr.email,
          uploadData: insertDimHydrograph(usr.uploadData.slice(0, 5)),
          uploadCount: usr.uploadData.length,
        });
      })
      .catch(_ => {
        res.status(404).send({message: 'Invalid Submission'});
      });
  },

  getUserUploads(req, res) {
    UploadData.findAndCountAll({
      where: {failed: false, userId: req.user.id},
      limit: req.body.limit,
      offset: req.body.offset,
      order: [['createdAt', 'DESC']],
      attributes: [
        'name',
        'riverName',
        'location',
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
        'startDate',
      ],
      include: [{model: Prediction, as: 'predictions', required: false}],
    })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(_ => {
        res.status(404).send({message: 'Invalid Submission'});
      });
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
      if (d.user.id === req.user.id || req.user.id === 1) {
        d.destroy();
        res.status(200).send({message: 'Deleted!'});
      } else {
        res.status(400).send({message: 'Not allowed!'});
      }
    });
  },
};
