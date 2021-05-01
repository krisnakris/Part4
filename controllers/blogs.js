const Blog = require('../models/blog');

class BlogController {
  static getAllBlogs(req, res, next) {
    Blog
      .find({})
      .then((blogs) => {
        res.json(blogs);
      })
      .catch((err) => {
        next(err);
      });
  }

  static postBlog(req, res, next) {
    const blog = new Blog(req.body);
    blog
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((error) => {
        next(error);
      });
  }
}

module.exports = BlogController;
