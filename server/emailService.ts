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
}

export const emailService = new EmailService();