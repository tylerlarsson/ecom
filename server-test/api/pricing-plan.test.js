const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/core/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/pricing-plan`;

describe('pricing plan api test', function() {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  beforeEach(async () => {
    await Promise.all([db.model.Course.deleteMany({}), db.model.PricingPlan.deleteMany({})]);
  });
  afterEach(async () => {
    await Promise.all([db.model.Course.deleteMany({}), db.model.PricingPlan.deleteMany({})]);
  });

  // POST /pricing-plan
  test(`should raise error if schema is invalid`, async () => {
    const res = await request(app)
      .post(path)
      .send({ random: 'property' });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course does not exist`, async () => {
    const res = await request(app)
      .post(path)
      .send({ courseId: db.mocks.mockId, ...db.mocks.mockPricing });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should create pricing plan`, async () => {
    const course = await db.courseFactory();
    const res = await request(app)
      .post(path)
      .send({ courseId: course._id, ...db.mocks.mockPricing });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.plan.type).toBe('free');
    expect(res.body.plan.title).toBe('Test pricing plan');
  });
  test(`should add to course model ref`, async () => {
    const { courseId, _id } = await db.pricingPlanFactory();
    const course = await db.model.Course.findById(courseId);
    const pricing = course.pricingPlans.findIndex(p => p._id === _id.toString());
    expect(!!pricing).toBe(true);
  });

  // GET /pricing-plan/:course
  test(`should raise error is schema is invalid`, async () => {
    const res = await request(app).get(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should return empty array if nothing is found`, async () => {
    const res = await request(app).get(`${path}/${db.mocks.mockId}`);
    expect(res.body.plans.length).toBe(0);
  });
  test(`should return array of plans`, async () => {
    const plan = await db.pricingPlanFactory();
    const res = await request(app).get(`${path}/${plan.courseId}`);
    expect(res.body.plans.length).toBe(1);
  });

  // GET /pricing-plan/plan/:pricingPlan
  test(`should raise error if schema is invalid`, async () => {
    const res = await request(app).get(`${path}/plan/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should return 404 if plan is not found`, async () => {
    const res = await request(app).get(`${path}/plan/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should return plan`, async () => {
    const plan = await db.pricingPlanFactory();
    const res = await request(app).get(`${path}/plan/${plan._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.plan.id).toBe(plan._id.toString());
  });

  // DELETE /pricing-plan/:course/plan/:pricingPlan
  test(`should raise error is schema is invalid`, async () => {
    const res = await request(app).delete(`${path}/12345/plan/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course or plan is not found`, async () => {
    const plan = await db.pricingPlanFactory();

    let res = await request(app).delete(`${path}/${db.mocks.mockId}/plan/${plan._id}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);

    const course = await db.courseFactory();
    res = await request(app).delete(`${path}/${course._id}/plan/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should delete pricing plan`, async () => {
    const plan = await db.pricingPlanFactory();
    const res = await request(app).delete(`${path}/${plan.courseId}/plan/${plan._id}`);
    expect(res.status).toBe(HttpStatus.OK);
  });
  test(`should remove from course model when deleted`, async () => {
    const plan = await db.pricingPlanFactory();
    const res = await request(app).delete(`${path}/${plan.courseId}/plan/${plan._id}`);
    expect(res.status).toBe(HttpStatus.OK);

    const course = await db.model.Course.findById(plan.courseId);
    console.log('course ->', course, 'plan id ->', plan._id);
    const pricing = course.pricingPlans.find(p => p._id === plan._id);
    expect(!!pricing).toBe(false);
  });
});
