'use strict';

const smtp_host = process.env.SMTP_HOST || 'mail.host.com'
const smtp_port = process.env.SMTP_PORT || 587

console.log('using: '+smtp_host)

let send_email = (message) => {
  let nodemailer = require('nodemailer');
  let transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: false
  });

  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });
}

module.exports.send = (event, context, callback) => {
  if(event.Records) {
    event.Records.forEach(function(record) {
      let kinesis_data = new Buffer(
        JSON.stringify(record.Data), 'base64'
      ).toString("ascii");
      let data = JSON.parse(kinesis_data)

      send_email(data)
    });
  }

  callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: 'Greatness awaits.'
  });
  return;
}
