const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.course-route');
const db = require('../db');

/**
 * @swagger
 * definitions:
 *   PricingPlan:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         example: 5db3f8d7075794205c8d1c31
 *       price:
 *         type: number
 *         example: 100
 *         required: true
 *       courseId:
 *         type: string
 *         example: 5de5243b7c16184184e7fdcd
 *         required: true
 *       isRecurring:
 *         type: boolean
 *         example: false
 *       purchaseUrl:
 *         type: string
 *         example: https://example.com
 *       title:
 *         type: string,
 *         example: Test pricing plan
 *         required: true
 *       subtitle:
 *         type: string
 *         example: the way you choose to pay
 *         required: true
 *       description:
 *        type: string
 *        example: the way you choose to pay
 *       type:
 *        type: string
 *        enum: [free, subscription, one-time, pricing-plan]
 *        example: one-time
 *       period:
 *         type: number
 *         example: 150
 * /pricing-plan:
 *   post:
 *     description: updates or creates a new pricing plan
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: plan
 *         description: New Plan object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/PricingPlan'
 *     responses:
 *       200:
 *         description: created a new plan in DB
 *       422:
 *         description: model does not satisfy the expected schema
 * /pricing-plan/{course}/plan/{plan}:
 *   delete:
 *     description: updates or creates a new pricing plan
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: course
 *         in: path
 *         required: true
 *         type: string
 *       - name: plan
 *         in:  path
 *         required: true
 *         type: string
 *     responses:
 *      202:
 *        description: pricing-plan is soft deleted
 *      404:
 *        description: pricing-plan is not found by specified id
 *      500:
 *        description: internal server error
 * /pricing-plan/plan/{pricingPlan}:
 *   get:
 *     description: get pricing plans by course id
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pricingPlan
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *      202:
 *        description: pricing plan returned
 *      404:
 *        description: pricing plan is not found
 *      500:
 *        description: internal server error
 * /pricing-plan/{course}:
 *   get:
 *     description: get pricing plans by course id
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: course
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *      202:
 *        description: pricing-plans returned
 *      500:
 *        description: internal server error
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    if (!validator.pricingPlan(data)) {
      logger.error('validation of create pricing plan request failed', validator.pricingPlan.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.pricingPlan.errors });
      return;
    }

    const plan = await db.model.PricingPlan.create(data);
    logger.info('pricing plan', plan.title, 'has been created/updated, id', String(plan._id));
    res.json(plan);
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.get('/:course', async (req, res) => {
  try {
    if (!validator.getPricingByCourse(req.params)) {
      logger.error('validation of create pricing plan request failed', validator.deletePlan.errors);
      res.status(HttpStatus.BAD_REQUEST).json({ errors: validator.deletePlan.errors });
      return;
    }
    const plans = await db.model.PricingPlan.find({ courseId: req.params.course });
    res.json({
      plans
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.get('/plan/:pricingPlan', async (req, res) => {
  try {
    if (!validator.getPricing(req.params)) {
      logger.error('validation of get pricing plan request failed', validator.deletePlan.errors);
      res.status(HttpStatus.BAD_REQUEST).json({ errors: validator.deletePlan.errors });
      return;
    }
    const plan = await db.model.PricingPlan.findById(req.params.pricingPlan);
    if (!plan) {
      const error = new Error(`Plan with id ${req.params.pricingPlan} is not found`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    res.json({
      plan
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/:course/plan/:pricingPlan', async (req, res) => {
  try {
    const { params } = req;
    if (!validator.deletePlan({ params })) {
      logger.error('validation of delete pricing plan request failed', validator.deletePlan.errors);
      res.status(HttpStatus.BAD_REQUEST).json({ errors: validator.deletePlan.errors });
      return;
    }
    const deleted = await db.model.PricingPlan.delete(params.pricingPlan, params.course);
    logger.info('pricing plan', deleted.title, 'has been deleted, id', String(deleted._id));
    res.json(deleted);
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

module.exports = router;
