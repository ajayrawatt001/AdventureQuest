const nodemailer = require('nodemailer');
const Email = class {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Your Name <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send custom email with HTML and text
  async sendCustom(subject, html, text) {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html, // Raw HTML content
      text, // Raw plain text content
    };

    // Send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const html = `
      <h1>Welcome to the Natours Family!</h1>
      <p>Hello ${this.firstName}, we're excited to have you onboard!</p>
      <p><a href="${this.url}">Click here to get started</a></p>
    `;
    const text = `
      Welcome to the Natours Family!
      Hello ${this.firstName}, we're excited to have you onboard!
      Use the following link to get started: ${this.url}
    `;

    await this.sendCustom('Welcome to the Natours Family!', html, text);
  }

  async sendPasswordReset() {
    const html = `
      <h1>Password Reset</h1>
      <p>Hello ${this.firstName},</p>
      <p>Please click the link below to reset your password:</p>
      <p><a href="${this.url}">Reset Password</a></p>
    `;
    const text = `
      Password Reset
      Hello ${this.firstName},
      Please click the link below to reset your password:
      ${this.url}
    `;

    await this.sendCustom(
      'Your password reset token (valid for 10 minutes)',
      html,
      text,
    );
  }
};

module.exports = Email;
