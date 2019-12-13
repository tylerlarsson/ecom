const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.course-route');
const db = require('../db');
const paginated = require('../middleware/page-request');

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
 *       409:
 *         description: not all authors have been created
 *       422:
 *         description: model does not satisfy the expected schema
 *
 */
router.post('/', async (req, res) => {
  const data = req.body;

  if (!validator.course(data)) {
    logger.error('validation of create course request failed', validator.course.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.course.errors });
    return;
  }
  const authorsCreated = await db.model.User.verifyEmails(data.authors);
  if (!authorsCreated) {
    logger.error('authors', data.authors, 'have not been created yet');
    res
      .status(HttpStatus.CONFLICT)
      .json({ errors: [{ dataPath: '.authors', message: `not created: ${data.authors}` }] });
    return;
  }

  try {
    data.authors = await db.model.User.mapToId(data.authors);
    const course = await db.model.Course.create(data);
    logger.info('course', course.title, 'has been created/updated, id', String(course._id));
    res.json(course);
  } catch (error) {
    console.error(error);
  }
});

/**
 * @swagger
 * definitions:
 *   SectionUpdate:
 *     type: object
 *     properties:
 *       index:
 *         type: number,
 *         example: 0
 *         description: index of section to update
 *       section:
 *         type: string
 *         example: 5de674f6b5e0a845f3c94b5d
 *         description: mongo id of section
 *       title:
 *         type: string,
 *         example: Get started
 *         required: true
 *   Section:
 *     type: object
 *     properties:
 *       index:
 *         type: number,
 *         example: 0
 *         description: index of section to update
 *       title:
 *         type: string,
 *         example: Get started
 *         required: true
 * /course/{course}/section:
 *   post:
 *     description: updates or creates a new section
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: course
 *         in: path
 *       - name: section
 *         description: New section
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/SectionUpdate'
 *     responses:
 *       200:
 *         description: created a new course in DB
 *       409:
 *         description: course id does not exist
 *       422:
 *         description: model does not satisfy the expected schema
 * /course/{course}/section/{section}:
 *   delete:
 *    description: delete section from a course
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: course
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Course'
 *      - name: section
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Section'
 *    responses:
 *      202:
 *        description: section is soft deleted
 *      404:
 *        description: section or course is not found by specified id
 *      500:
 *        description: internal server error
 */
router.post('/:course/section', async (req, res) => {
  const { body, params } = req;
  if (!validator.courseSection({ body, params })) {
    console.error('validation of create course section request failed', validator.courseSection.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.courseSection.errors });
    return;
  }
  try {
    const course = await db.model.Course.findById(params.course);
    if (!course) {
      logger.error('course not found, id', params.course);
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ errors: [{ dataPath: 'course.id', message: 'course not found for provided id' }] });
      return;
    }
    const sections = await course.createSection(body);
    res.json({ sections });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/:course/section/:section', async (req, res) => {
  const { params } = req;
  if (!validator.deleteSection({ params })) {
    logger.error('validation of create course section request failed', validator.deleteSection.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deleteSection.errors });
    return;
  }
  try {
    const course = await db.model.Course.findById(params.course);
    if (!course) {
      const error = new Error(`Course with id ${params.course} is not found`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const _course = await course.deleteSection(params.section);
    res.status(HttpStatus.ACCEPTED).json({
      course: _course
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ errors: error.message });
  }
});

/**
 * @swagger
 * definitions:
 *   Content:
 *     type: object
 *     properties:
 *       index:
 *         type: number
 *         example: 0
 *         description: index of content in lecture
 *       type:
 *         type: string
 *         description: type of content
 *         required: true
 *       content:
 *         type: string
 *         description: content of txt type
 *       url:
 *         type: string
 *         description: link for img type
 *   Lecture:
 *     type: object
 *     properties:
 *       index:
 *         type: number,
 *         example: 0
 *         description: index of lecture to update
 *       title:
 *         type: string,
 *         example: Get started
 *         required: true
 *       file:
 *         type: string,
 *         example: file
 *         required: true
 *       image:
 *         type: string,
 *         example: image
 *         required: true
 *       text:
 *         type: string,
 *         example: lecture text
 *         required: true
 *       allowComments:
 *         type: boolean,
 *         example: true
 *         required: true
 *       state:
 *         type: string,
 *         enum: [active,draft]
 *         required: true
 *   LecturePut:
 *     type: object
 *     properties:
 *       index:
 *         type: number,
 *         example: 0
 *         description: index of lecture to update
 *       title:
 *         type: string,
 *         example: Get started
 *       file:
 *         type: string,
 *         example: file
 *       image:
 *         type: string,
 *         example: image
 *       text:
 *         type: string,
 *         example: lecture text
 *       allowComments:
 *         type: boolean,
 *         example: true
 *       state:
 *         type: string,
 *         enum: [active,draft]
 *   LecturePost:
 *     type: object
 *     properties:
 *       index:
 *         type: number
 *         example: 0
 *         description: index of lecture to update
 *       id:
 *         type: string
 *         example: 5de67523938486465bbfdc78
 *         description: mongo id of lecture to update
 *       title:
 *         type: string
 *         example: Get started
 *         required: true
 *       file:
 *         type: string
 *         example: file
 *         required: true
 *       image:
 *         type: string
 *         example: image
 *         required: true
 *       text:
 *         type: string
 *         example: lecture text
 *         required: true
 *       allowComments:
 *         type: boolean
 *         example: true
 *         required: true
 *       content:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Content'
 *       state:
 *         type: string
 *         enum: [active,draft]
 *         required: true
 * /course/{course}/section/{section}/lecture:
 *   post:
 *     description: updates or creates a new lecture
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: course
 *         in: path
 *       - name: section
 *         in: path
 *       - name: lecture
 *         description: New lecture
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/LecturePost'
 *     responses:
 *       200:
 *         description: created a new lecture in DB
 *       409:
 *         description: course id does not exist
 *       422:
 *         description: model does not satisfy the expected schema
 * /course/{course}/section/{section}/lecture/{lecture}:
 *   put:
 *    description: update lecture dynamically
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: course
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Course'
 *      - name: section
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Section'
 *      - name: lecture
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Lecture'
 *      - name: lecture
 *        description: New lecture
 *        in:  body
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/LecturePut'
 *   delete:
 *    description: delete lecture from a section
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: course
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Course'
 *      - name: section
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Section'
 *      - name: lecture
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Lecture'
 *    responses:
 *      202:
 *        description: lecture is deleted
 *      404:
 *        description: section or lecture is not found by specified id
 *      500:
 *        description: internal server error
 *
 */
router.post('/:course/section/:section/lecture', async (req, res) => {
  try {
    const { body, params } = req;
    if (!validator.courseLecture({ body, params })) {
      logger.error('validation of create course lecture request failed', validator.courseLecture.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.courseLecture.errors });
      return;
    }
    const course = await db.model.Course.findById(params.course);
    if (!course) {
      const error = new Error(`Course with id ${params.course} is not found`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const lectures = await course.createLecture({ ...body, ...params });
    res.status(HttpStatus.CREATED).json({ lectures });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ errors: error.message });
  }
});

router.delete('/:course/section/:section/lecture/:lecture', async (req, res) => {
  const { params } = req;
  if (!validator.deleteLecture({ params })) {
    const { errors } = validator.deleteLecture;
    logger.error('Validation of delete lecture request is failed', errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
    return;
  }
  try {
    const course = await db.model.Course.findById(params.course);
    if (!course) {
      const error = new Error(`Course with id ${params.course} is not found`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const lectures = await course.deleteLecture(params.section, params.lecture);
    res.status(HttpStatus.ACCEPTED).json({
      lectures
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ errors: error.message });
  }
});

router.put('/:course/section/:section/lecture/:lecture', async (req, res) => {
  const { params, body } = req;
  if (!validator.putLecture({ params, body })) {
    const { errors } = validator.putLecture;
    logger.error('Validation of delete lecture request is failed', errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
    return;
  }
  try {
    const course = await db.model.Course.findById(params.course);
    if (!course) {
      const error = new Error(`Course with id ${params.course} is not found`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const lectures = await course.editLecture({ ...params, ...body });
    res.status(HttpStatus.OK).json({
      lectures
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

/**
 * @swagger
 * /course:
 *   get:
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *         required: false
 *         default: 0
 *       - name: pageSize
 *         in: query
 *         required: false
 *         default: 20
 *     description: Get all the courses
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns courses
 *
 */
router.get('/', paginated(20), async (req, res) => {
  const total = await db.model.Course.countDocuments(req.filter);
  const data = await db.model.Course.find(req.filter)
    .limit(req.page.limit)
    .skip(req.page.skip);
  res.json({
    total,
    data
  });
});

/**
 * @swagger
 * /course/{course}:
 *  get:
 *    description: get course by mongo id
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: course
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Course'
 *    responses:
 *      200:
 *        description: course by id is found
 *      400:
 *        description: no course in url path
 *      404:
 *        description: no course in mongodb
 *  delete:
 *    description: delete course by mongo id
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: course
 *        in: path
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/Course'
 *    responses:
 *      202:
 *        description: course is deleted
 *      404:
 *        description: course is not found by specified id
 *      500:
 *        description: internal server error
 */
router.get('/:course', async (req, res) => {
  const { params } = req;
  try {
    if (!validator.getCourse({ params })) {
      const { errors } = validator.getCourse;
      logger.error('Validation of get course request is failed', errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
      return;
    }
    const course = await db.model.Course.findById(params.course);
    if (!course) {
      const error = new Error(`Course with id ${params.course} is not found`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    res.json({
      course
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/:course', async (req, res) => {
  const { params } = req;
  if (!validator.getCourse({ params })) {
    const { errors } = validator.getCourse;
    logger.error('Validation of get course request is failed', errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
    return;
  }
  try {
    const course = await db.model.Course.deleteCourse(params.course);
    res.status(HttpStatus.ACCEPTED).json({
      course
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

module.exports = router;
