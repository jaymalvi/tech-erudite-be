const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    text: `Your verification code is: ${code}`,
  });
};

module.exports = sendVerificationEmail;
