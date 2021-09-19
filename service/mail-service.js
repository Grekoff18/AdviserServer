const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMsg(email, activationLink) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Account activation on ${process.env.API_URL}`,
      text: "",
      html: `<div><h1>For activation you need to go to the link <br /><a href="${activationLink}">${activationLink}</a></h1></div>`
    }, (error, info) => {
      if (error) console.error(error)
    })
  }
}

module.exports = new MailService();