import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
    },
    secure: false, // true para 465, false para otros puertos
    tls: {
        rejectUnauthorized: false
    }
});

export const sendAccountConfirmationEmail = async (to, token) => {
    const confirmationUrl = `${process.env.NEXTAUTH_URL}/confirm-email?token=${token}`;
    try {
        await transporter.sendMail({
            from: `"Tu Aplicación" <${process.env.EMAIL_SERVER_USER}>`,
            to: to,
            subject: "Confirma tu cuenta",
            html: `
                <p>Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href="${confirmationUrl}">Confirmar cuenta</a>
            `,
        });
        console.log('Correo de confirmación enviado a:', to);
    } catch (error) {
        console.error('Error al enviar correo de confirmación de cuenta:', error);
        throw error;
    }
};

export const sendConfirmationEmail = async (to, appointmentDetails) => {
    try {
        await transporter.sendMail({
            from: '"Sistema de Citas" <noreply@example.com>',
            to: to,
            subject: "Confirmación de Cita",
            html: `<b>Su cita ha sido confirmada para ${appointmentDetails.date} a las ${appointmentDetails.time} para el servicio ${appointmentDetails.serviceName}.</b>`,
        });
    } catch (error) {
        console.error('Error al enviar correo de confirmación de cita:', error);
        throw error;
    }
};

export const sendReminderEmail = async (to, appointmentDetails) => {
    try {
        await transporter.sendMail({
            from: '"Sistema de Citas" <noreply@example.com>',
            to: to,
            subject: "Recordatorio de Cita",
            html: `<b>Recordatorio: Tiene una cita mañana a las ${appointmentDetails.time}.</b>`,
        });
    } catch (error) {
        console.error('Error al enviar correo de recordatorio:', error);
        throw error;
    }
};

export const sendCancellationEmail = async (to, appointmentDetails) => {
    try {
        await transporter.sendMail({
            from: '"Sistema de Citas" <noreply@example.com>',
            to: to,
            subject: "Cancelación de Cita",
            html: `<b>Su cita para ${appointmentDetails.date} a las ${appointmentDetails.time} ha sido cancelada.</b>`,
        });
    } catch (error) {
        console.error('Error al enviar correo de cancelación:', error);
        throw error;
    }
};