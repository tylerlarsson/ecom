const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const createLogger = require('./logger');
const logger = createLogger('web-server.mail-module');
const { getFilePath, checkFile } = require('./file-util');

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
 * @property template - ejs template to render
 * @property data - data for template
 * @property text - if using without template
 * @returns {Promise<*|Promise<*>>}
 */
async function sendMail(args) {
  const { template, data, ...mailerArgs } = args;
  const mailer = await mailerFactory();
  if (!template) {
    return mailer.sendMail(args);
  }
  const filePath = getFilePath('server', 'templates', `${template}.ejs`);
  if (await checkFile(filePath)) {
    const rendered = await ejs.renderFile(filePath, data, { async: true });
    Object.assign(mailerArgs, { html: rendered });
    const message = await mailer.sendMail(mailerArgs);
    logger.info('Message preview', nodeMailer.getTestMessageUrl(message));
    return message;
  }
  throw new Error(`Template ${template} does not exist.`);
}

module.exports = {
  sendMail,
  mailerFactory
};
