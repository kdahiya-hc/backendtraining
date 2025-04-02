require("dotenv").config();
const AWS = require("aws-sdk");

// Configure AWS SES
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// Function to send OTP via SES
async function sendOTP(email, otp) {
    const mailData = {
        Source: process.env.SENDER_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: "Your OTP Code" },
            Body: {
                Text: { Data: `Your OTP code is: ${otp}. It will expire in 5 minutes.` },
            },
        },
    };

    try {
        await ses.sendEmail(mailData).promise();
        console.log(`OTP sent to ${email}`);
        return {
            success: true,
            message: 'Otp sent succesfully',
            value: otp
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
            value: {}
        };
    }
}

module.exports = sendOTP;
