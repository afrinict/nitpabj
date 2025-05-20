import nodemailer from 'nodemailer';

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'nitp-abuja.rolandconsultnig.com',
    port: 465,
    secure: true,
    auth: {
      user: 'admin@nitp-abuja.rolandconsultnig.com',
      pass: 'Samolan123@'
    },
    debug: true,
    logger: true
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"Nigeria Planner Hub" <admin@nitp-abuja.rolandconsultnig.com>',
      to: 'samuel.olaniyi@gmail.com, sam@afrinict.com',
      subject: 'Testing',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Testing</h2>
          <p>Ti Oluwa ni Ile ati ekun re</p>
          <p>Best regards,<br>The Nigeria Planner Hub Team</p>
        </div>
      `
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testEmail(); 