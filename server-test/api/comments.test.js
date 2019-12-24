const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/core/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/comments`;

describe('comment api test', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);
  beforeAll(async () => {
    await db.model.InternalComment.deleteMany();
    await db.model.User.deleteMany();
  });

  afterEach(async () => {
    await db.model.InternalComment.deleteMany();
    await db.model.User.deleteMany();
  });

  beforeEach(async () => {
    await db.model.User.deleteMany();
  });

  // POST /comments/internal
  test('should raise error if schema is invalid', async () => {
    const res = await request(app)
      .post(`${path}/internal`)
      .send({
        test: 'random'
      });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should raise error if commentator is not found', async () => {
    const user = await db.userFactory();
    const res = await request(app)
      .post(`${path}/internal`)
      .send({
        content: 'test content',
        commentator: db.mocks.mockId,
        user: user._id.toString()
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should raise error if user is not found', async () => {
    const commentator = await db.userFactory();
    const res = await request(app)
      .post(`${path}/internal`)
      .send({
        content: 'test content',
        commentator: commentator._id,
        user: db.mocks.mockId
      });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should raise if text is empty', async () => {
    const [{ _id: user }, { _id: commentator }] = await Promise.all([
      db.userFactory({ username: 'testing1', email: 'email@email.email' }),
      db.userFactory({ username: 'testing2', email: 'email1@email1.email' })
    ]);
    const res = await request(app)
      .post(`${path}/internal`)
      .send({
        content: '',
        user,
        commentator
      });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should create internal comment', async () => {
    const [{ _id: user }, { _id: commentator }] = await Promise.all([
      db.userFactory({ username: 'testing1', email: 'email@email.email' }),
      db.userFactory({ username: 'testing2', email: 'email1@email1.email' })
    ]);
    const res = await request(app)
      .post(`${path}/internal`)
      .send({
        content: 'test',
        user,
        commentator
      });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.comment.content).toBe('test');
    expect(res.body.comment.user.toString()).toBe(user._id.toString());
    expect(res.body.comment.commentator.toString()).toBe(commentator._id.toString());
  });
  test('should add internal comment to user model', async () => {
    const comment = await db.commentFactory();
    const user = await db.model.User.findById(comment.user);
    expect(user.notes.length).toBe(1);
  });

  // DELETE /comments/internal/:comment
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).delete(`${path}/internal/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if comment is not found', async () => {
    const res = await request(app).delete(`${path}/internal/${db.mocks.mockId}`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should delete internal comment', async () => {
    const comment = await db.commentFactory();
    const res = await request(app).delete(`${path}/internal/${comment._id.toString()}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.comment.id).toBe(comment._id.toString());
  });
  test('sohuld delete internal comment from user model', async () => {
    const comment = await db.commentFactory();
    console.log('Comment ->', comment);
    const res = await request(app).delete(`${path}/internal/${comment._id.toString()}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.comment.id).toBe(comment._id.toString());

    const user = await db.model.User.findById(comment.user);
    expect(user.notes.length).toBe(0);
  });
});
