const ejs = require('ejs');
const mailjet = require('mailjet').connect('public', 'private');
const createLogger = require('./logger');
const logger = createLogger('web-server.mail-module');
const { getFilePath, checkFile } = require('./file-util');

const mailJetFactory = args => ({
  Messages: [
    {
      From: {
        Email: args.from
      },
      To: [
        {
          Email: args.to
        }
      ],
      Subject: args.subject,
      TextPart: args.text || undefined,
      HTMLPart: args.html || undefined
    }
  ]
});

const mailJetSend = mail => mailjet.post('send', { version: 'v3.1' }).request(mail);

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
  if (!template) {
    const mail = mailJetFactory(args);
    return mailJetSend(mail);
  }
  const filePath = getFilePath('server', 'templates', `${template}.ejs`);
  if (await checkFile(filePath)) {
    const rendered = await ejs.renderFile(filePath, data, { async: true });
    Object.assign(mailerArgs, { html: rendered });
    const mail = mailJetFactory(mailerArgs);
    const { body } = await mailJetSend(mail);
    logger.info(`Message to ${args.to} is sent`, body);
    return body;
  }
  throw new Error(`Template ${template} does not exist.`);
}

module.exports = {
  sendMail
};
