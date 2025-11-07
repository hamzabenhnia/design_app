// utils/upload.js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * uploadBase64Image(base64) => returns { url, public_id }
 * Note: base64 should be full DataURL like "data:image/png;base64,...."
 */
exports.uploadBase64Image = async (base64) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64, { folder: 'football_designs' }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
