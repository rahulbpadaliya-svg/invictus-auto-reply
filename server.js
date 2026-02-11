import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Invictus Auto Email Server Running ✅");
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

/* ================= AUTO EMAIL ROUTE ================= */

app.post("/auto-reply", async (req, res) => {
  try {

    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Incoming request:", req.body);

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

    res.json({ status: "success" });

  } catch (error) {
    console.error("Email Error:", error.message);
    res.status(500).json({ status: "error" });
  }
});

/* ================= PORT ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
