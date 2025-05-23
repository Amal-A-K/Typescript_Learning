import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendEmail = async(mailOption) =>{
    try {
        await transporter.sendMail(mailOption);
        return true;
        
    }catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
} 