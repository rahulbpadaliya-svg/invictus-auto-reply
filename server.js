import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ROOT */
app.get("/", (req, res) => {
  res.send("Invictus Auto Email Server Running ✅");
});

/* EMAIL ROUTE */
app.post("/auto-reply", async (req, res) => {

  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_SMTP_USER,
      pass: process.env.ZOHO_SMTP_PASS
    }
  });

  try {

    await transporter.sendMail({
      from: `"Invictus Experiences" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: "Thank You for Contacting Invictus Experiences",
      html: `<h2>Thank you ${full_name}</h2>`
    });

    res.json({ success: true });

  } catch (err) {
    console.log("Email Error:", err.message);
    res.status(500).json({ error: "Email failed" });
  }

});

/* IMPORTANT PART */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
