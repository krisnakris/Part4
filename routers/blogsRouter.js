const router = require('express').Router();
const blogsController = require('../controllers/blogs');
const middleware = require('../utils/middleware');

router.get('/', blogsController.getAllBlogs);
router.get('/:id', blogsController.getSingleBlogs);

router.put('/:id', blogsController.updateBlogs);
router.use('/', middleware.userExtractor);
router.post('/', blogsController.postBlog);
router.delete('/:id', blogsController.deleteBlogs);

module.exports = router;
