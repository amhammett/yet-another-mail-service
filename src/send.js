'use strict';

module.exports.send = (event, context, callback) => {
  event.Records.forEach(function(record) {
    const nodemailer = require('nodemailer');
    const smtpTransport = require('nodemailer-smtp-transport');

    console.log('processing mail record')

    let transporter = nodemailer.createTransport(
      smtpTransport({
        host:   process.env.SMTP_HOST   || 'mail.host.com',
        port:   process.env.SMTP_PORT   || 587,
        secure: process.env.SMTP_SECURE || false
      })
    );

    let record_data = new Buffer((record.kinesis.data), 'base64').toString("ascii");
    let message = JSON.parse(record_data)
    console.log(message)

    transporter.sendMail(message, function(error, info) {
      if (error) {
        console.error(error);
        context.fail(error, 'failed')
      } else {
        console.log('Message sent: '+ info.response);
        context.succeed()
      }
      transporter.close()
    });
  });

  callback(null, 'Greatness awaits.');
}
