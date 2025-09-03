import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function sendImageNotification(email: string, uuid: string, siteUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PhotoPoster <noreply@yourdomain.com>',
      to: [email],
      subject: 'Nouvelle image ajoutée pour toi 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Nouvelle image disponible ! 🎉</h1>
          <p style="color: #666; font-size: 16px;">
            Une nouvelle image a été ajoutée pour toi.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/${uuid}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Voir l'image
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            Ou copie ce lien : ${siteUrl}/${uuid}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
} 