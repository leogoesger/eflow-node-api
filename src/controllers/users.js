const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

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
