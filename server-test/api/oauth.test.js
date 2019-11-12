const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/oauth`;

describe('oauth apis', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  beforeAll(async () => {
    await db.model.Permission.deleteMany({});
    await db.model.Role.deleteMany({});
    await db.model.User.deleteMany({});
  });

  beforeAll(async () => {
    // test user role
    let res = await request(app)
      .post(`${config.get('base-path')}/role`)
      .send({
        name: 'test-role',
        description: 'test user role'
      });
    expect(res.status).toBe(200);

    // test user
    res = await request(app)
      .post(`${config.get('base-path')}/user`)
      .send({
        email: 'user@test.com',
        password: 'testpassword',
        roles: ['test-role']
      });
    expect(res.status).toBe(200);
  });

  test('should authorize and get tokens', async () => {
    const res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(200);
  });
});
