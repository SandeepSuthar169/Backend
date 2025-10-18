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

    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

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


const forgotPasswordMailGenContent = (username, varificationUrl) => {
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

sentMail({
    email: user.email,
    subjectL: "aaaa",
    mailGenContent: emailVerificationMailGenContent(username,
        ``

    )
})