import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", response);
    return response;
  } catch (error) {
    console.log("RESEND EMAIL ERROR:", error);
    throw error;
  }
};
