import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dotenv from "dotenv";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async (): Promise<
  nodemailer.Transporter<SMTPTransport.SentMessageInfo>
> => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to create access token.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        // user: process.env.EMAIL_USER,
        user: "simonpardamean46",
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as SMTPTransport.Options);

    return transporter;
  } catch (error) {
    console.error("Failed to create access token or transporter", error);
    throw error;
  }
};

class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
    null;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      this.transporter = await createTransporter();
    } catch (error) {
      console.error("Failed to create transporter", error);
    }
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    if (!this.transporter) {
      throw new Error("Transporter is not initialized");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { statusSendEmail: true, info };
    } catch (error) {
      return { statusSendEmail: false, error };
    }
  }
}

export default new EmailService();
