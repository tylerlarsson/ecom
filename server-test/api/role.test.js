const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/role`;

xdescribe('role apis', () => {
  beforeAll(async () => db.open());
  afterAll(() => db.close());

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
    const res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role'
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^[\da-z]{24}$/);
    expect(res.body.name).toBe('test-role');
    expect(res.body.description).toBe('integration tests role');
    expect(res.body.permissions).toEqual([]);
    expect(res.body.filters).toEqual([]);
  });

  test('should create a role with a permissions by id', async () => {
    const res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.id]
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^[\da-z]{24}$/);
    expect(res.body.name).toBe('test-role');
    expect(res.body.description).toBe('integration tests role');
    expect(res.body.permissions).toEqual([permission.id]);
    expect(res.body.filters).toEqual([]);
  });

  test('should create a role with a permissions by name', async () => {
    const res = await request(app)
      .post(path)
      .send({
        name: 'test-role',
        description: 'integration tests role',
        permissions: [permission.name]
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^[\da-z]{24}$/);
    expect(res.body.name).toBe('test-role');
    expect(res.body.description).toBe('integration tests role');
    expect(res.body.permissions).toEqual([permission.id]);
    expect(res.body.filters).toEqual([]);
  });
});
