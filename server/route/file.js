// const HttpStatus = require('http-status-codes');
const express = require('express');
const HttpStatus = require('http-status-codes');
const validator = require('../core/validator');
const router = express.Router();
const createLogger = require('../core/logger');
const logger = createLogger('web-server.course-route');
const { generateUploadUrl, deleteFileGcs } = require('../core/file-util');
const config = require('../core/config');
const API = config.get('base-path');

module.exports = app => {
  /**
   * @swagger
   * /file/image:
   *   delete:
   *     description: delete file from gcs by given url
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: url
   *         in: query
   *       - name: bucket
   *         in: query
   *     responses:
   *       204:
   *         description: deleted
   *       500:
   *         description: internal server error
   *   post:
   *     description: get sign url
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: image
   *         required: true
   *         in: body
   *       - name: bucket
   *         in: body
   *     responses:
   *       200:
   *         description: returns link for upload to gcs
   *       500:
   *         description: internal server error
   */
  router.post('/image', async (req, res) => {
    try {
      if (!validator.uploadGcs(req.body)) {
        logger.error('validation of upload to request failed', validator.uploadGcs.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.uploadGcs.errors });
        return;
      }
      const { image, expires, bucket } = req.body;
      const url = await generateUploadUrl(image, expires, bucket);
      res.json({
        url
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });

  router.delete('/image', async (req, res) => {
    try {
      if (!validator.deleteGcs(req.query)) {
        logger.error('validation of upload to request failed', validator.deleteGcs.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deleteGcs.errors });
        return;
      }
      const { url, bucket } = req.query;
      await deleteFileGcs(url, bucket);
      res.status(HttpStatus.NO_CONTENT).json({
        deleted: true
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });
  app.use(`${API}/file`, router);
};
