import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail", // Or use custom SMTP settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetOtpEmail(email, name, otp) {
  const message = {
    from: `"Gyaan Path" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset OTP for Gyaan Path`,
    html: `
      <h2>Hello, ${name}</h2>
      <p>We received a request to reset your password for your Gyaan Path account.</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h2 style="color: #1a7f37;">${otp}</h2>
      <p>This OTP is valid for <strong>5 minutes</strong> and can only be used once.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <br />
      <p>Best regards,<br />The Gyaan Path Team</p>
    `,
  };

  await transporter.sendMail(message);
}

export default sendResetOtpEmail;
