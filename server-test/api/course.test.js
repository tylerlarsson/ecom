const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/course`;

describe('course api test', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  beforeAll(async () => {
    await db.model.Role.deleteMany({});
    await db.model.User.deleteMany({});
  });

  beforeAll(async () => {
    // test-role
    let res = await request(app)
      .post(`${config.get('base-path')}/role`)
      .send({
        name: 'test-role',
        description: 'integration test role'
      });
    expect(res.status).toBe(HttpStatus.OK);

    res = await request(app)
      .post(`${config.get('base-path')}/user`)
      .send({
        email: 'test@user.com',
        password: 'testpassword',
        roles: ['test-role']
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.email).toEqual('test@user.com');
  });

  beforeEach(async () => {
    await db.model.Course.deleteMany({});
  });

  test('should not create a course without authors', async () => {
    const res = await request(app)
      .post(path)
      .send({
        title: 'angular 8',
        subtitle: 'angular 8 tips and tricks',
        authors: []
      });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should not create a course without not existing authors', async () => {
    const res = await request(app)
      .post(path)
      .send({
        title: 'angular 8',
        subtitle: 'angular 8 tips and tricks',
        authors: ['not@exist.com']
      });
    expect(res.status).toBe(HttpStatus.CONFLICT);
  });

  test('should create a course', async () => {
    const res = await request(app)
      .post(path)
      .send({
        title: 'angular 8',
        subtitle: 'angular 8 tips and tricks',
        authors: ['test@user.com']
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.title).toBe('angular 8');
    expect(res.body.subtitle).toBe('angular 8 tips and tricks');
  });

  // POST /course/:course/section
  test(`should raise error if schema is invalid`, async () => {
    const res = await request(app).post(`${path}/12345/section`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course is not found`, async () => {
    const res = await request(app)
      .post(`${path}/${db.mocks.mockId}/section`)
      .send({
        index: 0,
        title: 'Test title'
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should save several sections`, async () => {
    const course = await db.courseFactory();
    const res = await request(app)
      .post(`${path}/${course._id.toString()}/section`)
      .send({
        sections: [db.mocks.mockSection, db.mocks.mockSection]
      });
    expect(res.status).toBe(HttpStatus.OK);
  });
  test(`should save section`, async () => {
    // const coures = await db.courseFactory();
    // const res = await request(app)
    //   .post(`${path}/${course._id.toSTring()}/section`)
    //   .send({
    //     title: 'test title'
    //   });
  });
});
