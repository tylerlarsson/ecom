const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = Promise;

/* eslint-disable global-require */

module.exports = {
  model: {
    User: require('./user'),
    Role: require('./role'),
    Permission: require('./permission'),
    Course: require('./course'),
    PricingPlan: require('./pricing-plan'),
    Page: require('./page'),
    Navigation: require('./navigation')
  },
  mocks: {
    mockSection: {
      title: 'test title'
    },
    mockCourse: {
      title: 'Mock title course',
      subtitle: 'Mock subtitle course',
      authors: []
    },
    mockLink: {
      text: 'test text',
      url: '/test',
      visibleTo: 'all'
    },
    mockNav: {
      title: 'Mock title',
      location: 'top',
      links: [
        {
          text: 'test text',
          url: '/test',
          visibleTo: 'all'
        }
      ]
    },
    mockPricing: {
      price: 100,
      title: 'Test pricing plan',
      subtitle: 'the way you choose to pay',
      description: 'the way you choose to pay',
      type: 'one-time',
      period: 150
    },
    mockId: mongoose.Types.ObjectId()
  },
  courseFactory() {
    return this.model.Course.create(this.mocks.mockCourse);
  },

  async pricingPlanFactory() {
    const course = await this.courseFactory();
    return this.model.PricingPlan.create({
      courseId: course._id,
      ...this.mocks.mockPricing
    });
  },

  async navigationFactory() {
    const course = await this.courseFactory();
    return this.model.Navigation.createNavigation({ ...this.mocks.mockNav, course: course._id });
  },

  async sectionFactory() {
    const course = await this.courseFactory();
    const [section] = await course.createSection(this.mocks.mockSection);
    return { section, course: course._id.toString() };
  },

  async lectureFactory() {
    const course = await this.courseFactory();
    const [section] = await course.createSection(this.mocks.mockSection);
    const lecture = await course.createLecture({ section: section._id, title: 'test title', file: 'test file' });
    return { course: course._id || course.id, section: section._id || section.id, lecture };
  },

  beforeAll(done) {
    function clearDB() {
      // eslint-disable-next-line guard-for-in
      for (const c of Array.from(mongoose.connection.collections)) {
        c.remove(() => {});
      }
      return done();
    }

    /*
      If the mongoose connection is closed,
      start it up using the test url and database name
      provided by the node runtime ENV
    */
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(config.get('db:url'), err => {
        if (err) {
          throw err;
        }
        return clearDB();
      });
    } else {
      return clearDB();
    }
  },

  afterAll(done) {
    mongoose.disconnect();
    return done();
  }
};
