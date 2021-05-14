const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const config = { ...process.env };


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('JVCParry API')
})

app.post('/send', (req, res) => {
  let data = req.body;

  let smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.JVCPARRY_FROM_EMAIL,
      pass: config.JVCPARRY_FROM_PASS
    }
  });

  let mailOptions = {
    from: data.email,
    to: config.JVCPARRY_TO_EMAIL,
    subject: 'JVCParry website contact form',
    html: `<p>From: ${data.name}</p>
          <p>Email: ${data.email}</p>
          <p>Message: ${data.message}</p>`
  };

  smtpTransport.sendMail(mailOptions,
    (error, response) => {
      if (error) {
        res.status(500).send({
          success: false,
          message: error
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


app.listen(config.PORT || 8000, () => console.log(`We are live on port http://localhost:${config.PORT || 8000}`));
