const mongoose = require('mongoose');
const config = require('../core/config');
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
    Navigation: require('./navigation'),
    InternalComment: require('./internal-comment'),
    Enrollment: require('./enrollment')
  },
  mocks: {
    mockUser: {
      username: `test${Math.random()}`,
      password: 'test',
      email: `test@test.test`,
      firstname: 'First',
      lastname: 'Last'
    },
    mockSection: {
      title: 'test title'
    },
    mockRole: {
      name: 'test',
      description: 'test',
      filters: 'test'
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
      type: 'free',
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

  async enrollmentFactory() {
    const course = await this.courseFactory();
    const user = await this.userFactory();
    return this.model.Enrollment.enroll({
      user: user._id,
      course: course._id
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

  async commentFactory(content = 'test') {
    const [{ _id: commentator }, { _id: user }] = await Promise.all([
      this.userFactory({ username: 'testing1', email: 'email@email.email' }),
      this.userFactory({ username: 'testing2', email: 'email1@email1.email' })
    ]);
    return this.model.InternalComment.create({ commentator, user, content });
  },

  roleFactory() {
    return this.model.Role.create(this.mocks.mockRole);
  },

  userFactory(usr) {
    return this.model.User.create({ ...this.mocks.mockUser, ...usr });
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
