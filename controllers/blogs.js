const Blog = require('../models/blog');

class BlogController {
  static async getAllBlogs(req, res) {
    // Blog
    //   .find({})
    //   .then((blogs) => {
    //     res.json(blogs);
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });

    // try {
    //   const blogs = await Blog.find({});
    //   res.json(blogs);
    // } catch (error) {
    //   next(error);
    // }

    const blogs = await Blog.find({});
    res.json(blogs);
  }

  static async getSingleBlogs(req, res) {
    // try {
    //   const blog = await Blog.findById(req.params.id);

    //   if (blog) {
    //     res.json(blog);
    //   } else {
    //     res.status(404).end();
    //   }
    // } catch (error) {
    //   next(error);
    // }

    const blog = await Blog.findById(req.params.id);

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).end();
    }
  }

  static async postBlog(req, res) {
    // const blog = new Blog(req.body);
    // blog
    //   .save()
    //   .then((result) => {
    //     res.status(201).json(result);
    //   })
    //   .catch((error) => {
    //     next(error);
    //   });

    // try {
    //   const blog = await new Blog(req.body).save();

    //   res.status(201).json(blog);
    // } catch (error) {
    //   next(error);
    // }

    const blog = await new Blog(req.body).save();

    res.status(201).json(blog);
  }

  static async deleteBlogs(req, res) {
    // try {
    //   await Blog.findByIdAndDelete(req.params.id);
    //   res.status(204).end();
    // } catch (error) {
    //   next(error);
    // }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }

  static async updateBlogs(req, res) {
    // try {
    //   const { body } = req;
    //   const newBlog = {
    //     title: body.title,
    //     author: body.author,
    //     url: body.url,
    //   };

    //   const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog);
    //   res.json(updatedBlog);
    // } catch (error) {
    //   next(error);
    // }

    const { body } = req;
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog);
    res.json(updatedBlog);
  }
}

module.exports = BlogController;
