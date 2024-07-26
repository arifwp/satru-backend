import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { statusSendEmail: true, info };
    } catch (error: any) {
      return { statusSendEmail: false, error };
    }
  }
}

export default new EmailService();
