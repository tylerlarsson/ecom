const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');
const path = `${config.get('base-path')}/navigation`;

describe('navigation api test', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);
  beforeEach(async () => {
    await Promise.all([db.model.Course.deleteMany({}), db.model.Navigation.deleteMany({})]);
  });
  afterEach(async () => {
    await Promise.all([db.model.Course.deleteMany({}), db.model.Navigation.deleteMany({})]);
  });

  // POST /navigation
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app)
      .post(path)
      .send({ random: 'property' });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course is not found.`, async () => {
    const res = await request(app)
      .post(path)
      .send({ ...db.mocks.mockNav, course: db.mocks.mockId });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should create new nav.`, async () => {
    const course = await db.courseFactory();
    const res = await request(app)
      .post(path)
      .send({ ...db.mocks.mockNav, course: course._id });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(Object.is(res.body.navigation.course, course._id.toString())).toBe(true);
    expect(Object.is(res.body.navigation.title, db.mocks.mockNav.title)).toBe(true);
    expect(Object.is(res.body.navigation.location, db.mocks.mockNav.location)).toBe(true);
    expect(Object.is(res.body.navigation.links.length, db.mocks.mockNav.links.length)).toBe(true);
  });

  // PUT /navigation
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app)
      .put(path)
      .send(db.mocks.mockNav);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if navigation is not found.`, async () => {
    const res = await request(app)
      .put(path)
      .send({ ...db.mocks.mockNav, id: db.mocks.mockId });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should edit navigation.`, async () => {
    const nav = await db.navigationFactory();
    const forChange = {
      title: 'test title for real'
    };
    const res = await request(app)
      .put(path)
      .send({ id: nav._id, ...forChange });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.navigation.title).toBe(forChange.title);
    expect(res.body.navigation.location).toBe(db.mocks.mockNav.location);
  });

  // PUT /navigation/links/:navigation
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app).put(`${path}/links/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if navigation is not found.`, async () => {
    const res = await request(app)
      .put(`${path}/links/${db.mocks.mockId}`)
      .send({ id: db.mocks.mockId, ...db.mocks.mockLink });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should raise error if link is not found.`, async () => {
    const navigation = await db.navigationFactory();
    const res = await request(app)
      .put(`${path}/links/${navigation._id}`)
      .send({ id: db.mocks.mockId, ...db.mocks.mockLink });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should edit link inside of a navigation.`, async () => {
    const navigation = await db.navigationFactory();
    const [{ _id: navId }] = navigation.links;
    const res = await request(app)
      .put(`${path}/links/${navigation._id}`)
      .send({ id: navId, text: 'test text' });
    expect(res.status).toBe(HttpStatus.OK);
    console.log(res.body);
    expect(res.body.navigation.links[0].text).toBe('test text');
  });

  // POST /navigation/links/:navigation
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app).post(`${path}/links/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if navigation is not found.`, async () => {
    const res = await request(app)
      .post(`${path}/links/${db.mocks.mockId}`)
      .send(db.mocks.mockLink);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should create new link.`, async () => {
    const nav = await db.navigationFactory();
    const res = await request(app)
      .post(`${path}/links/${nav._id}`)
      .send({ text: 'new', url: '/new' });
    const { navigation } = res.body;
    const linkIdx = navigation.links.findIndex(l => l.url === '/new');
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(navigation.links[linkIdx].text).toBe('new');
    expect(navigation.links[linkIdx].url).toBe('/new');
  });

  // DELETE /navigation/links/:navigation/:link
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app).delete(`${path}/links/12345/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if navigation is not found.`, async () => {
    const res = await request(app).delete(`${path}/links/${db.mocks.mockId}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should return nothing if link is not found.`, async () => {
    const nav = await db.navigationFactory();
    const res = await request(app).delete(`${path}/links/${nav._id}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should delete link`, async () => {
    const nav = await db.navigationFactory();
    const [{ _id: linkId }] = nav.links;
    const res = await request(app).delete(`${path}/links/${nav._id}/${linkId}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.deleted.links.length).toBe(0);
  });

  // GET /navigation/:course
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app).get(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should return empty array if no links found.`, async () => {
    const res = await request(app).get(`${path}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.navigations.length).toBe(0);
  });
  test(`should return links by existing course id.`, async () => {
    const nav = await db.navigationFactory();
    const { course } = nav;
    const res = await request(app).get(`${path}/${course}`);
    console.log(res.body);
    expect(Object.is(res.body.navigations[0].id, nav._id.toString())).toBe(true);
    expect(res.status).toBe(HttpStatus.OK);
  });

  // DELETE /navigation/:course/:navigation
  test(`should raise error if schema is invalid.`, async () => {
    const res = await request(app).delete(`${path}/12345/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if course is not found.`, async () => {
    const res = await request(app).delete(`${path}/${db.mocks.mockId}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should return nothing if nothing is deleted.`, async () => {
    const course = await db.courseFactory();
    const res = await request(app).delete(`${path}/${course._id}/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.deleted).toBe(null);
  });
  test(`should return deleted object if successful.`, async () => {
    const nav = await db.navigationFactory();
    const res = await request(app).delete(`${path}/${nav.course}/${nav._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(Object.is(res.body.deleted.id, nav._id.toString())).toBe(true);
  });
});
