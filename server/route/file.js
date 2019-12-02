// const HttpStatus = require('http-status-codes');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { generateUploadUrl } = require('../file-util');
multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /file/image:
 *   post:
 *     description: get sign url
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: image
 *         in: body
 *     responses:
 *       200:
 *         description: returns link for upload to gcs
 *       500:
 *         description: internal server error
 */
router.post('/image', async (req, res) => {
  try {
    const { image } = req.body;
    const url = await generateUploadUrl(image);
    res.json({
      url
    });
  } catch (error) {
    res.status(500).json({
      errors: error.message
    });
  }
});

module.exports = router;
