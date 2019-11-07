const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/role`;

describe('role apis', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  let permission;

  beforeAll(() => db.model.Permission.deleteMany({}));

  beforeAll(async () => {
    const res = await request(app)
      .post(`${config.get('base-path')}/permission`)
      .send({
        name: 'read-write',
        description: 'read write permission'
      });

    expect(res.status).toBe(200);
    permission = res.body;
  });

  beforeEach(async () => {
    await db.model.Role.deleteMany({});
  });

  test('should create a role without permissions', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role'
      });

    expect(res.status).toBe(200);

    const { id } = res.body;

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toEqual(id);
    expect(res.body.data[0].name).toEqual('test-role');
    expect(res.body.data[0].description).toEqual('integration tests role');
    expect(res.body.data[0].permissions).toEqual([]);
  });

  test('should fail on wrong data', async () => {
    const res = await request(app)
      .post(path)
      .send({
        name: 'test Role',
        description: 'integration tests role'
      });

    expect(res.status).toBe(422);
  });

  test('should fail on creation with same name', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role'
      });
    expect(res.status).toBe(200);

    res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role'
      });
    expect(res.status).toBe(409);
  });

  test('should create a role with a permissions by id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^[\da-z]{24}$/);

    const { id } = res.body;

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toEqual(id);
    expect(res.body.data[0].name).toEqual('test-role');
    expect(res.body.data[0].description).toEqual('integration tests role');
    expect(res.body.data[0].permissions[0].id).toEqual(permission.id);
  });

  test('should update a role by id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^[\da-z]{24}$/);

    const { id } = res.body;

    res = await request(app)
      .post(path)
      .send({
        id,
        name: 'test-role-updated',
        description: 'integration tests role updated',
        permissions: [permission.id]
      });

    expect(res.status).toBe(200);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toEqual(id);
    expect(res.body.data[0].name).toEqual('test-role-updated');
    expect(res.body.data[0].description).toEqual('integration tests role updated');
    expect(res.body.data[0].permissions[0].id).toEqual(permission.id);
  });

  test('should fail on wrong id', async () => {
    const res = await request(app)
      .post(path)
      .send({
        id: 'wrong-id',
        name: 'test-role-updated',
        description: 'integration tests role updated',
        permissions: [permission.id]
      });

    expect(res.status).toBe(422);
  });
});
