const router = require('express').Router();
const blogsController = require('../controllers/blogs');

router.get('/', blogsController.getAllBlogs);
router.post('/', blogsController.postBlog);

module.exports = router;