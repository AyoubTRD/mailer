require("dotenv").config();
require("./src/mailer");
const express = require("express");

const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const sgMail = require("@sendgrid/mail");

app.post("/notify", async (req, res) => {
  const { message, title, receiver } = req.body;
  try {
    await sgMail.send({
      from: process.env.MAIL_SENDER,
      to: receiver,
      subject: title,
      html: message,
    });
    res.send({
      status: "success",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e });
  }
});

const { Notification } = require("./src/db");

app.post("/notify-self", async (req, res) => {
  const { message, title } = req.body;
  try {
    const n = new Notification({ title, message });
    await n.save();
    await sgMail.send({
      from: process.env.MAIL_SENDER,
      to: process.env.MAIL_RECEIVER,
      subject: title,
      html: message,
    });
    res.send({
      status: "success",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("The server has started");
});
