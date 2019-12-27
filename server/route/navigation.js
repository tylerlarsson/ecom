const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();
const validator = require('../core/validator');
const createLogger = require('../core/logger');
const logger = createLogger('web-server.page-route');
const db = require('../db');
const config = require('../core/config');
const API = config.get('base-path');

module.exports = app => {
  /**
   * @swagger
   * definitions:
   *    LinkPut:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *          example: 5de67523938486465bbfdc78
   *          required: true
   *        text:
   *          type: string
   *          example: Example Text
   *        url:
   *          type: string
   *          example: Example Url
   *        visibleTo:
   *          type: string
   *          example: nobody
   *          enum: [all,logged-in,logged-out,nobody]
   *    Link:
   *      type: object
   *      properties:
   *        text:
   *          type: string
   *          example: Example Text
   *        url:
   *          type: string
   *          example: Example Url
   *        visibleTo:
   *          type: string
   *          example: nobody
   *          enum: [all,logged-in,logged-out,nobody]
   *    Navigation:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *          example: 5de67523938486465bbfdc78
   *        title:
   *          type: string
   *          example: Example Title
   *        location:
   *          type: string
   *          enum: [top,bottom]
   *          example: top
   *        course:
   *          type: string
   *          example: 5de67523938486465bbfdc78
   *        links:
   *          type: array
   *          items:
   *            $ref: '#/definitions/Link'
   *    NavigationPost:
   *      type: object
   *      properties:
   *        title:
   *          type: string
   *          required: true
   *          example: Example Title
   *        location:
   *          type: string
   *          enum: [top,bottom]
   *          example: top
   *        course:
   *          type: string
   *          required: true
   *          example: 5de67523938486465bbfdc78
   *        links:
   *          type: array
   *          items:
   *            $ref: '#/definitions/Link'
   * /navigation:
   *   post:
   *     description: creates new navigation
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: navigation
   *         in: body
   *         required: true
   *         description: New navigation
   *         schema:
   *           $ref: '#/definitions/NavigationPost'
   *     responses:
   *       200:
   *         description: created a new navigation in DB
   *       404:
   *         description: navigation id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   *   put:
   *     description: dynamically updates new navigation
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: navigation
   *         in: body
   *         required: true
   *         description: Navigation id with fields to change
   *         schema:
   *           $ref: '#/definitions/Navigation'
   *     responses:
   *       200:
   *         description: updated a navigation in DB
   *       404:
   *         description: navigation id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   * /navigation/links/{navigation}:
   *   put:
   *     description: dynamically updates link
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: navigation
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Navigation'
   *       - name: link
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/LinkPut'
   *     responses:
   *       200:
   *         description: updated a link in DB
   *       404:
   *         description: navigation or link doesn't exist
   *       422:
   *         description: model does not satisfy the expected schema
   *   post:
   *     description: creates new link
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: navigation
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Navigation'
   *       - name: link
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Link'
   *     responses:
   *       200:
   *         description: created a new link in DB
   *       404:
   *         description: navigation id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   * /navigation/links/{navigation}/{link}:
   *   delete:
   *     description: delete a link from DB
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: link
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Link'
   *       - name: navigation
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Navigation'
   *     responses:
   *       200:
   *         description: deleted a link in DB
   *       404:
   *         description: link id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   * /navigation/{course}:
   *   get:
   *     description: get navigations by course
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: course
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Course'
   *     responses:
   *       200:
   *         description: fetched navigations by course
   *       422:
   *         description: model does not satisfy the expected schema
   * /navigation/{course}/{navigation}:
   *   delete:
   *     description: delete navigation
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: course
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Course'
   *       - name: navigation
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Navigation'
   *     responses:
   *       200:
   *         description: fetched navigations by course
   *       404:
   *         description: course id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   */
  router.post('/', async (req, res) => {
    try {
      if (!validator.createNavigation(req.body)) {
        logger.error('validation of create navigation request failed', validator.createNavigation.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.createNavigation.errors });
        return;
      }
      const created = await db.model.Navigation.createNavigation(req.body);
      res.status(HttpStatus.CREATED).json({
        navigation: created
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.put('/', async (req, res) => {
    try {
      if (!validator.editNavigation(req.body)) {
        logger.error('validation of edit navigation request failed', validator.editNavigation.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.editNavigation.errors });
        return;
      }
      const updated = await db.model.Navigation.editNavigation(req.body);
      res.status(HttpStatus.OK).json({
        navigation: updated
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.put('/links/:navigation', async (req, res) => {
    try {
      const { params, body } = req;
      if (!validator.editLink({ params, body })) {
        logger.error('validation of edit link request failed', validator.editLink.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.editLink.errors });
        return;
      }
      const updated = await db.model.Navigation.editLink({ ...params, ...body });
      res.status(HttpStatus.OK).json({
        navigation: updated
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.post('/links/:navigation', async (req, res) => {
    try {
      const { params, body } = req;
      if (!validator.createLink({ params, body })) {
        logger.error('validation of create link request failed', validator.createLink.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.createLink.errors });
        return;
      }
      const updated = await db.model.Navigation.addLink({ navigation: params.navigation, ...body });
      res.status(HttpStatus.CREATED).json({
        navigation: updated
      });
    } catch (error) {
      console.error('POST LINK ERROR:', error);
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.delete('/links/:navigation/:link', async (req, res) => {
    try {
      const { params } = req;
      if (!validator.deleteLink(params)) {
        logger.error('validation of delete link request failed', validator.deleteLink.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deleteLink.errors });
        return;
      }
      const nav = await db.model.Navigation.findById(params.navigation);
      if (!nav) {
        const error = new Error(`No nav with id ${params.navigation} id found.`);
        error.status = HttpStatus.NOT_FOUND;
        throw error;
      }
      const deleted = await nav.deleteLink({ link: params.link });
      res.status(HttpStatus.OK).json({
        deleted
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.get('/:course', async (req, res) => {
    try {
      if (!validator.getNavigation(req.params)) {
        logger.error('validation of edit navigation request failed', validator.getNavigation.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.getNavigation.errors });
        return;
      }
      const navigations = await db.model.Navigation.find({ course: req.params.course });
      res.json({
        navigations
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.delete('/:course/:navigation', async (req, res) => {
    try {
      if (!validator.deleteNavigation(req.params)) {
        logger.error('validation of delete navigation request failed', validator.deleteNavigation.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deleteNavigation.errors });
        return;
      }
      const { navigation: id, ...rest } = req.params;
      const deleted = await db.model.Navigation.deleteNavigation({ id, ...rest });
      res.status(HttpStatus.OK).json({
        deleted
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });
  app.use(`${API}/navigation`, router);
};
