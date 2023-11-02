const nodemailer = require("nodemailer");
const { GMAILCODERUSER, GMAILCODERPASS } = require("../config/env");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: `${GMAILCODERUSER}`,
    pass: `${GMAILCODERPASS}`,
  },
});
const sendEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    const result = await transport.sendMail({
      from: `TestCoder <${GMAILCODERUSER}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
      attachments: [],
    });

    return { status: "success", result: result, message: "Email Sent" };
  } catch (error) {
    return { status: "error", error: error, message: "Email not sent" };
  }
};
module.exports = {
  sendEmail,
};
