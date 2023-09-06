const expressAsyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const Filter = require('bad-words');
const EmailMsg = require('../../model/emailMessaging/EmailMessaging');

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  // Get The Message
  const emailMessage = subject + ' ' + message;

  // Prevent Profanity/Bad Words
  const filter = new Filter({ placeHolder: '*' });

  // Mereset kata-kata bawaan bad-words
  filter.list = [];

  // Menambahkan kata-kata atau frasa khusus yang dianggap tidak pantas
  filter.addWords(
    'kontol',
    'anjing',
    'babi',
    'bangsat',
    'memek',
    'peler',
    'ngentot',
    'ngewe',
    'wik-wik',
    'fuck'
  );

  const isProfane = filter.isProfane(emailMessage);
  if (isProfane)
    throw new Error('Email sent failed, because it contains profane words.');

  try {
    // Build Up Message
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'riifkiramadhan2@gmail.com',
        pass: process.env.PASSWORD_MAILER,
      },
    });

    const msg = {
      to,
      subject,
      text: message,
      from: 'riifkiramadhan2@gmail.com',
    };

    await transporter.sendMail(msg);

    // Save to our mongodb
    await EmailMsg.create({
      sentBy: req?.user?._id,
      from: msg.from,
      to,
      message,
      subject,
    });

    res.json('Mail Sent');
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };
