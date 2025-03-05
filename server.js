const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sumit36335@gmail.com", // Your Gmail ID
    pass: "Sumit@0924sumit",    // Your Gmail App Password
  },
});

app.post("/submitComplaint", async (req, res) => {
  const { name, address, phone, complaint } = req.body;

  try {
    await transporter.sendMail({
      from: "sumit36335@gmail.com",
      to: ["poojakumari200059@gmail.com", "vishalsinghboom@gmail.com"],
      subject: "New Colony Complaint",
      text: `Name: ${name}\nAddress: ${address}\nPhone: ${phone}\nComplaint: ${complaint}`,
    });

    const apiKey = "YOUR_FAST2SMS_API_KEY";
    await axios.get(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&message=Complaint from ${name}, ${complaint}&route=v3&numbers=XXXXXXXXXX,XXXXXXXXXX`
    );

    res.send({ message: "Complaint Submitted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to Submit Complaint" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
