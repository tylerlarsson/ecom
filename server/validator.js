const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'mongo-id.schema.json'));
ajv.addSchema(readJson('schema', 'name.schema.json'));
ajv.addSchema(readJson('schema', 'filter.schema.json'));

const nameRequestSchema = readJson('schema', 'name-request.schema.json');
const newUserSchema = readJson('schema', 'new-user.schema.json');
const newRoleSchema = readJson('schema', 'new-role.schema.json');
const newPermissionSchema = readJson('schema', 'new-permission.schema.json');
const assignPermissionSchema = readJson('schema', 'assign-permission.schema.json');
const tokenRequestSchema = readJson('schema', 'token-request.schema.json');
const pageRequestSchema = readJson('schema', 'page-request.schema.json');
const assignFilterSchema = readJson('schema', 'assign-filter.schema.json');
const filtersSchema = readJson('schema', 'filters.schema.json');
const courseSchema = readJson('schema', 'new-course.schema.json');
const pricingPlanSchema = readJson('schema', 'new-pricing-plan.schema.json');

const name = ajv.compile(nameRequestSchema);
const newUser = ajv.compile(newUserSchema);
const newRole = ajv.compile(newRoleSchema);
const newPermission = ajv.compile(newPermissionSchema);
const assignPermission = ajv.compile(assignPermissionSchema);
const tokenRequest = ajv.compile(tokenRequestSchema);
const pageRequest = ajv.compile(pageRequestSchema);
const assignFilter = ajv.compile(assignFilterSchema);
const filters = ajv.compile(filtersSchema);
const course = ajv.compile(courseSchema);
const pricingPlan = ajv.compile(pricingPlanSchema);

module.exports = {
  newUser,
  newRole,
  newPermission,
  name,
  assignPermission,
  tokenRequest,
  pageRequest,
  assignFilter,
  filters,
  course,
  pricingPlan
};
