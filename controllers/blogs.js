const Blog = require('../models/blog');

class BlogController {
  static async getAllBlogs(req, res, next) {
    // Blog
    //   .find({})
    //   .then((blogs) => {
    //     res.json(blogs);
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
    try {
      const blogs = await Blog.find({});
      res.json(blogs);
    } catch (error) {
      next(error);
    }
  }

  static async postBlog(req, res, next) {
    // const blog = new Blog(req.body);
    // blog
    //   .save()
    //   .then((result) => {
    //     res.status(201).json(result);
    //   })
    //   .catch((error) => {
    //     next(error);
    //   });

    try {
      const blog = await new Blog(req.body).save();

      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BlogController;
