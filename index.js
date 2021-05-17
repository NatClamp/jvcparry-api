const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const cors = require('cors');
require('dotenv').config();
const config = { ...process.env };

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const oauth2Client = new OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: config.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

app.get('/', (req, res) => {
  res.status(200).send('JVCParry API')
})

app.post('/send', (req, res) => {
  let data = req.body;

  let smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: "OAuth2",
      user: config.JVCPARRY_FROM_EMAIL,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      refreshToken: config.REFRESH_TOKEN,
      accessToken: accessToken,
      tls: {
        rejectUnauthorized: false
      }
    }
  });

  let mailOptions = {
    from: data.email,
    to: config.JVCPARRY_TO_EMAIL,
    subject: 'JVCParry website contact form',
    generateTextFromHTML: true,
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
