const filterByDeleted = array => array.filter(i => i.deleted !== true);

const handleCourse = course => {
  if (course && course.sections && course.sections.length) {
    course.sections = filterByDeleted(course.sections);

    for (const _course of course.sections) {
      _course.lectures = filterByDeleted(_course.lectures);
    }
  }
};

function softDeletedMiddleware(next) {
  this.where('deleted').equals(false);
  next();
}

function removeNestedSoftDeleted(doc, next) {
  if (Array.isArray(doc)) {
    doc = doc.map(i => handleCourse(i));
  } else {
    doc = handleCourse(doc);
  }
  next();
}

module.exports = { softDeletedMiddleware, removeNestedSoftDeleted };
