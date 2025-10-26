import nodemailer from 'nodemailer'
import config from '../../../config';

// EMAIL SNDER
const emailSender = async (email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.emailSender.email,
            pass: config.emailSender.app_pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"DocMeet" <sujonsheikh.dev@gmail.com>',
        to: email,
        subject: "Reset Password Link",
        html,
    });
};

export default emailSender;