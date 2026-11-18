import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface ISendEmailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

export interface ISendEmailResponse {
  id?: string;
  error?: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.defaultFrom =
      this.configService.get<string>('RESEND_FROM_EMAIL') ||
      'onboarding@resend.dev';
  }

  public async sendEmail(
    payload: ISendEmailPayload,
  ): Promise<ISendEmailResponse> {
    try {
      const from = payload.from || this.defaultFrom;
      const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];

      this.logger.log(
        `Sending email with subject "${payload.subject}" to ${recipients.join(', ')} from ${from}`,
      );

      const response = await this.resend.emails.send({
        from,
        to: recipients,
        subject: payload.subject,
        html: payload.html || payload.text || '',
        text: payload.text,
        replyTo: payload.replyTo,
        cc: payload.cc
          ? Array.isArray(payload.cc)
            ? payload.cc
            : [payload.cc]
          : undefined,
        bcc: payload.bcc
          ? Array.isArray(payload.bcc)
            ? payload.bcc
            : [payload.bcc]
          : undefined,
        attachments: payload.attachments,
      });

      if (response.error) {
        this.logger.error(
          `Resend API Error: ${JSON.stringify(response.error)}`,
        );
        throw new BadRequestException(
          response.error.message || 'Failed to send email',
        );
      }

      this.logger.log(`Email sent successfully with ID: ${response.data?.id}`);
      return { id: response.data?.id };
    } catch (error) {
      this.logger.error(`Error sending email:`, error);
      throw error;
    }
  }

  public async sendOtpEmail(
    email: string,
    otp: string,
  ): Promise<ISendEmailResponse> {
    const subject = `${otp} is your Spike verification code`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0C490C; margin-top: 0; margin-bottom: 16px; font-size: 22px;">Spike Verification Code</h2>
        <p style="color: #374151; font-size: 15px; line-height: 1.5;">Use the one-time code below to verify your email address:</p>
        <div style="background-color: #f4fbf4; border: 1px solid #d1fae5; padding: 20px; border-radius: 8px; text-align: center; margin: 28px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0C490C; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.4; margin-bottom: 0;">This code will expire in 10 minutes. If you did not request this verification, you can safely ignore this message.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Your Spike verification code is: ${otp}. It expires in 10 minutes.`,
    });
  }
}
