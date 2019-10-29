const express = require('express');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
const logger = createLogger('web-server.role-route');

/**
 * @swagger
 * definitions:
 *   Role:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       permissions:
 *         type: array
 *         items:
 *           type: string
 *
 * /role:
 *   post:
 *     description: updates or creates a new role
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: role
 *         description: New Role object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Role'
 *     responses:
 *       200:
 *         description: created a new role in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *       409:
 *         description: role with this name already exists
 *
 */
router.post('/', async (req, res) => {
  const data = req.body;

  if (!validator.newRole(data)) {
    logger.error('validation of the new role failed', validator.newRole.errors);
    res.status(422).json({ errors: validator.newRole.errors });
    return;
  }

  if (!data.id) {
    // new role - check the name
    const existing = await db.model.Role.findOne({ name: data.name });
    if (existing) {
      logger.error('role', data.name, 'already exists');
      res.status(409).json({ errors: [{ dataPath: '.name', message: 'already exists' }] });
      return;
    }
  }

  const notCreatedPermissions = await db.model.Permission.findNotCreatedPermissions(data.permissions);
  if (notCreatedPermissions.length) {
    logger.error('permissions', notCreatedPermissions, 'have not been created yet');
    res
      .status(409)
      .json({ errors: [{ dataPath: '.permissions', message: `not created, ids: ${notCreatedPermissions}` }] });
    return;
  }

  const role = await db.model.Role.create(data);
  logger.info('role', role.name, 'has been created/updated, id', String(role._id));
  res.json(role);
});

/**
 * @swagger
 * /role/{id}/permission/{permission}:
 *   post:
 *     parameters:
 *       - name: id
 *         description: role id to assign the permission
 *         in: path
 *       - name: permission
 *         description: permission id to assign
 *         in: path
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns number of affected rules 1/0
 *
 */
router.post('/:id/permission/:permission', async (req, res) => {
  const data = req.params;

  if (!validator.assignPermission(data)) {
    logger.error('validation of the new permission failed', validator.assignPermission.errors);
    res.status(422).json({ errors: validator.assignPermission.errors });
    return;
  }

  const exists = await db.model.Role.count({ _id: data.id });
  if (!exists) {
    logger.error('role not found, id', data.id);
    res.status(422).json({ errors: [{ dataPath: '.id', message: 'role not found for provided id' }] });
    return;
  }

  const { nModified } = await db.model.Role.updateOne(
    { _id: data.id },
    { $addToSet: { permissions: data.permission } }
  );

  logger.info('roles modified', nModified);
  return res.json({ modified: nModified });
});

/**
 * @swagger
 * /role/{id}/permission/{permission}:
 *   delete:
 *     parameters:
 *       - name: id
 *         description: role id to remove the permission from
 *         in: path
 *       - name: permission
 *         description: permission id to delete
 *         in: path
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns number of affected rules 1/0
 *
 */
router.delete('/:id/permission/:permission', async (req, res) => {
  const data = req.params;

  if (!validator.assignPermission(data)) {
    logger.error('validation of the permission failed', validator.assignPermission.errors);
    res.status(422).json({ errors: validator.assignPermission.errors });
    return;
  }

  const exists = await db.model.Role.count({ _id: data.id });
  if (!exists) {
    logger.error('role not found, id', data.id);
    res.status(422).json({ errors: [{ dataPath: '.id', message: 'role not found for provided id' }] });
    return;
  }

  const { nModified } = await db.model.Role.updateOne({ _id: data.id }, { $pull: { permissions: data.permission } });

  logger.info('roles modified', nModified);
  return res.json({ modified: nModified });
});

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     parameters:
 *       - name: id
 *         description: id to delete
 *         in: path
 *     description: deletes the role
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns deleted roles count - 1/0
 *       422:
 *         description: no id provided
 *
 */
router.delete('/:id', async (req, res) => {
  const data = req.params;

  if (!validator.mongoId(data)) {
    logger.error('validation of role delete request failed', validator.mongoId.errors);
    res.status(422).json({ errors: validator.mongoId.errors });
    return;
  }

  const result = await db.model.Role.deleteOne({ _id: data.id });
  if (result.deletedCount) {
    logger.info('role, id', data.id, 'has been deleted');
  } else {
    logger.error('could not delete role, id', data.id);
  }
  res.json({ deleted: result.deletedCount });
});

/**
 * @swagger
 * /role:
 *   get:
 *     description: Get all the roles with assigned permissionss
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns roles
 *
 */
router.get('/', async (req, res) => {
  // TODO pagination
  const result = await db.model.Role.find().populate('permissions');
  res.json(result);
});

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     parameters:
 *       - name: id
 *         description: id
 *         in:  path
 *     description: Get the role by id with assigned permissions
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns role object or null if not found
 *       422:
 *         description: id is wrong
 *
 */
router.get('/:id', async (req, res) => {
  const { params } = req;

  if (!validator.mongoId(params)) {
    logger.error('validation of role delete request failed', validator.mongoId.errors);
    res.status(422).json({ errors: validator.mongoId.errors });
    return;
  }

  const result = await db.model.Role.findById(params.id).populate('permissions');
  res.json(result);
});

module.exports = router;
