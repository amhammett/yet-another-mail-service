'use strict';

const smtp_host = process.env.SMTP_HOST || 'mail.host.com'
const smtp_port = process.env.SMTP_PORT || 587

console.log('using: '+smtp_host)

let send_email = (message) => {
  console.log('send message')
  console.log(message)

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
      transporter.sendMail(message, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: '+ info.response);
        }
      });
    }
  });
}

module.exports.send = (event, context, callback) => {
  if(event.Records) {
    event.Records.forEach(function(record) {
      let record_data = new Buffer((record.kinesis.data), 'base64').toString("ascii");
      console.log(record_data)
      let kinesis_data = JSON.parse(record_data)
      //let event_data = JSON.parse(kinesis_data.body)
      send_email(kinesis_data)
    });
  }

  callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: 'Greatness awaits.'
  });
  return;
}
