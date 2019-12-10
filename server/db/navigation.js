const mongoose = require('mongoose');
const Course = require('./course');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');

const NAVIGATION_LOCATION = {
  TOP: 'top',
  BOTTON: 'bottom'
};

const VISIBLE_TO = {
  ALL: 'all',
  LOGGED_IN: 'logged-in',
  LOGGED_OUT: 'logged-out',
  NOBODY: 'nobody'
};

const LINK = new mongoose.Schema({
  text: { type: String, required: true },
  url: { type: String, required: true },
  visibleTo: { type: String, enum: Object.values(VISIBLE_TO), default: VISIBLE_TO.NOBODY }
});

const NAVIGATION = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, enum: Object.values(NAVIGATION_LOCATION), default: NAVIGATION_LOCATION.TOP },
    course: { type: ObjectId, ref: 'course' },
    links: [LINK]
  },
  DEFAULT_OPTIONS
);

NAVIGATION.statics.createNavigation = async args => {
  const { course, ...rest } = args;
  const _course = await Course.findById(course);
  if (!_course) {
    const error = new Error(`No course with id ${course} is found.`);
    error.status = 404;
    throw error;
  } else {
    const props = { ...rest };
    const _new = new Navigation(props);
    await Course.addNavigation(_new._id);
    return _new.save();
  }
};

NAVIGATION.statics.deleteNavigation = async args => {
  const { id, course } = args;
  const _course = await Course.findById(course);
  if (!_course) {
    const error = new Error(`No course with id ${course} is found.`);
    error.status = 404;
    throw error;
  } else {
    const [deleted] = await Promise.all([Navigation.findByIdAndDelete(id), _course.removeNavigation(id)]);
    return deleted;
  }
};

NAVIGATION.statics.editNavigation = async args => {
  const { id, ...rest } = args;
  const navigation = await Navigation.findById(id);
  if (!navigation) {
    const error = new Error(`No navigation with id ${id} is found.`);
    error.status = 404;
    throw error;
  } else {
    Object.assign(navigation, { ...rest });
    return navigation.save();
  }
};

NAVIGATION.statics.editLink = async args => {
  const { navigation, id, ...rest } = args;
  const _navigation = await Navigation.findById(navigation);
  if (!_navigation) {
    const error = new Error(`No navigation with id ${navigation} is found.`);
    error.status = 404;
    throw error;
  } else {
    const link = _navigation.links.id(id);
    if (!link) {
      const error = new Error(`No link with id ${id} is found.`);
      error.status = 404;
      throw error;
    }
    Object.assign(link, { ...rest });
    return _navigation.save();
  }
};

NAVIGATION.statics.addLink = async args => {
  const { navigation, ...rest } = args;
  const _navigation = await Navigation.findById(navigation);
  if (!navigation) {
    const error = new Error(`No navigation with id ${navigation} is found.`);
    error.status = 404;
    throw error;
  } else {
    _navigation.links.push({ ...rest });
  }
  return _navigation.save();
};

NAVIGATION.methods.deleteLink = async args => {
  const _link = this.links.id(args.link);
  if (_link) {
    const error = new Error(`No link with id ${args.link} is found.`);
    error.status = 404;
    throw error;
  } else {
    _link.remove();
    return this.save();
  }
};

const Navigation = mongoose.model('navigation', NAVIGATION);

module.exports = Navigation;
