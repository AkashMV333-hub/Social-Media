const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary for image uploads
 * Falls back to local storage if USE_LOCAL_STORAGE is true
 */
const configureCloudinary = () => {
  if (process.env.USE_LOCAL_STORAGE === 'true') {
    console.log('Using local file storage (Cloudinary disabled)');
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('Cloudinary configured successfully');
};

module.exports = { cloudinary, configureCloudinary };
