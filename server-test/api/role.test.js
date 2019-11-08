const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/role`;

describe('role apis', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  let permission;
  let permission2;

  beforeAll(() => db.model.Permission.deleteMany({}));

  beforeAll(async () => {
    let res = await request(app)
      .post(`${config.get('base-path')}/permission`)
      .send({
        name: 'read-write',
        description: 'read write permission'
      });

    expect(res.status).toBe(200);
    permission = res.body;

    res = await request(app)
      .post(`${config.get('base-path')}/permission`)
      .send({
        name: 'read-only',
        description: 'read only permission'
      });

    expect(res.status).toBe(200);
    permission2 = res.body;
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

  test('should fail to read when wrong id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role'
      });

    expect(res.status).toBe(200);

    res = await request(app).get(`${path}/WRONG!`);
    expect(res.status).toBe(422);
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

  test('should fail creation a role when not created permission', async () => {
    const res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id, 'asdasd1231asdasd123asdax']
      });

    expect(res.status).toBe(409);
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

  test('should add permission by name to a role by name', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app).post(`${path}/test-role/permission/read-only`);
    expect(res.status).toBe(200);
    expect(res.body.modified).toBe(1);

    res = await request(app).get(`${path}/test-role`);
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('test-role');
    expect(res.body.description).toEqual('integration tests role');
    expect(res.body.permissions.map(({ name }) => name)).toEqual(['read-write', 'read-only']);
  });

  test('should add permission by id to a role by id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);
    const { id } = res.body;

    res = await request(app).post(`${path}/${id}/permission/${permission2.id}`);
    expect(res.status).toBe(200);
    expect(res.body.modified).toBe(1);

    res = await request(app).get(`${path}/test-role`);
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('test-role');
    expect(res.body.description).toEqual('integration tests role');
    expect(res.body.permissions.map(({ name }) => name)).toEqual(['read-write', 'read-only']);
  });

  test('should fail adding permission by name to a role by name when wrong ids', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app).post(`${path}/WRONG/permission/read-only`);
    expect(res.status).toBe(422);

    res = await request(app).post(`${path}/test-role/permission/WRONG`);
    expect(res.status).toBe(422);

    res = await request(app).post(`${path}/not-existing/permission/read-only`);
    expect(res.status).toBe(422);
  });

  test('should delete permission by name from a role by name', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app).delete(`${path}/test-role/permission/read-write`);
    expect(res.status).toBe(200);
    expect(res.body.modified).toBe(1);

    res = await request(app).get(`${path}/test-role`);
    expect(res.status).toBe(200);
    expect(res.body.permissions).toEqual([]);
  });

  test('should delete permission by id from a role by id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    const { id } = res.body;

    res = await request(app).delete(`${path}/${id}/permission/read-write`);
    expect(res.status).toBe(200);
    expect(res.body.modified).toBe(1);

    res = await request(app).get(`${path}/test-role`);
    expect(res.status).toBe(200);
    expect(res.body.permissions).toEqual([]);
  });

  test('should fail to delete permission by wrong id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app).delete(`${path}/WRONG/permission/WRONG-AGAIN`);
    expect(res.status).toBe(422);
  });

  test('should fail to delete from not existing role', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app).delete(`${path}/not-existing/permission/read-write`);
    expect(res.status).toBe(422);
  });

  test('should delete role by name', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app).delete(`${path}/test-role`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: 1 });
  });

  test('should delete role by id', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);
    const { id } = res.body;

    res = await request(app).delete(`${path}/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: 1 });
  });

  test('should fail to delete role by wrong id', async () => {
    const res = await request(app).delete(`${path}/WRONG`);
    expect(res.status).toBe(422);
  });

  test('should assign filters to role', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app)
      .post(`${path}/test-role/filter`)
      .send(['last-login-after', 'last-login-before']);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ modified: 1 });
  });

  test('should fail to assign filters to role when wrong filters', async () => {
    let res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });
    expect(res.status).toBe(200);

    res = await request(app)
      .post(`${path}/test-role/filter`)
      .send(['wrong-NAME', 'NAME-again']);
    expect(res.status).toBe(422);

    res = await request(app)
      .post(`${path}/test-role/filter`)
      .send(['wrong-filter', 'wrong-again']);
    expect(res.status).toBe(409);
  });
});
