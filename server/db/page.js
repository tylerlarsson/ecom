const mongoose = require('mongoose');
const Course = require('./course');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');

const PAGE_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft'
};

const PAGE = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
    url: { type: String, required: true },
    course: { type: ObjectId, ref: 'course', required: true },
    status: { type: String, enum: Object.values(PAGE_STATUS), default: PAGE_STATUS.DRAFT },
    updatedAt: Date
  },
  DEFAULT_OPTIONS
);

PAGE.statics.editPage = async args => {
  const { id, course, ...rest } = args;
  const page = await Page.findById(args.id);

  if (!page) {
    const error = new Error(`No course with id ${args.id} is found.`);
    error.status = 404;
    throw error;
  } else {
    Object.assign(page, { updatedAt: new Date(), ...rest });
  }
  return page.save();
};

PAGE.statics.createPage = async args => {
  const { course } = args;
  const _course = await Course.findById(course);
  if (!_course) {
    const error = new Error(`No course with id ${course} is found.`);
    error.status = 404;
    throw error;
  } else {
    const page = new Page({ ...args });
    const _page = await page.save();
    await _course.addPage(_page._id);
    return _page;
  }
};

const Page = mongoose.model('page', PAGE);

module.exports = Page;
