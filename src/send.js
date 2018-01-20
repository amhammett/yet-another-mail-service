'use strict';

module.exports.send = (event, context, callback) => {
  console.log('event')
  console.log(event)
  const nodemailer = require('nodemailer');
  let smtpTransport = require('nodemailer-smtp-transport');

  event.Records.forEach(function(record) {
    console.log('record')
    console.log(record)
    console.log('processing mail record')

    let transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST || 'mail.host.com',
        port: process.env.SMTP_PORT || 587,
        secure: false
      })
    );

    let record_data = new Buffer((record.kinesis.data), 'base64').toString("ascii");
    let message = JSON.parse(record_data)
    console.log(message)

    transporter.sendMail(message, function(error, info) {
      if (error) {
        console.log(error);
        context.fail(error, 'failed')
      } else {
        console.log('Message sent: '+ info.response);
        context.succeed(null, 'Completed')
      }
      transporter.close()
    });
  });

  callback(null, 'Greatness awaits.');
}
