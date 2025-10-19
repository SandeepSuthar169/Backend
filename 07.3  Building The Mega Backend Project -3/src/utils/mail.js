import { body } from "express-validator";
import Mailgen from "mailgen"
import nodemailer from "nodemailer"


const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
           
            name: 'Task Manager',
            link: 'https://mailgen.js/'
           
        }
    })

    let emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    let emailHTML = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_SMTP_USER, 
          pass: process.env.MAILTRAP_SMTP_PASSWORD,
        },
      });

    const mail = {
        from: 'mail.taskmanager@exa.com',
        to: options.email,
        subject: options.subject,
        text: emailText,             // plain‑text body
        html: emailHTML,             // HTML body
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email failed", error);
    }


}

const emailVerificationMailGenContent = (username, varificationUrl) => {
    return {
        body: {
            name: username,
            intro: 'Welcome to App! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mailgen, please click here:',
                button: {
                    color: '#2258bcff', 
                    text: 'Verify your email',
                    link: varificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
}


const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: 'we got a request to reset your password',
            action: {
                instructions: 'To change your password click the button',
                button: {
                    color: '#2258bcff', 
                    text: 'reset Password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
}


export { sendMail, emailVerificationMailGenContent, forgotPasswordMailGenContent }