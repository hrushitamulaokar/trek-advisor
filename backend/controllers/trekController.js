const Trek = require('../models/Trek');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAllTreks = async (req, res) => {
  try {
    const treks = await Trek.find();
    res.json(treks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching treks' });
  }
};

exports.addTrek = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Remove local file
    }
    const trek = new Trek({
      name: req.body.name,
      description: req.body.description,
      image: imageUrl,
      experiences: [],
    });
    await trek.save();
    res.status(201).json(trek);
  } catch (err) {
    res.status(500).json({ message: 'Error adding trek' });
  }
};

exports.getTrekById = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });
    res.json(trek);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trek' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        photoUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const review = {
      user: req.user.name,
      text: req.body.text,
      photos: photoUrls,
      likes: 0,
      likedBy: [],
      comments: [],
    };
    trek.experiences.unshift(review);
    await trek.save();
    res.status(201).json(trek);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
};

exports.likeReview = async (req, res) => {
  try {
    const { trekId, reviewId } = req.params;
    const trek = await Trek.findById(trekId);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    const review = trek.experiences.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const userId = req.user.id;
    if (review.likedBy.includes(userId)) {
      review.likes -= 1;
      review.likedBy = review.likedBy.filter(id => id !== userId);
    } else {
      review.likes += 1;
      review.likedBy.push(userId);
    }
    await trek.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error liking review' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { trekId, reviewId } = req.params;
    const trek = await Trek.findById(trekId);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    const review = trek.experiences.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.comments.push({ user: req.user.name, text: req.body.text });
    await trek.save();
    res.status(201).json(review.comments);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};
