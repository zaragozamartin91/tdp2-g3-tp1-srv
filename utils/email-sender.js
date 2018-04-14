const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "hoycomog3@outlook.com",
        pass: "Milanesas91"
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

exports.sendAdminEmail = function ({ to, subject, text = 'HOY COMO', html = '' }) {
    const mailOptions = {
        from: '"Hoy como admin" <hoycomog3@outlook.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                resolve(info);
            }

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
};

exports.closeTransporter = function () {
    transporter.close();
};
