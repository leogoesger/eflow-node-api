const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const bcrypt = require('bcrypt');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const nodeMailerMailgun = nodemailer.createTransport(mg(auth));

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
