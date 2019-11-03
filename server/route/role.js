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
 *         type: string,
 *         example: 5db3f8d7075794205c8d1c31
 *       name:
 *         type: string,
 *         example: admin-role
 *       description:
 *         type: string,
 *         example: this role is for web app admnins
 *       permissions:
 *         type: array
 *         items:
 *           type: string
 *           example: 5db3f8d7075794205c8d1c31
 *           description: name or id of permission
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

  data.permissions = await db.model.Permission.mapToId(data.permissions);
  const role = await db.model.Role.create(data);
  logger.info('role', role.name, 'has been created/updated, id', String(role._id));
  res.json(role);
});

/**
 * @swagger
 * /role/{role}/permission/{permission}:
 *   post:
 *     parameters:
 *       - name: role
 *         description: role id or name to assign the permission
 *         in: path
 *         example: admin
 *       - name: permission
 *         description: permission id or name to assign
 *         in: path
 *         example: \*
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns number of affected rules 1/0
 *
 */
router.post('/:role/permission/:permission', async (req, res) => {
  const data = req.params;

  if (!validator.assignPermission(data)) {
    logger.error('validation of the new permission failed', validator.assignPermission.errors);
    res.status(422).json({ errors: validator.assignPermission.errors });
    return;
  }

  const [roleId] = await db.model.Role.mapToId([data.role]);

  const exists = await db.model.Role.count({ _id: roleId });
  if (!exists) {
    logger.error('role not found, id/name', data.role);
    res.status(422).json({ errors: [{ dataPath: '.id', message: 'role not found for provided id' }] });
    return;
  }

  const [permissionId] = await db.model.Permission.mapToId(data.permission);
  const { nModified } = await db.model.Role.updateOne({ _id: roleId }, { $addToSet: { permissions: permissionId } });

  logger.info('roles modified', nModified);
  return res.json({ modified: nModified });
});

/**
 * @swagger
 * /role/{role}/permission/{permission}:
 *   delete:
 *     parameters:
 *       - name: role
 *         description: role id or name to remove the permission from
 *         in: path
 *       - name: permission
 *         description: permission id or name to delete
 *         in: path
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns number of affected rules 1/0
 *
 */
router.delete('/:role/permission/:permission', async (req, res) => {
  const data = req.params;

  if (!validator.assignPermission(data)) {
    logger.error('validation of the permission failed', validator.assignPermission.errors);
    res.status(422).json({ errors: validator.assignPermission.errors });
    return;
  }

  const [roleId] = await db.model.Role.mapToId([data.role]);
  const exists = await db.model.Role.count({ _id: roleId });
  if (!exists) {
    logger.error('role not found, id/name', data.role);
    res.status(422).json({ errors: [{ dataPath: '.id', message: 'role not found for provided id' }] });
    return;
  }

  const [permissionId] = await db.model.Permission.mapToId(data.permission);
  const { nModified } = await db.model.Role.updateOne({ _id: data.id }, { $pull: { permissions: permissionId } });

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
