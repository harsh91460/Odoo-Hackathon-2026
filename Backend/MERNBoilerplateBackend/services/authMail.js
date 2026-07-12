import { transporter } from "../config/mail.js";

const otpTemplate = (otp) => `
  <h2>Email Verification</h2>
  <p>Your OTP is <strong>${otp}</strong></p>
`;

export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your Email",
      html: otpTemplate(otp),
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};