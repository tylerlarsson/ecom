const nodeMailer = require('nodemailer');

async function mailerFactory() {
  const testAcc = await nodeMailer.createTestAccount();
  return nodeMailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAcc.user,
      pass: testAcc.pass
    }
  });
}

/**
 * Function for sending mail
 * @param args
 * @property from - sender address
 * @property to - list of receivers / receiver
 * @property subject - subject line
 * @property text - plain text body
 * @property html - html body
 * @returns {Promise<*|Promise<*>>}
 */
async function sendMail(args) {
  const mailer = await mailerFactory();
  return mailer.sendMail(args);
}

module.exports = {
  sendMail,
  mailerFactory
};
