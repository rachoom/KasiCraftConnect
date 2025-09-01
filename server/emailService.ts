import { MailService } from '@sendgrid/mail';

export class EmailService {
  private mailService: MailService;

  constructor() {
    this.mailService = new MailService();
    if (process.env.SENDGRID_API_KEY) {
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendArtisanRegistrationNotification(artisan: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    services: string[];
    description: string;
    yearsExperience: number;
  }): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured - skipping email notification');
      return false;
    }

    try {
      const emailContent = `
New Artisan Registration - Skills Connect

A new artisan has registered on the Skills Connect platform:

Name: ${artisan.firstName} ${artisan.lastName}
Email: ${artisan.email}
Phone: ${artisan.phone}
Location: ${artisan.location}
Services: ${artisan.services.join(', ')}
Years of Experience: ${artisan.yearsExperience}
Description: ${artisan.description}

This artisan is now pending verification. Please review their profile in the admin panel.

---
Skills Connect Admin Team
`;

      await this.mailService.send({
        to: 'kgnoisy@gmail.com',
        from: 'noreply@skillsconnect.co.za', // You may need to verify this domain in SendGrid
        subject: 'New Artisan Registration - Skills Connect',
        text: emailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #B8860B;">New Artisan Registration - Skills Connect</h2>
            
            <p>A new artisan has registered on the Skills Connect platform:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.firstName} ${artisan.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.email}</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Location:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.location}</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Services:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.services.join(', ')}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Experience:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.yearsExperience} years</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Description:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${artisan.description}</td>
              </tr>
            </table>
            
            <p style="margin-top: 30px;">This artisan is now pending verification. Please review their profile in the admin panel.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">Skills Connect Admin Team</p>
          </div>
        `,
      });

      console.log(`Email notification sent successfully for artisan: ${artisan.firstName} ${artisan.lastName}`);
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // Send email verification to artisan
  async sendArtisanEmailVerification(data: {
    email: string;
    firstName: string;
    verificationUrl: string;
  }): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`Email service not configured - would send verification email to ${data.email}`);
      return false;
    }

    try {
      const subject = "Verify Your Skills Connect Account";
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #DAA520 0%, #B8860B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Skills Connect</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Artisan Marketplace</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome ${data.firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Skills Connect as an artisan! To complete your registration and start receiving customer inquiries, please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verificationUrl}" 
                 style="background: #DAA520; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Skills Connect - Connecting you with trusted local artisans<br>
              South Africa's Premier Artisan Marketplace
            </p>
          </div>
        </div>
      `;

      await this.mailService.send({
        to: data.email,
        from: 'noreply@skillsconnect.co.za',
        subject: subject,
        html: html
      });

      console.log(`Verification email sent successfully to: ${data.email}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();