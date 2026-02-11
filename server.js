import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= ROOT TEST ================= */
app.get("/", (req, res) => {
  res.send("Invictus Auto Reply Server Running ✅");
});

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
  const { full_name, email, mobile } = req.body;

  if (!full_name || !email || !mobile) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Incoming Request:", req.body);

  /* ===== FORMAT MOBILE CORRECTLY ===== */
  const cleanMobile = mobile.replace(/\D/g, ""); // remove spaces, + etc
  const formattedMobile = cleanMobile.startsWith("91")
    ? cleanMobile
    : "91" + cleanMobile;

  /* ===== EMAIL SEND ===== */
  try {
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

    console.log("Email Sent ✅");
  } catch (emailError) {
    console.error("Email Error:", emailError.message);
  }

  /* ===== WHATSAPP SEND ===== */
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: formattedMobile,
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

    console.log("WhatsApp Sent ✅");
  } catch (waError) {
    console.error(
      "WhatsApp Error:",
      waError.response?.data || waError.message
    );
  }

  res.json({ status: "success" });
});

/* ================= SERVER START ================= */
app.listen(3000, () => {
  console.log("Auto Reply Server Running on 3000");
});
