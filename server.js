require("dotenv").config(); // Environment Variable ko Read karne ke liye
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Backend Server is Running Successfully ✅");
});

app.post("/submitComplaint", async (req, res) => {
  const { name, address, phone, complaint } = req.body;

  if (!name || !address || !phone || !complaint) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: ["poojakumari200059@gmail.com", "vishalsinghboom@gmail.com"],
      subject: "New Colony Complaint",
      text: `Name: ${name}\nAddress: ${address}\nPhone: ${phone}\nComplaint: ${complaint}`,
    });

    const apiKey = process.env.FAST2SMS_API_KEY;
    await axios.get(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&message=Complaint from ${name}, ${complaint}&route=v3&numbers=XXXXXXXXXX,XXXXXXXXXX`
    );

    res.send({ message: "Complaint Submitted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to Submit Complaint" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
