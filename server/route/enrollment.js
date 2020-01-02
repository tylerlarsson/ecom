const HttpStatus = require('http-status-codes');
const express = require('express');
const validator = require('../core/validator');
const wistia = require('../core/drivers/wistia-driver');
const createLogger = require('../core/logger');
const { error404 } = require('../core/util');
const { PRICING_PLAN_TYPE } = require('../db/common');
const _payment = require('../core/payment');
const logger = createLogger();
const db = require('../db');
const config = require('../core/config');
const API = config.get('base-path');

module.exports = app => {
  const router = express.Router();

  /**
   * @swagger
   * definitions:
   *   UserEnrollment:
   *     type: object
   *     properties:
   *        course:
   *          type: string
   *          required: true
   *          example: 5de67523938486465bbfdc78
   *   StepPayload:
   *     type: object
   *     properties:
   *       step:
   *         type: string
   *         required: true
   *         example: 5de67523938486465bbfdc78
   *   NewEnroll:
   *     type: object
   *     properties:
   *        user:
   *          type: string
   *          required: true
   *          example: 5de67523938486465bbfdc78
   *        course:
   *          type: string
   *          required: true
   *          example: 5de67523938486465bbfdc78
   *        pricingPlan:
   *          type: string
   *          required: true
   *          example: 5de67523938486465bbfdc78
   *        payment:
   *          oneOf:
   *            - type: object
   *              properties:
   *                order:
   *                  type: string
   *                  required: true
   *                  example: PayPal Form id fro single payment
   *            - type: object
   *              properties:
   *                amount:
   *                  type: number
   *                  required: true
   *                  example: 300
   *                source:
   *                  type: string
   *                  required: true
   *                  example: Stripe token
   * /enrollment:
   *   post:
   *     description: enrolls a user
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: payload
   *         description: New enrollment
   *         type: string
   *         in: body
   *         schema:
   *           $ref: '#/definitions/NewEnroll'
   *     responses:
   *       201:
   *         description: created a new enrollment in DB
   *       404:
   *         description: user / course / pricing plan id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   * /enrollment/{enrollment}:
   *   get:
   *     description: get enrollments by mongo id
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: enrollment
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: enrollments by id
   *       422:
   *         description: model does not satisfy expected schema
   *   put:
   *     description: add step to enrollment
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: enrollment
   *         in: path
   *         required: true
   *       - name: step
   *         in: body
   *         type: string
   *         description: Step payload
   *         schema:
   *           $ref: '#/definitions/StepPayload'
   *     responses:
   *       200:
   *         description: added step to enrollment
   *       404:
   *         description: enrollment is not found
   *       400:
   *         description: step already completed
   *       422:
   *         description: model does not satisfy expected schema
   *   delete:
   *     description: delete enrollment
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: enrollment
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: enrollment deleted
   *       422:
   *         description: model does not satisfy expected schema
   * /enrollment/course/{course}:
   *   get:
   *     description: get enrollments by course mongo id
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: course
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: enrollments by course id
   *       422:
   *         description: model does not satisfy expected schema
   * /enrollment/user/{user}:
   *   get:
   *     description: get enrollments user by mongo id
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: enrollments by user id
   *       422:
   *         description: model does not satisfy expected schema
   *   post:
   *     description: create free enrollment for user
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         in: path
   *         required: true
   *         example: 5de67523938486465bbfdc78
   *       - name: enrollment
   *         in: body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/UserEnrollment'
   *     responses:
   *       201:
   *         description: new enrollment is added for user
   *       404:
   *         description: user or course is not found
   *       422:
   *         description: model does not satisfy expected schema
   */
  router.post('/', async (req, res) => {
    try {
      if (!validator.createEnrollment(req.body)) {
        const { errors } = validator.createEnrollment;
        logger.error('validation of create enrollment request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const pricing = await db.model.PricingPlan.findById(req.body.pricingPlan);
      if (!pricing) {
        throw error404({ pricing_plan: null }, req.body.pricingPlan);
      }
      const { payment, ...rest } = req.body;
      let enrollment;
      if (pricing && pricing.type === PRICING_PLAN_TYPE.FREE) {
        enrollment = await db.model.Enrollment.enroll({ ...rest });
      } else {
        const paymentObj = await _payment(req.body.service, pricing.type, payment);
        enrollment = await db.model.Enrollment.enroll({ ...rest, payment: paymentObj });
      }
      res.status(HttpStatus.CREATED).json({
        enrollment
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.post('/user/:user', async (req, res) => {
    try {
      const { params, body } = req;
      if (!validator.addUserEnrollment({ params, body })) {
        const { errors } = validator.addUserEnrollment;
        logger.error('validation of add user enrollment request failed');
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      console.log('here');
      const enrollment = await db.model.Enrollment.enroll({ ...params, ...body });
      res.status(HttpStatus.CREATED).json({
        enrollment
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.put('/:enrollment', async (req, res) => {
    try {
      const { params, body } = req;
      if (!validator.putEnrollment({ params, body })) {
        const { errors } = validator.putEnrollment;
        logger.error('validation of put user enrollment request failed');
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      let enrollment = await db.model.Enrollment.findById(params.enrollment);
      if (!enrollment) {
        throw error404({ enrollment }, params.enrollment);
      }
      enrollment = await enrollment.addCompletedStep(body);
      res.json({
        enrollment
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/:enrollment', async (req, res) => {
    try {
      if (!validator.getEnrollment(req.params)) {
        const { errors } = validator.getEnrollment;
        logger.error('validation of get enrollment request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const enrollment = await db.model.Enrollment.findById(req.params.enrollment);
      if (!enrollment) {
        throw error404({ enrollment }, req.params.enrollment);
      }
      res.json({ enrollment });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/course/:course', async (req, res) => {
    try {
      if (!validator.getCourseEnrolls(req.params)) {
        const { errors } = validator.getCourseEnrolls;
        logger.error('validation of get enrolls by course request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const enrollments = await db.model.Enrollment.find({ course: req.params.course });
      res.json({
        enrollments
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/user/:user', async (req, res) => {
    try {
      if (!validator.getUserEnrolls(req.params)) {
        const { errors } = validator.getUserEnrolls;
        logger.error('validation of get user enrollments request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const enrollments = await db.model.Enrollment.find({ user: req.params.user });
      res.json({
        enrollments
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.delete('/:enrollment', async (req, res) => {
    try {
      if (!validator.deleteUserEnrollment(req.params)) {
        const { errors } = validator.deleteUserEnrollment;
        logger.error('validation of delete user enrollment request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      let enrollment = await db.model.Enrollment.findById(req.params.enrollment);
      if (!enrollment) {
        throw error404({ enrollment }, req.params.enrollment);
      }
      enrollment = await enrollment.delete();
      res.json({
        deleted: enrollment
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  /**
   * @swagger
   * /enrollment/visitor/visitor-overall:
   *   get:
   *     description: get visitor overall info
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: wistia info
   *       500:
   *         description: internal server error
   * /enrollment/visitor/{visitor}:
   *   get:
   *     description: get wistia stats by visitor key
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: visitor
   *         in: path
   *         required: true
   *         type: string
   *         description: Wistia visitor key
   *     responses:
   *       200:
   *         description: info by visitor key
   *       422:
   *         description: model does not satisfy expected schema
   *       500:
   *         description: internal server error
   * /enrollment/media/{media}:
   *   get:
   *     description: get wistia media stats by hashed media id
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: media
   *         in: path
   *         required: true
   *         type: string
   *         description: wistia media hashed id
   *     responses:
   *       200:
   *         description: info by media id
   *       422:
   *         description: model does not satisfy expected schema
   *       500:
   *         description: internal server error
   * /enrollment/media/{media}/heat-map/{visitor}:
   *   get:
   *     description: get wistia video heat map by hashed media id and visitor key
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: media
   *         in: path
   *         required: true
   *         type: string
   *         description: wistia media hashed id
   *       - name: visitor
   *         in: path
   *         required: true
   *         type: string
   *         description: Wistia visitor key
   *     responses:
   *       200:
   *         description: heat map
   *       422:
   *         description: model does not satisfy expected schema
   *       500:
   *         description: internal server error
   */
  router.get('/visitor/visitor-overall', async (req, res) => {
    try {
      const stats = await wistia.getVisitorOverall();
      res.json({
        stats
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/visitor/:visitor', async (req, res) => {
    try {
      if (!validator.getVisitorInfo(req.params)) {
        const { errors } = validator.getVisitorInfo;
        logger.error('validation of get wistia visitor info request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const { visitor } = req.params;
      const info = await wistia.getVisitorInfo(visitor);
      res.json({
        info
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/media/:media', async (req, res) => {
    try {
      if (!validator.getMediaStats(req.params)) {
        const { errors } = validator.getMediaStats;
        logger.error('validation of get wistia media stats request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const { media } = req.params;
      const stats = await wistia.getMediaStats(media);
      res.json({
        stats
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/media/:media/heat-map/:visitor', async (req, res) => {
    try {
      if (!validator.getHeatMap(req.params)) {
        const { errors } = validator.getHeatMap;
        logger.error('validation of get wistia video heat map request failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const { media, visitor } = req.params;
      const heatMap = await wistia.getVideoHeatMap(media, visitor);
      res.json({
        heatMap
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({});
    }
  });

  app.use(`${API}/enrollment`, router);
};
