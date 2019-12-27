const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/core/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/enrollment`;

describe('enrollment api test', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  beforeEach(async () =>
    Promise.all([db.model.User.deleteMany({}), db.model.Enrollment.deleteMany({}), db.model.Course.deleteMany({})])
  );

  // POST /enrollment
  test('should raise error is schema is invalid', async () => {
    const res = await request(app)
      .post(path)
      .send({
        test: 'test'
      });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if pricing plan is not found', async () => {
    const res = await request(app)
      .post(path)
      .send({
        pricingPlan: db.mocks.mockId,
        course: db.mocks.mockId,
        user: db.mocks.mockId,
        payment: {
          amount: 0.01,
          source: 'test-source'
        }
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should raise error if course is not found', async () => {
    const plan = await db.pricingPlanFactory();
    const user = await db.userFactory();
    const res = await request(app)
      .post(path)
      .send({
        pricingPlan: plan._id.toString(),
        course: db.mocks.mockId,
        user: user._id.toString()
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should raise error if user is not found', async () => {
    const plan = await db.pricingPlanFactory();
    const res = await request(app)
      .post(path)
      .send({
        pricingPlan: plan._id.toString(),
        course: db.mocks.mockId,
        user: db.mocks.mockId
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should create enrollment', async () => {
    const plan = await db.pricingPlanFactory();
    const user = await db.userFactory();
    const res = await request(app)
      .post(path)
      .send({
        pricingPlan: plan._id.toString(),
        course: plan.courseId.toString(),
        user: user._id.toString()
      });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(typeof res.body.enrollment).toBe('object');
    expect(res.body.enrollment.user).toBe(user._id.toString());
    expect(res.body.enrollment.pricingPlan).toBe(plan._id.toString());
  });

  // POST /enrollment/:user
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).post(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if user is not found', async () => {
    const res = await request(app)
      .post(`${path}/${db.mocks.mockId}`)
      .send({
        course: db.mocks.mockId
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should raise error if course is not found', async () => {
    const user = await db.userFactory();
    const res = await request(app)
      .post(`${path}/${user._id}`)
      .send({
        course: db.mocks.mockId
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should add enrollment to user', async () => {
    const user = await db.userFactory();
    const course = await db.courseFactory();
    const res = await request(app)
      .post(`${path}/${user._id}`)
      .send({
        course: course._id
      });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.enrollment.user).toBe(user._id.toString());
    expect(res.body.enrollment.course).toBe(course._id.toString());
  });

  // PUT /enrollment/:enrollment
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).put(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if enrollment is not found', async () => {
    const res = await request(app)
      .put(`${path}/${db.mocks.mockId}`)
      .send({
        step: db.mocks.mockId
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should add step to completed property', async () => {
    const enrollment = await db.enrollmentFactory();
    const lecture = await db.lectureFactory();
    const res = await request(app)
      .put(`${path}/${enrollment._id}`)
      .send({
        step: lecture._id
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.enrollment.completed.findIndex(i => i.toString() === lecture._id.toString())).not.toBe(-1);
  });
  test('should not add step twice', async () => {
    const enrollment = await db.enrollmentFactory();
    const lecture = await db.lectureFactory();
    let res = await request(app)
      .put(`${path}/${enrollment._id}`)
      .send({
        step: lecture._id
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(!!res.body.enrollment.completed.findIndex(i => i.toString() === lecture._id.toString())).not.toBe(-1);
    res = await request(app)
      .put(`${path}/${enrollment._id}`)
      .send({
        step: lecture._id
      });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  // GET /enrollment/:enrollment
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).get(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if enrollment is not found', async () => {
    const res = await request(app).get(`${path}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should return enrollment', async () => {
    const enrollment = await db.enrollmentFactory();
    const res = await request(app).get(`${path}/${enrollment._id}`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.enrollment.id).toBe(enrollment._id.toString());
  });

  // GET /enrollment/course/:course
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).get(`${path}/course/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should return empty enrollments', async () => {
    const res = await request(app).get(`${path}/course/${db.mocks.mockId}`);
    expect(res.body.enrollments && res.body.enrollments.length).toBe(0);
  });
  test('should return enrollments by course id', async () => {
    const enrollment = await db.enrollmentFactory();
    const res = await request(app).get(`${path}/course/${enrollment.course}`);
    expect(res.body.enrollments && res.body.enrollments.length).toBe(1);
  });

  // GET /enrollment/user/:user
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).get(`${path}/user/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should return empty enrollment', async () => {
    const res = await request(app).get(`${path}/user/${db.mocks.mockId}`);
    expect(res.body.enrollments && res.body.enrollments.length).toBe(0);
  });
  test('should return enrollments by user id', async () => {
    const enrollment = await db.enrollmentFactory();
    const res = await request(app).get(`${path}/user/${enrollment.user}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.enrollments && res.body.enrollments.length).toBe(1);
  });

  // DELETE /enrollment/:enrollment/user/:user
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).delete(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if enrollment is not found', async () => {
    const res = await request(app).delete(`${path}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should delete enrollment', async () => {
    const enrollment = await db.enrollmentFactory();
    const res = await request(app).delete(`${path}/${enrollment._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.deleted.deleted).toBe(true);
  });
});
