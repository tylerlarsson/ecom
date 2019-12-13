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
    const course = await db.courseFactory();
    const res = await request(app)
      .post(`${path}/${course._id.toString()}/section`)
      .send({
        title: 'test title',
        lectures: []
      });
    expect(res.status).toBe(HttpStatus.OK);
  });
  test(`should edit several sections`, async () => {
    const course = await db.courseFactory();
    let res = await request(app)
      .post(`${path}/${course._id.toString()}/section`)
      .send({
        sections: [db.mocks.mockSection, db.mocks.mockSection, db.mocks.mockSection]
      });
    expect(res.status).toBe(HttpStatus.OK);
    let { sections } = res.body;
    const editTitle = 'edit';
    sections = sections.map(s => ({ id: s._id, title: editTitle }));
    res = await request(app)
      .post(`${path}/${course._id.toString()}/section`)
      .send({ sections });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.sections[0].title).toBe(editTitle);
    expect(res.body.sections[1].title).toBe(editTitle);
    expect(res.body.sections[2].title).toBe(editTitle);
  });
  test(`should edit section`, async () => {
    const course = await db.courseFactory();
    let res = await request(app)
      .post(`${path}/${course._id.toString()}/section`)
      .send({
        title: 'test title'
      });
    expect(res.status).toBe(HttpStatus.OK);
    const [section] = res.body.sections;
    res = await request(app)
      .post(`${path}/${course._id.toString()}/section`)
      .send({
        id: section._id,
        title: 'edit'
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.sections[0].title).toBe('edit');
  });

  // DELETE /course/:course/section/:section
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app).delete(`${path}/12345/section/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course is not found`, async () => {
    const res = await request(app).delete(`${path}/${db.mocks.mockId}/section/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should raise error if section is not found`, async () => {
    const course = await db.courseFactory();
    const res = await request(app).delete(`${path}/${course._id.toString()}/section/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should delete section`, async () => {
    const { section, course } = await db.sectionFactory();
    const res = await request(app).delete(`${path}/${course}/section/${section._id.toString()}`);
    expect(res.status).toBe(HttpStatus.ACCEPTED);
    expect(res.body.course.sections[0].deleted).toBe(true);
  });

  // DELETE /course/:course
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app).delete(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course is not found`, async () => {
    const res = await request(app).delete(`${path}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should soft delete course`, async () => {
    const course = await db.courseFactory();
    const res = await request(app).delete(`${path}/${course._id.toString()}`);
    expect(res.status).toBe(HttpStatus.ACCEPTED);
    expect(res.body.course.deleted).toBe(true);
  });
  test(`shouldn't return after soft delete`, async () => {
    const course = await db.courseFactory();
    let res = await request(app).delete(`${path}/${course._id.toString()}`);
    expect(res.status).toBe(HttpStatus.ACCEPTED);
    expect(res.body.course.deleted).toBe(true);

    res = await request(app).get(`${path}/${course._id.toString()}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`shouldn't return as array after soft delete`, async () => {
    const course = await db.courseFactory();
    let res = await request(app).delete(`${path}/${course._id.toString()}`);
    expect(res.status).toBe(HttpStatus.ACCEPTED);
    expect(res.body.course.deleted).toBe(true);
    res = await request(app).get(path);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(0);
  });

  // GET /course/:course
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app).get(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if no course is found`, async () => {
    const res = await request(app).get(`${path}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should return course`, async () => {
    const course = await db.courseFactory();
    const res = await request(app).get(`${path}/${course.id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.course.id).toBe(course.id);
  });

  // GET /
  test(`should return 0 in total and 0 courses`, async () => {
    const res = await request(app).get(path);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(0);
    expect(res.body.data.length).toBe(0);
  });
  test(`should return courses`, async () => {
    await Promise.all([
      db.courseFactory(),
      db.courseFactory(),
      db.courseFactory(),
      db.courseFactory(),
      db.courseFactory()
    ]);
    const res = await request(app).get(path);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(5);
    expect(res.body.data.length).toBe(5);
  });

  // POST /course/:course/section/:section/lecture
  test(`should raise error if schema is invalid`, async () => {
    const res = await request(app)
      .post(`${path}/12345/section/12345/lecture`)
      .send({
        section: 12345,
        id: 12345
      });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course is not found`, async () => {
    const res = await request(app)
      .post(`${path}/${db.mocks.mockId}/section/${db.mocks.mockId}/lecture`)
      .send({
        section: db.mocks.mockId,
        id: db.mocks.mockId
      });
    expect(res.status).toBe(HttpStatus.CONFLICT);
  });
  test(`should raise error if section is not found`, async () => {
    const course = await db.courseFactory();
    const res = await request(app)
      .post(`${path}/${course._id.toString()}/section/${db.mocks.mockId}/lecture`)
      .send({
        section: db.mocks.mockId,
        id: db.mocks.mockId,
        title: 'test title',
        file: 'test file',
        allowComments: false
      });
    expect(res.status).toBe(HttpStatus.CONFLICT);
  });
  test(`should create lecture`, async () => {
    const { course, section } = await db.sectionFactory();
    const res = await request(app)
      .post(`${path}/${course}/section/${section._id}/lecture`)
      .send({
        title: 'test title',
        file: 'test file',
        image: 'test image',
        allowComments: false
      });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.lectures.length).toBe(1);
  });

  // DELETE /course/:course/section/:section/lecture/:lecture
  test(`should raise error if schema is invalid`, async () => {
    const _m = db.mocks.mockId;
    const res = await request(app).delete(`${path}/12345/section/${_m}/lecture/${_m}`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test(`should raise error if course is not found`, async () => {
    const _m = db.mocks.mockId;
    const res = await request(app).delete(`${path}/${_m}/section/${_m}/lecture/${_m}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });

  test(`should raise error if section is not found`, async () => {
    const _m = db.mocks.mockId;
    const course = await db.courseFactory();
    const res = await request(app).delete(`${path}/${course._id}/section/${_m}/lecture/${_m}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });

  test(`should raise error if lecture is not found`, async () => {
    const { course, section } = await db.sectionFactory();
    const res = await request(app).delete(`${path}/${course}/section/${section._id}/lecture/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });

  test(`should delete lecture`, async () => {});
});
