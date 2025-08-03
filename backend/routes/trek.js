const express = require('express');
const router = express.Router();
const trekController = require('../controllers/trekController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // For local, or use cloudinary for production

router.get('/', trekController.getAllTreks);
router.post('/', authenticate, upload.single('image'), trekController.addTrek);
router.get('/:id', trekController.getTrekById);
router.post('/:id/reviews', authenticate, upload.array('photos'), trekController.addReview);
router.post('/:trekId/reviews/:reviewId/like', authenticate, trekController.likeReview);
router.post('/:trekId/reviews/:reviewId/comments', authenticate, trekController.addComment);

module.exports = router;
