import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured. Email alerts will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email service not configured, skipping email...');
    return;
  }

  try {
    const mailOptions = {
      from: `Delhi Pollution Tracker <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Delhi Pollution Tracker!</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
  `;

  return sendEmail(email, 'Verify Your Email - Delhi Pollution Tracker', html);
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        If you didn't request this, you can safely ignore this email.<br>
        This link will expire in 1 hour.
      </p>
    </div>
  `;

  return sendEmail(email, 'Reset Your Password - Delhi Pollution Tracker', html);
};

export { sendEmail, sendVerificationEmail, sendPasswordResetEmail };