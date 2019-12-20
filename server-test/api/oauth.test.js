const HttpStatus = require('http-status-codes');
const request = require('supertest');
const jwt = require('jsonwebtoken');
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
    // test user permission
    let res = await request(app)
      .post(`${config.get('base-path')}/permission`)
      .send({
        name: 'test-permission',
        description: 'test user role'
      });
    expect(res.status).toBe(HttpStatus.OK);

    // test user role
    res = await request(app)
      .post(`${config.get('base-path')}/role`)
      .send({
        name: 'test-role',
        description: 'test user role',
        permissions: ['test-permission']
      });
    expect(res.status).toBe(HttpStatus.OK);

    // test user
    res = await request(app)
      .post(`${config.get('base-path')}/user`)
      .send({
        email: 'user@test.com',
        password: 'testpassword',
        roles: ['test-role']
      });
    expect(res.status).toBe(HttpStatus.OK);
  });

  test('should fail request is not correct', async () => {
    const res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'wrong!',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'wrong!password'
      });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should fail when password is wrong', async () => {
    const res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'wrong!password'
      });
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should authorize and get tokens', async () => {
    let res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(HttpStatus.OK);

    const at = res.body.access_token;
    const data = jwt.decode(at);
    expect(data.username).toBe('user@test.com');
    expect(data.email).toBe('user@test.com');
    expect(data.roles).toEqual(['test-role']);
    expect(data.permissions).toEqual(['test-permission']);
    expect(data.exp * 1000).toBeGreaterThan(Date.now());

    res = await request(app)
      .get(`${config.get('base-path')}/user/test-users-only/`)
      .set('Authorization', `Bearer ${at}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual(true);
  });

  test('should authorize, get tokens and get 401 when expired', async () => {
    let res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(HttpStatus.OK);
    const at = res.body.access_token;

    // waiting to expire
    await new Promise(resolve => setTimeout(() => resolve(), 2100));
    res = await request(app)
      .get(`${config.get('base-path')}/user/test-users-only/`)
      .set('Authorization', `Bearer ${at}`);
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should authorize, refresh tokens and when expired', async () => {
    let res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(HttpStatus.OK);
    let at = res.body.access_token;
    const rt = res.body.refresh_token;

    // waiting to expire
    await new Promise(resolve => setTimeout(() => resolve(), 2100));
    // refresh
    res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'refresh_token',
        client_id: 'WEB-APP',
        refresh_token: rt
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.refresh_token).toBe(rt);
    expect(res.body.access_token).not.toBe(at);
    at = res.body.access_token;

    res = await request(app)
      .get(`${config.get('base-path')}/user/test-users-only/`)
      .set('Authorization', `Bearer ${at}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual(true);

    // should fail on another role
    res = await request(app)
      .get(`${config.get('base-path')}/user/admin-users-only/`)
      .set('Authorization', `Bearer ${at}`);
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);

    res = await request(app)
      .get(`${config.get('base-path')}/user/test-permission-only/`)
      .set('Authorization', `Bearer ${at}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual(true);

    // should fail on another permission
    res = await request(app)
      .get(`${config.get('base-path')}/user/write-permission-only/`)
      .set('Authorization', `Bearer ${at}`);
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should authorize and fail when refresh token is wrong', async () => {
    let res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(HttpStatus.OK);
    const at = res.body.access_token;

    res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'refresh_token',
        client_id: 'WEB-APP',
        refresh_token: at
      });
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should authorize and fail when refresh token is expired', async () => {
    let res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(HttpStatus.OK);
    const rt = res.body.refresh_token;

    // waiting to expire
    await new Promise(resolve => setTimeout(() => resolve(), 4100));
    res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'refresh_token',
        client_id: 'WEB-APP',
        refresh_token: rt
      });
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should authorize and fail to refresh when user is revoked', async () => {
    let res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'password',
        client_id: 'WEB-APP',
        username: 'user@test.com',
        password: 'testpassword'
      });
    expect(res.status).toBe(HttpStatus.OK);
    const rt = res.body.refresh_token;

    await db.model.User.deleteMany({});

    res = await request(app)
      .post(`${path}/token`)
      .send({
        grant_type: 'refresh_token',
        client_id: 'WEB-APP',
        refresh_token: rt
      });
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
