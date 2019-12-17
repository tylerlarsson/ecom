const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'mongo-id.schema.json'));
ajv.addSchema(readJson('schema', 'name.schema.json'));
ajv.addSchema(readJson('schema', 'lecture-content.schema.json'));
ajv.addSchema(readJson('schema', 'filter.schema.json'));
ajv.addSchema(readJson('schema', 'page.schema.json'));
ajv.addSchema(readJson('schema', 'email.schema.json'));

const resetRequestSchema = readJson('schema', 'reset-request.schema.json');
const resetSchema = readJson('schema', 'reset.schema.json');
const nameRequestSchema = readJson('schema', 'name-request.schema.json');
const newUserSchema = readJson('schema', 'new-user.schema.json');
const newRoleSchema = readJson('schema', 'new-role.schema.json');
const newPageSchema = readJson('schema', 'new-page.schema.json');
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
const roleUserRoutesSchema = readJson('schema', 'role-user-routes.schema.json');
const deleteLectureSchema = readJson('schema', 'delete-lecture.schema.json');
const deleteSectionSchema = readJson('schema', 'delete-section.schema.json');
const deletePlanSchema = readJson('schema', 'delete-plan.schema.json');
const putLectureSchema = readJson('schema', 'put-lecture.schema.json');
const editPageSchema = readJson('schema', 'edit-page.schema.json');
const deletePageSchema = readJson('schema', 'delete-page.schema.json');
const getNavigationSchema = readJson('schema', 'get-navigation.schema.json');
const createNavigationSchema = readJson('schema', 'create-navigation.schema.json');
const getPricingByCourseSchema = readJson('schema', 'get-pricing-by-course.schema.json');
const editNavigationSchema = readJson('schema', 'edit-navigation.schema.json');
const deleteNavigationSchema = readJson('schema', 'delete-navigation.schema.json');
const deleteLinkSchema = readJson('schema', 'delete-link.schema.json');
const createLinkSchema = readJson('schema', 'create-link.schema.json');
const getPricingSchema = readJson('schema', 'get-pricing.schema.json');
const editLinkSchema = readJson('schema', 'edit-link.schema.json');
const createContentSchema = readJson('schema', 'create-content.schema.json');
const editContentSchema = readJson('schema', 'edit-content.schema.json');
const deleteContentSchema = readJson('schema', 'delete-content.schema.json');
const deleteGcsSchema = readJson('schema', 'delete-gcs.schema.json');
const uploadGcsSchema = readJson('schema', 'upload-gcs.schema.json');

const name = ajv.compile(nameRequestSchema);
const newUser = ajv.compile(newUserSchema);
const newRole = ajv.compile(newRoleSchema);
const newPermission = ajv.compile(newPermissionSchema);
const assignPermission = ajv.compile(assignPermissionSchema);
const editPage = ajv.compile(editPageSchema);
const tokenRequest = ajv.compile(tokenRequestSchema);
const getPricing = ajv.compile(getPricingSchema);
const deleteGcs = ajv.compile(deleteGcsSchema);
const roleUserRoutes = ajv.compile(roleUserRoutesSchema);
const uploadGcs = ajv.compile(uploadGcsSchema);
const getPricingByCourse = ajv.compile(getPricingByCourseSchema);
const deletePlan = ajv.compile(deletePlanSchema);
const pageRequest = ajv.compile(pageRequestSchema);
const assignFilter = ajv.compile(assignFilterSchema);
const reset = ajv.compile(resetSchema);
const resetRequest = ajv.compile(resetRequestSchema);
const filters = ajv.compile(filtersSchema);
const deleteLecture = ajv.compile(deleteLectureSchema);
const newPage = ajv.compile(newPageSchema);
const createNavigation = ajv.compile(createNavigationSchema);
const createContent = ajv.compile(createContentSchema);
const editContent = ajv.compile(editContentSchema);
const deleteContent = ajv.compile(deleteContentSchema);
const editNavigation = ajv.compile(editNavigationSchema);
const getNavigation = ajv.compile(getNavigationSchema);
const deleteNavigation = ajv.compile(deleteNavigationSchema);
const deleteLink = ajv.compile(deleteLinkSchema);
const createLink = ajv.compile(createLinkSchema);
const editLink = ajv.compile(editLinkSchema);
const deleteSection = ajv.compile(deleteSectionSchema);
const course = ajv.compile(courseSchema);
const pricingPlan = ajv.compile(pricingPlanSchema);
const courseSection = ajv.compile(courseSectionSchema);
const courseLecture = ajv.compile(courseLectureSchema);
const putLecture = ajv.compile(putLectureSchema);
const deletePage = ajv.compile(deletePageSchema);
const getCourse = ajv.compile(getCourseSchema);

module.exports = {
  newUser,
  newRole,
  newPermission,
  name,
  deletePlan,
  deletePage,
  assignPermission,
  roleUserRoutes,
  createNavigation,
  createContent,
  editContent,
  deleteGcs,
  uploadGcs,
  getPricingByCourse,
  deleteContent,
  deleteLecture,
  getNavigation,
  editNavigation,
  editPage,
  deleteNavigation,
  resetRequest,
  reset,
  deleteLink,
  createLink,
  editLink,
  newPage,
  getCourse,
  getPricing,
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
