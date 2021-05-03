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

  static async getSingleBlogs(req, res, next) {
    try {
      const blog = await Blog.findById(req.params.id);

      if (blog) {
        res.json(blog);
      } else {
        res.status(404).end();
      }
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

  static async deleteBlogs(req, res, next) {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  static async updateBlogs(req, res, next) {
    try {
      const { body } = req;
      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
      };

      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog);
      console.log('updatedBlog: ', updatedBlog);
      res.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BlogController;
