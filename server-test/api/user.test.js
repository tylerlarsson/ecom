const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/user`;

describe('user apis', () => {
  let testRole;

  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  beforeAll(async () => {
    await db.model.Permission.deleteMany({});
    await db.model.Role.deleteMany({});
  });

  beforeAll(async () => {
    const res = await request(app)
      .post(`${config.get('base-path')}/role`)
      .send({
        name: 'test-role',
        description: 'integration test role'
      });

    testRole = res.body;

    expect(res.status).toBe(200);
  });

  beforeEach(async () => {
    await db.model.User.deleteMany({});
  });

  test('should fail to create when wrong values', async () => {
    const res = await request(app)
      .post(path)
      .send({
        email: 'test@usercom',
        description: 'wrong email'
      });
    expect(res.status).toBe(422);
  });

  test('should create a user by email as username with a role by name', async () => {
    const res = await request(app)
      .post(path)
      .send({
        email: 'test@user.com',
        password: 'testpassword',
        roles: ['test-role']
      });
    expect(res.status).toBe(200);
    expect(res.body.email).toEqual('test@user.com');
    expect(res.body._id).toMatch(/^[a-z\d]{24}$/);
  });

  test('should create a user by email as username with a role by id', async () => {
    const res = await request(app)
      .post(path)
      .send({
        email: 'test@user.com',
        password: 'testpassword',
        roles: [testRole.id]
      });
    expect(res.status).toBe(200);
    expect(res.body.email).toEqual('test@user.com');
    expect(res.body._id).toMatch(/^[a-z\d]{24}$/);
  });
});
