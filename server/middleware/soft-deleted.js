const filterByDeleted = array => array.filter(i => i.deleted !== true);

const handleCourse = course => {
  if (course && course.sections && course.sections.length) {
    course.sections = filterByDeleted(course.sections);

    for (const _course of course.sections) {
      _course.lectures = filterByDeleted(_course.lectures);
      if (_course && Object.prototype.hasOwnProperty.call(_course, 'pricingPlans')) {
        _course.pricingPlans = filterByDeleted(_course.pricingPlans);
      }
    }
  }
};

function softDeletedMiddleware(next) {
  this.where('deleted').equals(false);
  next();
}

function removeNestedSoftDeleted(doc, next) {
  try {
    if (Array.isArray(doc)) {
      doc = doc.map(i => handleCourse(i));
    } else {
      doc = handleCourse(doc);
    }
    next();
  } catch (error) {
    console.error(error);
  }
}

module.exports = { softDeletedMiddleware, removeNestedSoftDeleted };
