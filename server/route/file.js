// const HttpStatus = require('http-status-codes');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { generateUploadUrl, deleteFileGcs } = require('../file-util');
multer({ storage: multer.memoryStorage() });

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
    const { image, bucket } = req.body;
    const url = await generateUploadUrl(image, bucket);
    res.json({
      url
    });
  } catch (error) {
    res.status(500).json({
      errors: error.message
    });
  }
});

router.delete('/image', async (req, res) => {
  try {
    const { url, bucket } = req.query;
    await deleteFileGcs(url, bucket);
    res.status(200).json({
      deleted: true
    });
  } catch (error) {
    res.status(500).json({
      errors: error.message
    });
  }
});

module.exports = router;
