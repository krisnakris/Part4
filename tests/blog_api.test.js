const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

const api = supertest(app);

describe('Test for formating', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('the first blog is react patterns', async () => {
    const response = await api.get('/api/blogs');

    const contents = response.body.map((blog) => blog.title);
    expect(contents).toContain('React patterns');
  });
});

describe('Testing api functionality', () => {
  test('blog has unique identifier formatted by id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Security Analysis',
      author: 'Benjamin Graham',
      url: 'https://google.com',
      likes: '10',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // const response = await api.get('/api/blogs');
    const blogAtEnd = await helper.blogsInDb();
    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const title = blogAtEnd.map((blog) => blog.title);
    const author = blogAtEnd.map((blog) => blog.author);
    const url = blogAtEnd.map((blog) => blog.url);
    const likes = blogAtEnd.map((blog) => blog.likes);

    expect(title).toContain('Security Analysis');
    expect(author).toContain('Benjamin Graham');
    expect(url).toContain('https://google.com');
    expect(likes).toContain(10);
  });

  test('likes missing from post request, will return default value 0', async () => {
    const newBlog = {
      title: 'The Intelligent Investor',
      author: 'Benjamin Graham',
      url: 'https://google.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // const response = await api.get('/api/blogs');
    const blogAtEnd = await helper.blogsInDb();
    const likes = blogAtEnd.map((blog) => blog.likes);

    expect(likes).toContain(0);
  });

  test('title and url missing from post request, will return error 400 Bad Request', async () => {
    const newBlog = {
      author: 'Benjamin Graham',
      likes: '10',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
