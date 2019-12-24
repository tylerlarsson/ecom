const Ajv = require('ajv/lib/ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });

/**
 * @namespace common
 */
const nameRequestSchema = readJson('schema', 'common', 'name-request.schema.json');
const pageRequestSchema = readJson('schema', 'common', 'page-request.schema.json');
const filtersSchema = readJson('schema', 'common', 'filters.schema.json');
const assignFilterSchema = readJson('schema', 'common', 'assign-filter.schema.json');
ajv.addSchema(readJson('schema', 'common', 'mongo-id.schema.json'));
ajv.addSchema(readJson('schema', 'common', 'name.schema.json'));
ajv.addSchema(readJson('schema', 'common', 'email.schema.json'));
ajv.addSchema(readJson('schema', 'common', 'filter.schema.json'));

/**
 * @namespace user
 */
const resetRequestSchema = readJson('schema', 'auth', 'reset-request.schema.json');
const resetSchema = readJson('schema', 'auth', 'reset.schema.json');
const newUserSchema = readJson('schema', 'auth', 'new-user.schema.json');
const tokenRequestSchema = readJson('schema', 'auth', 'token-request.schema.json');

/**
 * @namespace content
 */
const createContentSchema = readJson('schema', 'content', 'create-content.schema.json');
const editContentSchema = readJson('schema', 'content', 'edit-content.schema.json');
const deleteContentSchema = readJson('schema', 'content', 'delete-content.schema.json');
ajv.addSchema(readJson('schema', 'content', 'lecture-content.schema.json'));

/**
 * @namespace course
 */
const getCourseSchema = readJson('schema', 'course', 'get-course.schema.json');
const editCourseSchema = readJson('schema', 'course', 'edit-course.schema.json');
const courseSchema = readJson('schema', 'course', 'new-course.schema.json');

/**
 * @namespace file
 */
const deleteGcsSchema = readJson('schema', 'file', 'delete-gcs.schema.json');
const uploadGcsSchema = readJson('schema', 'file', 'upload-gcs.schema.json');
const uploadWistiaSchema = readJson('schema', 'file', 'upload-wistia.schema.json');
const deleteWistiaVideoSchema = readJson('schema', 'file', 'delete-wistia-video.schema.json');
ajv.addSchema(readJson('schema', 'common', 'file.schema.json'));

/**
 * @namespace lecture
 */
const courseLectureSchema = readJson('schema', 'lecture', 'new-lecture.schema.json');
const putLectureSchema = readJson('schema', 'lecture', 'put-lecture.schema.json');
const deleteLectureSchema = readJson('schema', 'lecture', 'delete-lecture.schema.json');

/**
 * @namespace link
 */
const deleteLinkSchema = readJson('schema', 'link', 'delete-link.schema.json');
const createLinkSchema = readJson('schema', 'link', 'create-link.schema.json');
const editLinkSchema = readJson('schema', 'link', 'edit-link.schema.json');

/**
 * @namespace navigation
 */
const getNavigationSchema = readJson('schema', 'navigation', 'get-navigation.schema.json');
const createNavigationSchema = readJson('schema', 'navigation', 'create-navigation.schema.json');
const editNavigationSchema = readJson('schema', 'navigation', 'edit-navigation.schema.json');
const deleteNavigationSchema = readJson('schema', 'navigation', 'delete-navigation.schema.json');

/**
 * @namespace page
 */
const newPageSchema = readJson('schema', 'page', 'new-page.schema.json');
const editPageSchema = readJson('schema', 'page', 'edit-page.schema.json');
const deletePageSchema = readJson('schema', 'page', 'delete-page.schema.json');
ajv.addSchema(readJson('schema', 'page', 'page.schema.json'));

/**
 * @namespace permission
 */
const newPermissionSchema = readJson('schema', 'permission', 'new-permission.schema.json');
const assignPermissionSchema = readJson('schema', 'permission', 'assign-permission.schema.json');

/**
 * @namespace pricing
 */
const getPricingByCourseSchema = readJson('schema', 'pricing', 'get-pricing-by-course.schema.json');
const getPricingSchema = readJson('schema', 'pricing', 'get-pricing.schema.json');
const pricingPlanSchema = readJson('schema', 'pricing', 'new-pricing-plan.schema.json');
const deletePlanSchema = readJson('schema', 'pricing', 'delete-plan.schema.json');

/**
 * @namespace role
 */
const newRoleSchema = readJson('schema', 'role', 'new-role.schema.json');
const roleUserRoutesSchema = readJson('schema', 'role', 'role-user-routes.schema.json');

/**
 * @namespace section
 */
const deleteSectionSchema = readJson('schema', 'section', 'delete-section.schema.json');
const courseSectionSchema = readJson('schema', 'section', 'new-section.schema.json');

/**
 * @namespace comments
 */
const createCommentSchema = readJson('schema', 'comments', 'create-comment.schema.json');
const deleteCommentSchema = readJson('schema', 'comments', 'delete-comment.schema.json');

module.exports = {
  name: ajv.compile(nameRequestSchema),
  newUser: ajv.compile(newUserSchema),
  newRole: ajv.compile(newRoleSchema),
  newPermission: ajv.compile(newPermissionSchema),
  assignPermission: ajv.compile(assignPermissionSchema),
  editPage: ajv.compile(editPageSchema),
  tokenRequest: ajv.compile(tokenRequestSchema),
  getPricing: ajv.compile(getPricingSchema),
  deleteGcs: ajv.compile(deleteGcsSchema),
  roleUserRoutes: ajv.compile(roleUserRoutesSchema),
  uploadGcs: ajv.compile(uploadGcsSchema),
  getPricingByCourse: ajv.compile(getPricingByCourseSchema),
  deletePlan: ajv.compile(deletePlanSchema),
  pageRequest: ajv.compile(pageRequestSchema),
  assignFilter: ajv.compile(assignFilterSchema),
  reset: ajv.compile(resetSchema),
  resetRequest: ajv.compile(resetRequestSchema),
  filters: ajv.compile(filtersSchema),
  deleteLecture: ajv.compile(deleteLectureSchema),
  editCourse: ajv.compile(editCourseSchema),
  newPage: ajv.compile(newPageSchema),
  createNavigation: ajv.compile(createNavigationSchema),
  createContent: ajv.compile(createContentSchema),
  editContent: ajv.compile(editContentSchema),
  deleteContent: ajv.compile(deleteContentSchema),
  editNavigation: ajv.compile(editNavigationSchema),
  getNavigation: ajv.compile(getNavigationSchema),
  deleteNavigation: ajv.compile(deleteNavigationSchema),
  deleteLink: ajv.compile(deleteLinkSchema),
  createLink: ajv.compile(createLinkSchema),
  editLink: ajv.compile(editLinkSchema),
  deleteSection: ajv.compile(deleteSectionSchema),
  course: ajv.compile(courseSchema),
  pricingPlan: ajv.compile(pricingPlanSchema),
  courseSection: ajv.compile(courseSectionSchema),
  courseLecture: ajv.compile(courseLectureSchema),
  putLecture: ajv.compile(putLectureSchema),
  deletePage: ajv.compile(deletePageSchema),
  getCourse: ajv.compile(getCourseSchema),
  uploadWistia: ajv.compile(uploadWistiaSchema),
  deleteWistiaVideo: ajv.compile(deleteWistiaVideoSchema),
  createComment: ajv.compile(createCommentSchema),
  deleteComment: ajv.compile(deleteCommentSchema)
};
