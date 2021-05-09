/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);
let token = null;
let blogInitialSetup;

beforeAll(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({
    username: 'root', passwordHash, blogs: [], name: 'cepot',
  });
  // eslint-disable-next-line no-underscore-dangle
  await user.save();

  const userLogin = {
    username: 'root',
    password: 'sekret',
  };

  const response = await api.post('/api/login').send(userLogin);
  token = `bearer ${response.body.token}`;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  const newBlog = {
    title: 'Security Analysis 2',
    author: 'Benjamin Graham',
    url: 'https://google.com',
    likes: '10',
  };

  blogInitialSetup = await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token });
});

describe('there is some initial blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all initial blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('a spesific note is within the returned notes', async () => {
    const response = await api.get('/api/blogs');

    const contents = response.body.map((blog) => blog.title);
    expect(contents).toContain('React patterns');
  });
});

describe('viewing a spesific note', () => {
  test('Blog has unique identifier formatted by id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });

  test('fails with statuscode 404 if blog does not exist', async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'google' });
    await blog.save();
    await blog.remove();

    // eslint-disable-next-line no-underscore-dangle
    const validNonExistingId = blog._id.toString();

    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '34980918098908908a09s';

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a blog', () => {
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
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // const response = await api.get('/api/blogs');
    const blogAtEnd = await helper.blogsInDb();
    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 2);

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
      .set({ Authorization: token })
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
      .set({ Authorization: token })
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('authorization is not set, will return error 401 Unauthorize', async () => {
    const newBlog = {
      author: 'Benjamin Graham',
      likes: '10',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });
});

describe('updating a blog', () => {
  test('success update blog if id is valid', async () => {
    const blogAtStart = await helper.blogsInDb();
    const blogToUpdate = await blogAtStart[1];

    const newBlog = {
      title: 'Margin Of Safety',
      author: 'Seth Klarman',
      url: 'https://google.book.com',
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200);

    const { body } = await api.get(`/api/blogs/${blogToUpdate.id}`);

    expect(body.title).toEqual(newBlog.title);
    expect(body.author).toEqual(newBlog.author);
    expect(body.url).toEqual(newBlog.url);
  });
});

describe('deletion of a blog', () => {
  test('suceed with status code 204 if id is valid', async () => {
    const blogToDeleteId = blogInitialSetup.body.id;

    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set({ Authorization: token })
      .expect(204);
  });

  test('Unauthorize delete will return status code 401 if not specify token', async () => {
    const blogToDeleteId = blogInitialSetup.body.id;

    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
