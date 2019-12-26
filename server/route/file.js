// const HttpStatus = require('http-status-codes');
const express = require('express');
const multer = require('multer');
const HttpStatus = require('http-status-codes');
const validator = require('../core/validator');
const router = express.Router();
const createLogger = require('../core/logger');
const wistia = require('../core/drivers/wistia-driver');
const logger = createLogger('web-server.course-route');
const upload = multer({ storage: multer.memoryStorage() });
const { generateUploadUrl, deleteFileGcs } = require('../core/file-util');
const config = require('../core/config');
const { isValidJSONString } = require('../core/util');

const API = config.get('base-path');

module.exports = app => {
  /**
   * @swagger
   * /file/gcs:
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
   * /file/wistia/{lecture}:
   *   post:
   *     description: upload file to wista
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: lecture
   *         in: path
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Lecture'
   *     responses:
   *       200:
   *         description: file is uploaded to wistia
   *       400:
   *         description: error in response
   *       401:
   *         description: invalid wistia api token
   *       422:
   *         description: model doesn't satisfy expected schema
   *       500:
   *         description: internal server error
   * /file/wistia/{hashedId}:
   *   delete:
   *     description: delete video from wistia
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: hashedId
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: file is uploaded to wistia
   *       422:
   *         description: model doesn't satisfy expected schema
   *       500:
   *         description: internal server error
   */
  router.post('/gcs', async (req, res) => {
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

  router.delete('/gcs', async (req, res) => {
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

  router.post('/wistia/:lecture', upload.single('file'), async (req, res) => {
    try {
      if (!validator.uploadWistia({ ...req.params, file: req.file || (req.files && req.files.file) })) {
        logger.error('validation of upload file to wistia request failed', validator.uploadWistia.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.uploadWistia.errors });
        return;
      }
      const { id, name, hashed_id: hashedId } = await wistia.uploadVideo(req.file, req.headers);
      res.status(HttpStatus.CREATED).json({ id, name, hashedId });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: isValidJSONString(error.message) ? JSON.parse(error.message) : error.message
      });
    }
  });

  router.delete('/wistia/:hashedId', async (req, res) => {
    try {
      if (!validator.deleteWistiaVideo(req.params)) {
        logger.error('validation of delete video from wistia request failed', validator.deleteWistiaVideo.errors);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deleteWistiaVideo.errors });
        return;
      }
      const deleted = await wistia.deleteVideo(req.params.hashedId);
      res.json({
        deleted
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: isValidJSONString(error.message) ? JSON.parse(error.message) : error.message
      });
    }
  });

  app.use(`${API}/file`, router);
};
