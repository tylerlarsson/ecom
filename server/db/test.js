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
    mockId: mongoose.Types.ObjectId()
  },
  courseFactory() {
    return this.model.Course.create(this.mocks.mockCourse);
  },

  async navigationFactory() {
    const course = await this.courseFactory();
    return this.model.Navigation.createNavigation({ ...this.mocks.mockNav, course: course._id });
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
