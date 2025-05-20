export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Nigeria Planner Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Nigeria Planner Hub!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for joining Nigeria Planner Hub. We're excited to have you as a member of our community.</p>
        <p>With your account, you can:</p>
        <ul>
          <li>Access exclusive planning resources</li>
          <li>Connect with other planners</li>
          <li>Participate in professional development opportunities</li>
          <li>Stay updated with the latest industry news</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Nigeria Planner Hub Team</p>
      </div>
    `
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Password Reset Request - Nigeria Planner Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password for your Nigeria Planner Hub account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Nigeria Planner Hub Team</p>
      </div>
    `
  }),

  emailVerification: (verificationLink: string) => ({
    subject: 'Verify Your Email - Nigeria Planner Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Thank you for registering with Nigeria Planner Hub. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>The Nigeria Planner Hub Team</p>
      </div>
    `
  }),

  membershipApproval: (name: string) => ({
    subject: 'Membership Application Approved - Nigeria Planner Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Membership Application Approved</h2>
        <p>Dear ${name},</p>
        <p>We are pleased to inform you that your membership application to Nigeria Planner Hub has been approved!</p>
        <p>You can now access all member benefits and features by logging into your account.</p>
        <p>Welcome to our community!</p>
        <p>Best regards,<br>The Nigeria Planner Hub Team</p>
      </div>
    `
  })
}; 