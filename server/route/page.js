const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.page-route');
const db = require('../db');

/**
 * @swagger
 * definitions:
 *    Content:
 *      type: object
 *      properties:
 *        index:
 *          type: number
 *          example: 0
 *          required: true
 *        type:
 *          type: string
 *          enum: [video,image,text]
 *        content:
 *          type: string
 *          required: true
 *    ContentPut:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: 5de67523938486465bbfdc78
 *        index:
 *          type: number
 *          example: 0
 *          required: true
 *        type:
 *          type: string
 *          enum: [video,image,text]
 *        content:
 *          type: string
 *          required: true
 *    Page:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: 5de67523938486465bbfdc78
 *        title:
 *          type: string
 *          example: Welcome Page
 *        content:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Content'
 *        url:
 *          type: string
 *          example: https://example.com
 *        course:
 *          type: string
 *          example: 5de67523938486465bbfdc76
 *        status:
 *          type: string
 *          enum: [active,published]
 *        showFooter:
 *          type: boolean
 *          example: true
 *        showNavigation:
 *          type: boolean
 *          example: false
 *        description:
 *          type: string
 *          example: I'm description
 *    PagePost:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          example: Welcome Page
 *        content:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Content'
 *        url:
 *          type: string
 *          required: true
 *          example: https://example.com
 *        course:
 *          type: string
 *          required: true
 *          example: 5de67523938486465bbfdc76
 *        status:
 *          type: string
 *          enum: [active,published]
 *        showFooter:
 *          type: boolean
 *          example: true
 *        showNavigation:
 *          type: boolean
 *          example: false
 *        description:
 *          type: string
 *          example: I'm description
 *    PagePut:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          required: true
 *          example: 5de67523938486465bbfdc78
 *        title:
 *          type: string
 *          example: Welcome Page
 *        content:
 *          type: array
 *          items:
 *            $ref: '#/definitions/ContentPut'
 *        url:
 *          type: string
 *          example: https://example.com
 *        course:
 *          type: string
 *          required: true
 *          example: 5de67523938486465bbfdc76
 *        status:
 *          type: string
 *          enum: [active,published]
 *        showFooter:
 *          type: boolean
 *          example: true
 *        showNavigation:
 *          type: boolean
 *          example: false
 *        description:
 *          type: string
 *          example: I'm description
 * /page:
 *   post:
 *     description: creates a new page
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: body
 *         description: New page
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/PagePost'
 *     responses:
 *       200:
 *         description: created a new page in DB
 *       404:
 *         description: course is not found in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *   put:
 *     description: update page by provided mongo id
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: path
 *       - name: page
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/PagePut'
 *     responses:
 *       200:
 *         description: created a new page in DB
 *       404:
 *         description: course is not found in DB
 *       422:
 *         description: model does not satisfy the expected schema

 * /page/{page}:
 *   delete:
 *     description: delete page by specified id
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: path
 *     responses:
 *       200:
 *         description: deleted page from DB
 *       422:
 *         description: model does not satisfy the expected schema
 *   get:
 *     description: get page by specified id
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: path
 *     responses:
 *       200:
 *         description: course is found in DB
 *       404:
 *         description: course is not found
 *       422:
 *         description: model does not satisfy the expected schema
 * /page/course/{course}:
 *   get:
 *     description: get pages by specified course id
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: course
 *         in: path
 *     responses:
 *       200:
 *         description: courses by course id
 *       422:
 *         description: model does not satisfy the expected schema
 * /page/{page}/content:
 *   post:
 *     description: add new content to page model
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: path
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Page'
 *       - name: content
 *         in: body
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Content'
 *     responses:
 *       201:
 *         description: new content created in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *       404:
 *         description: page is not found in DB
 *   put:
 *     description: edit content inside page model
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: path
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Page'
 *       - name: content
 *         in: body
 *         type: string
 *         schema:
 *           $ref: '#/definitions/ContentPut'
 *     responses:
 *       200:
 *         description: new content created in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *       404:
 *         description: page or content is not found in DB
 * /page/{page}/content/{content}:
 *   delete:
 *     description: deletes content from page model
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: path
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Page'
 *       - name: content
 *         in: path
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Content'
 *     responses:
 *       200:
 *         description: content deleted from page model
 *       422:
 *         description: model does not satisfy the expected schema
 *       404:
 *         description: page or content is not found in DB
 */
router.post('/', async (req, res) => {
  try {
    if (!validator.newPage(req.body)) {
      logger.error('validation of create new page request failed', validator.newPage.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.newPage.errors });
      return;
    }
    const page = await db.model.Page.createPage(req.body);
    res.json({
      page
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.put('/', async (req, res) => {
  try {
    if (!validator.editPage(req.body)) {
      logger.error('validation of create course request failed', validator.editPage.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.editPage.errors });
      return;
    }
    const edited = await db.model.Page.editPage(req.body);
    res.json({
      page: edited
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.post('/:page/content', async (req, res) => {
  try {
    const { params, body } = req;
    if (!validator.createContent({ params, body })) {
      logger.error('validation of delete create request failed', validator.createContent.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.createContent.errors });
      return;
    }
    const page = await db.model.Page.findById(params.page);
    if (!page) {
      const error = new Error(`Page with id ${params.page} is not found.`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const updated = await page.addContent(body);
    res.status(HttpStatus.CREATED).json({
      page: updated
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.put('/:page/content', async (req, res) => {
  try {
    const { params, body } = req;
    if (!validator.editContent({ params, body })) {
      logger.error('validation of delete create request failed', validator.editContent.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.editContent.errors });
      return;
    }
    const page = await db.model.Page.findById(params.page);
    if (!page) {
      const error = new Error(`Page with id ${params.page} is not found.`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const updated = await page.editContent(body);
    res.status(HttpStatus.OK).json({
      page: updated
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/:page/content/:content', async (req, res) => {
  try {
    if (!validator.deleteContent(req.params)) {
      logger.error('validation of delete content request failed', validator.deleteContent.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deleteContent.errors });
      return;
    }
    const page = await db.model.Page.findById(req.params.page);
    if (!page) {
      const error = new Error(`Page with id ${req.params.page} is not found.`);
      error.status = HttpStatus.NOT_FOUND;
      throw error;
    }
    const updated = await page.removeContent(req.params.content);
    res.json({
      page: updated
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/:page', async (req, res) => {
  if (!validator.deletePage(req.params)) {
    logger.error('validation of delete page request failed', validator.deletePage.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deletePage.errors });
    return;
  }
  const deleted = await db.model.Page.findByIdAndDelete(req.params.page);
  res.json({
    page: deleted
  });
});

router.get('/:page', async (req, res) => {
  const { deletePage: getPage } = validator;
  if (!getPage(req.params)) {
    logger.error('validation of get page request failed', getPage.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: getPage.errors });
    return;
  }
  const page = await db.model.Page.findById(req.params.page);
  let status = HttpStatus.OK;
  if (!page) status = HttpStatus.NOT_FOUND;
  res.status(status).json({
    page
  });
});

router.get('/course/:course', async (req, res) => {
  if (!validator.getCourse({ params: req.params })) {
    logger.error('validation of delete page request failed', validator.getCourse.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.getCourse.errors });
    return;
  }
  const pages = await db.model.Page.find({ course: req.params.course });
  res.json({
    pages
  });
});

module.exports = router;
