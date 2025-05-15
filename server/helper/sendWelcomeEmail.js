import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail", // or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeEmail(email, name, role) {
  const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);
  const message = {
    from: `"Gyaan Path" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Gyaan Path, ${roleCapitalized}!`,
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>We're excited to have you join Gyaan Path as a <strong>${role}</strong>.</p>
      <p>Start exploring our platform and make the most of your learning/teaching experience!</p>
    `,
  };

  await transporter.sendMail(message);
}

export default sendWelcomeEmail;
