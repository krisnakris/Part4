const router = require('express').Router();
const blogsController = require('../controllers/blogs');

router.get('/', blogsController.getAllBlogs);
router.get('/:id', blogsController.getSingleBlogs);

router.post('/', blogsController.postBlog);
router.put('/:id', blogsController.updateBlogs);
router.delete('/:id', blogsController.deleteBlogs);

module.exports = router;
