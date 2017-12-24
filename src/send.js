'use strict';

const smtp_host = process.env.SMTP_HOST || 'mail.host.com'
const smtp_port = process.env.SMTP_PORT || 587

console.log('using: '+smtp_host)

let is_smtp_available = (host, port) => {
  let net = require('net')
  let socket = new net.Socket()
  socket.setTimeout(1000)

  socket.on('error', () => {
    socket.destroy();
    return false
  })

  socket.on('timeout', () => {
    socket.destroy();
    return false
  })

  socket.connect(port, host, () => {
    socket.end()
    return true
  })
};

let send_email = (message) => {
  console.log('send message')
  console.log(message)

  if (is_smtp_available(smtp_host, smtp_port)) {
    console.log('smtp server accessible')
  } else {
    console.error('smtp server is not reachable')
  }
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
      let kinesis_data = new Buffer(
        JSON.stringify(record.data), 'base64'
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
