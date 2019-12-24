const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/core/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/file`;

describe('file api test', () => {
  // POST /file/image
  test('should raise error if invalid schema', async () => {
    const res = await request(app)
      .post(`${path}/gcs`)
      .send({ image: 12345 });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if cant recognize content type', async () => {
    const res = await request(app)
      .post(`${path}/gcs`)
      .send({ image: 'example.hfgohb' });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should raise error if video', async () => {
    const res = await request(app)
      .post(`${path}/gcs`)
      .send({ image: 'test.webm' });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should return link', async () => {
    const res = await request(app)
      .post(`${path}/gcs`)
      .send({ image: 'test.png' });
    expect(res.status).toBe(HttpStatus.OK);
    // eslint-disable-next-line no-useless-escape
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    expect(regex.test(res.body.url)).toBe(true);
  });

  // POST /file/wistia/:lecture
  test('should raise error if schema is invalid', async () => {
    const res = await request(app).post(`${path}/wistia/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should raise error if not a video', async () => {
    const lecture = await db.lectureFactory();
    const res = await request(app)
      .post(`${path}/wistia/${lecture.id}`)
      .attach('file', 'test.txt');
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should upload video to wista', async () => {
    const lecture = await db.lectureFactory();
    const res = await request(app)
      .post(`${path}/wistia/${lecture.id}`)
      .attach('file', 'SampleVideo_360x240_1mb.mp4');
    expect(res.status).toBe(HttpStatus.OK);
  });

  // DELETE /file/wistia/:hashedId
  test(`should raise error if schema is invalid`, async () => {
    const res = await request(app).delete(`${path}/wistia/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(!!res.body.hashedId).toBe(true);
    expect(!!res.body.id).toBe(true);
    expect(!!res.body.name).toBe(true);
  });

  test(`should delete video from wistia`, async () => {
    const lecture = await db.lectureFactory();
    let res = await request(app)
      .post(`${path}/wistia/${lecture.id}`)
      .attach('file', './test.txt');
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(!!res.body.hashedId).toBe(true);
    expect(!!res.body.id).toBe(true);
    expect(!!res.body.name).toBe(true);
    res = await request(app).delete(`${path}/wistia/${res.body.hashedId}`);
    expect(res.status).toBe(HttpStatus.OK);
  });
});
