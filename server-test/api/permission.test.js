const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/permission`;

describe('permissions apis', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  let id;
  let name;
  let description;

  beforeEach(async () => {
    await db.model.Permission.deleteMany({});

    const res = await request(app)
      .post(path)
      .send({
        name: 'read-write',
        description: 'read write permission'
      });

    id = res.body.id;
    name = res.body.name;
    description = res.body.description;

    expect(res.status).toBe(200);
    expect(id).toMatch(/^[\da-z]{24}$/);
    expect(name).toBe('read-write');
    expect(description).toBe('read write permission');
  });

  test('should fail when reading permissions when no pagination', async () => {
    const res = await request(app).get(path);
    expect(res.status).toBe(422);
  });

  test('should create and read a permission', async () => {
    let res = await request(app)
      .get(`${path}/${id}`)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id, name, description });

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toEqual({ id, name, description });
  });

  test('should update the permission by id', async () => {
    let res = await request(app)
      .post(path)
      .send({ id, name: 'read-write-changed', description: 'read write changed permission' });
    expect(res.status).toBe(200);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toEqual({ id, name: 'read-write-changed', description: 'read write changed permission' });
  });

  test('should delete the permission by id', async () => {
    let res = await request(app).delete(`${path}/${id}`);
    expect(res.status).toBe(200);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
  });

  test('should delete the permission by name', async () => {
    let res = await request(app).delete(`${path}/read-write`);
    expect(res.status).toBe(200);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
  });
});
