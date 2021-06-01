const Blog = require('../models/blog');

// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization');
//   if (authorization && authorization.toLowerCase().startsWith('bearer')) {
//     return authorization.substring(7);
//   }
//   return null;
// };

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

    const blogs = await Blog.find({}).populate('user', { username: true, name: true });

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

    const { body, user } = req;

    // const token = getTokenFrom(req);
    // const decodedToken = jwt.verify(req.token, process.env.SECRET);
    // if (!req.token || !decodedToken) {
    //   res.status(401).json({ error: 'token missing or invalid' });
    // }

    // const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      likes: body.likes,
      url: body.url,
      // eslint-disable-next-line no-underscore-dangle
      user: user._id,
    });

    const savedBlog = await blog.save();
    // eslint-disable-next-line no-underscore-dangle
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  }

  static async deleteBlogs(req, res) {
    // try {
    //   await Blog.findByIdAndDelete(req.params.id);
    //   res.status(204).end();
    // } catch (error) {
    //   next(error);
    // }
    const { user } = req;
    const blog = await Blog.findById(req.params.id);

    // eslint-disable-next-line no-underscore-dangle
    if (user._id.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(req.params.id);
      res.status(204).end();
    }
    // await Blog.findByIdAndDelete(req.params.id);
    res.status(401).json({ error: 'Unauthorize' });
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
      likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true });
    res.json(updatedBlog);
  }
}

module.exports = BlogController;
