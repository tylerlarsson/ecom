const express = require('express');
const router = express.Router();
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.course-route');
const db = require('../db');

/**
 * @swagger
 * definitions:
 *   Course:
 *     type: object
 *     properties:
 *       id:
 *         type: string,
 *         example: 5db3f8d7075794205c8d1c31
 *       title:
 *         type: string,
 *         example: Angular 8
 *         required: true
 *       subtitle:
 *         type: string,
 *         example: Get Started
 *         required: true
 *       authors:
 *         required: true
 *         type: array
 *         items:
 *           type: string
 *           example: admin@gmail.com
 *           description: id, username or email as a user key
 *
 * /course:
 *   post:
 *     description: updates or creates a new course
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: course
 *         description: New Course object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Course'
 *     responses:
 *       200:
 *         description: created a new course in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *
 */
router.post('/', async (req, res) => {
  const data = req.body;

  if (!validator.course(data)) {
    logger.error('validation of create course request failed', validator.course.errors);
    res.status(422).json({ errors: validator.course.errors });
    return;
  }
  const authorsCreated = await db.model.User.verifyEmails(data.authors);
  if (!authorsCreated) {
    logger.error('authors', data.authors, 'have not been created yet');
    res.status(409).json({ errors: [{ dataPath: '.authors', message: `not created: ${data.authors}` }] });
    return;
  }

  data.authors = await db.model.User.mapToId(data.authors);
  const course = await db.model.Course.create(data);
  logger.info('course', course.title, 'has been created/updated, id', String(course._id));
  res.json(course);
});

module.exports = router;
