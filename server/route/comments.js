const express = require('express');
const HttpStatus = require('http-status-codes');
const db = require('../db');
const { error404 } = require('../core/util');
const config = require('../core/config');
const API = config.get('base-path');

// TODO: swagger and validation

module.exports = app => {
  const router = express.Router();
  router.post('/internal', async (req, res) => {
    try {
      const comment = await db.model.InternalComment.create(req.body);
      res.json(HttpStatus.CREATED).json({
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
      const comment = await db.model.InternalComment.findByIdAndDelete(req.params.comment);
      if (!comment) throw error404({ comment }, req.params.comment);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.message
      });
    }
  });
  app.use(`${API}/comments`, router);
};
