const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();


const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.send('JVCParry API')
})

app.post('/send', (req, res) => {
  let data = req.body;

  let smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.JVCPARRY_FROM_EMAIL,
      pass: process.env.JVCPARRY_FROM_PASS
    }
  });

  let mailOptions = {
    from: data.email,
    to: process.env.JVCPARRY_TO_EMAIL,
    subject: 'JVCParry website contact form',
    html: `<p>${data.name}</p>
          <p>${data.email}</p>
          <p>${data.message}</p>`
  };

  smtpTransport.sendMail(mailOptions,
    (error, response) => {
      if (error) {
        res.status(500).send({
          success: false,
          message: 'Something went wrong,  please try again  later.'
        })
      } else {
        res.send({
          success: true,
          message: 'Thanks for contacting me, I\'ll respond shortly'
        })
      }
      smtpTransport.close();
    });

});

app.listen(port, () => {
  console.log('We are live on port 8000');
});
