import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
  host: 'nitp-abuja.rolandconsultnig.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'admin@nitp-abuja.rolandconsultnig.com',
    pass: 'Samolan123@'
  },
  debug: true, // Enable debug logging
  logger: true // Enable logger
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Email sending function
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log('Attempting to send email to:', to);
    console.log('Subject:', subject);
    
    const info = await transporter.sendMail({
      from: '"Nigeria Planner Hub" <admin@nitp-abuja.rolandconsultnig.com>',
      to,
      subject,
      html
    });
    
    console.log('Message sent successfully:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 