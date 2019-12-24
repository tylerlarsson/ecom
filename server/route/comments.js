const express = require('express');
const HttpStatus = require('http-status-codes');
const db = require('../db');
const config = require('../core/config');
const validator = require('../core/validator');
const createLogger = require('../core/logger');

const logger = createLogger();
const API = config.get('base-path');

module.exports = app => {
  const router = express.Router();

  /**
   * @swagger
   * definitions:
   *    InternalComment:
   *      type: object
   *      properties:
   *        user:
   *          type: string
   *          example: 5de67523938486465bbfdc78
   *          required: true
   *        commentator:
   *          type: string
   *          required: true
   *          example: 5de67523938486465bbfdc78
   *        content:
   *          type: string
   *          example: Example Content
   * /comments/internal:
   *  post:
   *    description: add internal comments on the account
   *    consumes:
   *      - application/json
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: comment
   *        in: body
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/InternalComment'
   *    responses:
   *      201:
   *        description: created comment
   *      404:
   *        description: commentator or user is not found
   *      422:
   *        description: model doesn't satisfy expected schema
   * /comments/internal/{comment}:
   *  delete:
   *    description: delete comment from the account
   *    consumes:
   *      - application/json
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: comment
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/InternalComment'
   *    responses:
   *      200:
   *        description: deleted comment
   *      404:
   *        description: comment is not found
   *      422:
   *        description: model doesn't satisfy expected schema
   */
  router.post('/internal', async (req, res) => {
    try {
      if (!validator.createComment(req.body)) {
        const { errors } = validator.createComment;
        logger.error('Validation of create comment request is failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const comment = await db.model.InternalComment.create(req.body);
      logger.info('Comment is created, id:', comment._id);
      res.status(HttpStatus.CREATED).json({
        comment
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.delete('/internal/:comment', async (req, res) => {
    try {
      if (!validator.deleteComment(req.params)) {
        const { errors } = validator.deleteComment;
        logger.error('Validation of delete comment request is failed', errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
        return;
      }
      const comment = await db.model.InternalComment.delete(req.params.comment);
      // if (!comment) throw error404({ comment }, req.params.comment);
      logger.info('Comment with id', comment._id, 'is deleted.');
      res.json({ comment });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });
  app.use(`${API}/comments`, router);
};
