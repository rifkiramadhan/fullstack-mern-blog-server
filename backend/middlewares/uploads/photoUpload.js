const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Storage
const multerStorage = multer.memoryStorage();

// File Type Checking
const multerFilter = (req, file, cb) => {
  // Check File Type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    // Rejected Files
    cb(
      {
        message: 'Unsupported File Format',
      },
      false
    );
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// Image Resizing
const profilePhotoResize = async (req, res, next) => {
  // Check If There Is No File
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  next();
};

// Post Image Resizing
const postImgResize = async (req, res, next) => {
  // Check If There Is No File
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));

  next();
};

module.exports = { photoUpload, profilePhotoResize, postImgResize };
