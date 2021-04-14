const env = require('./environment');
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport(env.smtp);
module.exports = {
	transporter : transporter
}