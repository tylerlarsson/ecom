const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'mongo-id.schema.json'));
ajv.addSchema(readJson('schema', 'name.schema.json'));
ajv.addSchema(readJson('schema', 'lecture-content.schema.json'));
ajv.addSchema(readJson('schema', 'filter.schema.json'));
ajv.addSchema(readJson('schema', 'page.schema.json'));

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
const courseSectionSchema = readJson('schema', 'new-section.schema.json');
const courseLectureSchema = readJson('schema', 'new-lecture.schema.json');
const getCourseSchema = readJson('schema', 'get-course.schema.json');
const deleteLectureSchema = readJson('schema', 'delete-lecture.schema.json');
const deleteSectionSchema = readJson('schema', 'delete-section.schema.json');
const deletePlanSchema = readJson('schema', 'delete-plan.schema.json');
const putLectureSchema = readJson('schema', 'put-lecture.schema.json');
const editPageSchema = readJson('schema', 'edit-page.schema.json');

const name = ajv.compile(nameRequestSchema);
const newUser = ajv.compile(newUserSchema);
const newRole = ajv.compile(newRoleSchema);
const newPermission = ajv.compile(newPermissionSchema);
const assignPermission = ajv.compile(assignPermissionSchema);
const editPage = ajv.compile(editPageSchema);
const tokenRequest = ajv.compile(tokenRequestSchema);
const deletePlan = ajv.compile(deletePlanSchema);
const pageRequest = ajv.compile(pageRequestSchema);
const assignFilter = ajv.compile(assignFilterSchema);
const filters = ajv.compile(filtersSchema);
const deleteLecture = ajv.compile(deleteLectureSchema);
const deleteSection = ajv.compile(deleteSectionSchema);
const course = ajv.compile(courseSchema);
const pricingPlan = ajv.compile(pricingPlanSchema);
const courseSection = ajv.compile(courseSectionSchema);
const courseLecture = ajv.compile(courseLectureSchema);
const putLecture = ajv.compile(putLectureSchema);
const getCourse = ajv.compile(getCourseSchema);

module.exports = {
  newUser,
  newRole,
  newPermission,
  name,
  deletePlan,
  assignPermission,
  deleteLecture,
  editPage,
  getCourse,
  tokenRequest,
  deleteSection,
  pageRequest,
  putLecture,
  assignFilter,
  filters,
  course,
  courseSection,
  courseLecture,
  pricingPlan
};
