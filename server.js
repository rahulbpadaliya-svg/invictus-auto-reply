import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= EMAIL SETUP ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASS
  }
});

/* ================= AUTO REPLY ROUTE ================= */

app.post("/auto-reply", async (req, res) => {
  try {
    const { full_name, email, mobile } = req.body;

    /* ===== EMAIL SEND ===== */
    await transporter.sendMail({
      from: `"Invictus Experiences" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: "Thank You for Contacting Invictus Experiences",
      html: `
      <html>
      <body style="font-family:Arial;background:#f2f2f2;padding:30px;">
      <div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:10px;">
      <h2 style="color:#ff7a00;text-align:center;">Invictus Experiences</h2>
      <p>Dear ${full_name},</p>
      <p>We have received your inquiry successfully.</p>
      <p>Our team will contact you shortly.</p>
      <p>📞 +91 9898668984</p>
      <p>Warm regards,<br>Team Invictus Experiences</p>
      </div>
      </body>
      </html>
      `
    });

    /* ===== WHATSAPP SEND ===== */
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: mobile,
        type: "text",
        text: {
          body: `Hello ${full_name},

Thank you for contacting Invictus Experiences 🌄

We have received your inquiry.
Our team will contact you shortly.

📞 +91 9898668984`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ status: "success" });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ status: "error" });
  }
});

app.listen(3000, () => {
  console.log("Auto Reply Server Running on 3000");
});
