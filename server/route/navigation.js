const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();
// const validator = require('../validator');
// const createLogger = require('../logger');
// const logger = createLogger('web-server.page-route');
const db = require('../db');

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
 * /navigation/links/{link}:
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

router.get('/:course', async (req, res) => {
  try {
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

router.put('/links/:navigation', async (req, res) => {
  try {
    const { params, body } = req;
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
    const updated = await db.model.Navigation.addLink({ navigation: params.navigation, ...body });
    res.status(HttpStatus.CREATED).json({
      navigation: updated
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/links/:link', async (req, res) => {
  try {
    const { params } = req;
    const deleted = await db.model.Navigation.deleteLink({ ...params });
    res.status(HttpStatus.OK).json({
      deleted
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

module.exports = router;
