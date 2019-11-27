const filterByDeleted = array => array.filter(i => i.deleted !== true);

const handleCourse = course => {
  if (course && course.sections && course.sections.length) {
    course.sections = filterByDeleted(course.sections);

    for (const _course of course.sections) {
      _course.lectures = filterByDeleted(_course.lectures);
    }
  }
};

/**
 * Миддлварь для валидации мягко-удаленных документов, просто проверяет флаг deleted, используется в pre-хуках.
 * @param next
 */
function softDeletedMiddleware(next) {
  this.where('deleted').equals(false);
  next();
}

/**
 * Т.к нельзя мутировать объект Query, пришлось сделать такую вот мидлварку для пост хуков
 * @param doc
 * @param next
 */
function removeNestedSoftDeleted(doc, next) {
  if (Array.isArray(doc)) {
    doc = doc.map(i => handleCourse(i));
  } else {
    doc = handleCourse(doc);
  }
  next();
}

module.exports = { softDeletedMiddleware, removeNestedSoftDeleted };
