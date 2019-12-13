const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');
const path = `${config.get('base-path')}/page`;

describe('page api test', () => {
  beforeAll(db.beforeAll);
  const mockCourse = {
    title: 'Mock title course',
    subtitle: 'Mock subtitle course',
    authors: []
  };

  const mockPage = {
    url: '/mockurl',
    title: 'Mock Title',
    description: 'Mock description',
    showFooter: true
  };

  const mockContent = {
    index: 0,
    type: 'image',
    content: 'Mock content'
  };

  beforeEach(async () => {
    await Promise.all([db.model.Course.deleteMany({}), db.model.Page.deleteMany({})]);
  });

  afterEach(async () => {
    await Promise.all([db.model.Course.deleteMany({}), db.model.Page.deleteMany({})]);
  });

  // GET /page/:page
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app).get(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test('should return 404 if no page is found', async () => {
    const res = await request(app).get(`${path}/5de67523938486465bbfdc76`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should return page`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });

    const res = await request(app).get(`${path}/${page._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    const {
      page: { id: resId }
    } = res.body;
    expect(Object.is(resId, page._id.toString())).toBe(true);
  });

  // GET /page/course/:course
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app).get(`${path}/course/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should return pages by course id`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const res = await request(app).get(`${path}/course/${course._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    const {
      pages: [_page]
    } = res.body;
    expect(Object.is(_page.id, page._id.toString())).toBe(true);
  });

  // POST /page
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app)
      .post(`${path}`)
      .send(mockPage);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`shouldn't create without url or course`, async () => {
    let res = await request(app)
      .post(`${path}`)
      .send();
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

    const course = await db.model.Course.create(mockCourse);
    const { url, ...rest } = mockPage;
    res = await request(app).post(`${path}`, { course: course._id, ...rest });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`shouldn't create with non-existing course`, async () => {
    const res = await request(app).post(`${path}`, { course: '5de67523938486465bbfdc76', ...mockPage });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should create a new page', async () => {
    const course = await db.model.Course.create(mockCourse);
    const res = await request(app)
      .post(path)
      .send({ course: course._id, ...mockPage });
    expect(res.status).toBe(HttpStatus.CREATED);
    const { page } = res.body;
    expect(page.course).toBe(course._id);
    expect(page.url).toBe(mockPage.url);
    expect(page.description).toBe(mockPage.description);
    expect(page.showFooter).toBe(mockPage.showFooter);
    expect(page.title).toBe(mockPage.title);
  });

  // PUT /page
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app)
      .put(`${path}`)
      .send(mockPage);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`shouldn't edit with non-existing course`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });

    const res = await request(app)
      .put(path)
      .send({ course: db.mocks.mockId, id: page._id, ...mockPage });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`shouldn't edit with non-existing page`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const res = await request(app)
      .put(path)
      .send({ course: course._id, id: db.mocks.mockId, ...mockPage });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test('should edit a page', async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const editPageMock = {
      title: 'test',
      description: 'test description'
    };

    const res = await request(app)
      .put(path)
      .send({ course: course._id, id: page._id, ...editPageMock });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.page.title).toBe(editPageMock.title);
    expect(res.body.page.description).toBe(editPageMock.description);
  });

  // DELETE /page/:page
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app).delete(`${path}/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should return nothing if no page is found`, async () => {
    const res = await request(app).delete(`${path}/5de67523938486465bbfdc76`);
    expect(res.body.page).toBe(null);
    expect(res.status).toBe(HttpStatus.OK);
  });
  test(`should return page if deleted from DB`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const res = await request(app).delete(`${path}/${page._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(Object.is(res.body.page.id, page._id.toString())).toBe(true);
  });

  // POST /page/:page/content
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app)
      .post(`${path}/12345/content`)
      .send(mockContent);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if page id doesn't exist`, async () => {
    const res = await request(app)
      .post(`${path}/5de67523938486465bbfdc76/content`)
      .send(mockContent);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should add content to page model`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const res = await request(app)
      .post(`${path}/${page._id}/content`)
      .send(mockContent);
    expect(res.status).toBe(HttpStatus.CREATED);
    const created = res.body.page;
    const [insertedContent] = created.content;
    expect(insertedContent.index).toBe(mockContent.index);
    expect(insertedContent.type).toBe(mockContent.type);
    expect(insertedContent.content).toBe(mockContent.content);
  });

  // PUT /page/:page/content
  test(`should raise error if invalid schema`, async () => {
    const res = await request(app)
      .put(`${path}/12345/content`)
      .send(mockContent);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if page id doesn't exist`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const res = await request(app)
      .put(`${path}/${course._id}/content`)
      .send({ id: page._id, ...mockContent });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should raise error if content id doesn't exist`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const res = await request(app)
      .put(`${path}/${page._id}/content`)
      .send({ id: page._id, ...mockContent });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should edit content inside page model`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const pageWithContent = await page.addContent(mockContent);
    const [insertedContent] = pageWithContent.content;
    const editContentMock = {
      content: 'test edit'
    };
    const res = await request(app)
      .put(`${path}/${page._id}/content`)
      .send({ id: insertedContent._id, ...editContentMock });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.page.content[0].content).toBe(editContentMock.content);
  });

  // DELETE /page/:page/content/:content
  test(`should raise if invalid schema`, async () => {
    const res = await request(app).delete(`${path}/12345/content/12345`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
  test(`should raise error if page id or content id doesn't exist`, async () => {
    const res = await request(app).delete(`${path}/5de67523938486465bbfdc76/content/5de67523938486465bbfdc76`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
  test(`should remove content from page model`, async () => {
    const course = await db.model.Course.create(mockCourse);
    const page = await db.model.Page.createPage({ course: course._id, ...mockPage });
    const pageWithContent = await page.addContent(mockContent);
    const [insertedContent] = pageWithContent.content;
    const res = await request(app).delete(`${path}/${page._id}/content/${insertedContent._id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.page.content.length).toBe(0);
  });

  afterAll(db.afterAll);
});
