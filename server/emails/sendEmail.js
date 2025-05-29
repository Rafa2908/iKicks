import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const templatePath = path.resolve(__dirname, "template.html");
const source = fs.readFileSync(templatePath, "utf-8");
const template = handlebars.compile(source);

const createEmailTransport = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "papaus02@gmail.com",
      pass: process.env.PASSWORD,
    },
  });

  return transporter;
};

export const sendEmail = (user) => {
  const transport = createEmailTransport();

  const emailHTML = template({ userName: user.name });

  const mailOptions = {
    from: "'Kicks District '<kicksdistrict@gmail.com>",
    to: user.email,
    subject: "Welcome",
    html: emailHTML,
  };

  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};

export const orderConfirmationEmail = (user, order) => {
  const transport = createEmailTransport();

  const orderEmail = `
  <h1>Thank you for your order</h1>
  <br>
  <p>Here's your order number ${
    order._id ? `KD000${String(order._id).slice(-6)}` : "N/A"
  }</p>
  <p>You ordered ${order.items.length > 1 ? `sneakers` : `sneaker`} .</p>
  <p>Total Amount: $${order?.amount}.00</p>
`;

  const mailOptions = {
    from: "'Kicks District '<kicksdistrict@gmail.com>",
    to: user.email,
    subject: "Welcome",
    html: orderEmail,
  };

  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};
