import nodemailer from "nodemailer";
import getHtml from "./getHtml.js";

function getSubject(template) {
  switch (template) {
    case "welcome":
      return "Welcome to our Trikania-music 🌿";

    case "forgotpass":
      return "Instructions on how to change your password at Trikania-music 🌿";
    default:
      "";
  }
}

export default async function main(token, template) {
  const data = {
    from: 'Trikania-music 🌿" <ajanitones@gmail.com>', // sender address
    to: "ajanitone@freenet.de", // list of receivers
    subject: getSubject(template),
    // text: "Hello world this is plain text?", // plain text body
    html: getHtml(template, token), // html body
  };

  let transporter = nodemailer.createTransport({
    host: process.env.SMPT_SERVER,
    port: process.env.SMPT_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMPT_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(data);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
