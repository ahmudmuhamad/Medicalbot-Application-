const nodemailer = require('nodemailer');
const { options } = require('../app');

const sendEmail = async options => {
    //1) Transporter 
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6f4a2bd1ad03fb",
          pass: "06868190d6a3e9"
        }
      });

    //2) Define the emial options
      const emailOptions = {
        from: 'MedicalBot',
        to: options.email,
        subject: options.subject,
        text: options.message
        //gonna try to add html later :)
      }

    //3) Send the email with nodemailer
      await transport.sendMail(emailOptions)

}


module.exports = sendEmail;