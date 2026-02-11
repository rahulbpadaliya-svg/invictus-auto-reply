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
      <body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:10px;padding:40px;max-width:600px;width:100%;">
                
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <h2 style="margin:0;color:#ff7a00;">
                      Invictus Experiences
                    </h2>
                    <p style="margin:5px 0 0;color:#777;font-size:14px;">
                      Surprise the world, first surprise yourself
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="color:#333;font-size:15px;line-height:1.8;">
                    <p>Dear ${full_name},</p>

                    <p>We have successfully received your inquiry.</p>

                    <p>
                      Our travel expert team is reviewing your request 
                      and will contact you shortly.
                    </p>

                    <p>
                      📞 +91 9898668984<br>
                      ✉ invictusexperiences@zohomail.in
                    </p>

                    <p style="margin-top:25px;">
                      Warm regards,<br>
                      <strong>Team Invictus Experiences</strong>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
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

/* ================= IMPORTANT: RENDER PORT FIX ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
