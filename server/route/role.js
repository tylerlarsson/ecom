const express = require('express');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');
const paginated = require('../middleware/page-request');
const filter = require('../filter');

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

  data.permissions = data.permissions || [];
  const allCreated = await db.model.Permission.isCreated(data.permissions);
  if (!allCreated) {
    logger.error('permissions', data.permissions, 'have not been created yet');
    res.status(409).json({ errors: [{ dataPath: '.permissions', message: `not created: ${data.permissions}` }] });
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

  const roleId = await db.model.Role.mapOneToId(data.role);
  if (!roleId) {
    logger.error('role not found, id/name', data.role);
    res.status(422).json({ errors: [{ dataPath: '.id', message: 'role not found for provided id' }] });
    return;
  }

  const permissionId = await db.model.Permission.mapOneToId(data.permission);
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

  const roleId = await db.model.Role.mapOneToId(data.role);
  if (!roleId) {
    logger.error('role not found, id/name', data.role);
    res.status(422).json({ errors: [{ dataPath: '.id', message: 'role not found for provided id' }] });
    return;
  }

  const permissionId = await db.model.Permission.mapOneToId(data.permission);
  const { nModified } = await db.model.Role.updateOne({ _id: roleId }, { $pull: { permissions: permissionId } });

  logger.info('roles modified', nModified);
  return res.json({ modified: nModified });
});

/**
 * @swagger
 * /role/{name}:
 *   delete:
 *     parameters:
 *       - name: name
 *         description: id or name to delete
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
router.delete('/:name', async (req, res) => {
  const data = req.params;

  if (!validator.name(data)) {
    logger.error('validation of role delete request failed', validator.name.errors);
    res.status(422).json({ errors: validator.name.errors });
    return;
  }

  const roleId = await db.model.Role.mapOneToId(data.name);
  const result = await db.model.Role.deleteOne({ _id: roleId });
  if (result.deletedCount) {
    logger.info('role, id/name', data.name, 'has been deleted');
  } else {
    /* istanbul ignore next */
    logger.error('could not delete role, id/name', data.name);
  }
  res.json({ deleted: result.deletedCount });
});

/**
 * @swagger
 * /role:
 *   get:
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *         required: true
 *         default: 0
 *       - name: pageSize
 *         in: query
 *         required: true
 *         default: 10
 *     description: Get all the roles with assigned permissionss
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns roles
 *
 */
router.get('/', paginated, async (req, res) => {
  const total = await db.model.Role.countDocuments();
  const data = await db.model.Role.find()
    .limit(req.page.limit)
    .skip(req.page.skip)
    .populate('permissions');
  res.json({
    total,
    data
  });
});

/**
 * @swagger
 * /role/{name}:
 *   get:
 *     parameters:
 *       - name: name
 *         description: id or name to get
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
router.get('/:name', async (req, res) => {
  const { params } = req;

  if (!validator.name(params)) {
    logger.error('validation of role get request failed', validator.name.errors);
    res.status(422).json({ errors: validator.name.errors });
    return;
  }

  const roleId = await db.model.Role.mapOneToId(params.name);
  const result = await db.model.Role.findById(roleId).populate('permissions');
  res.json(result);
});

/**
 * @swagger
 * /role/{role}/filter:
 *   post:
 *     parameters:
 *       - name: role
 *         description: id or name of role to set filters
 *         in:  path
 *         default: admin
 *       - name: filters array
 *         description: array of string with filter names
 *         in:  body
 *         required: true
 *         type: array
 *         items:
 *           type: string
 *           example: completed-course
 *     description: adds filters for the role
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns role object or null if not found
 *       409:
 *         description: filters do not exist
 *       422:
 *         description: id or name is wrong
 *
 */

router.post('/:role/filter', async (req, res) => {
  const {
    params: { role },
    body: filters
  } = req;

  if (!validator.assignFilter({ role, filters })) {
    logger.error('validation of assign filter request failed', validator.assignFilter.errors);
    res.status(422).json({ errors: validator.assignFilter.errors });
    return;
  }

  if (!filter.exist(filters)) {
    logger.error('validation of filter name failed');
    res.status(409).json({ errors: [{ dataPath: '.filters', message: 'some of filters do not exist' }] });
    return;
  }

  const roleId = await db.model.Role.mapOneToId(role);
  const { nModified } = await db.model.Role.updateOne({ _id: roleId }, { filters });

  logger.info('roles modified', nModified);
  return res.json({ modified: nModified });
});

module.exports = router;
