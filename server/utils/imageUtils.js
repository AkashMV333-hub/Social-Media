const { cloudinary } = require('../config/cloudinary');
const fs = require('fs').promises;

/**
 * Upload image to Cloudinary or save locally
 * @param {object} file - Multer file object
 * @param {string} folder - Cloudinary folder name
 * @returns {string} Image URL
 */
const uploadImage = async (file, folder = 'twitter-clone') => {
  try {
    // If using local storage
    if (process.env.USE_LOCAL_STORAGE === 'true') {
      // Return relative path that frontend can access
      return `/uploads/${file.filename}`;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, crop: 'limit' }, // Limit max width to 1000px
        { quality: 'auto:good' }, // Auto quality optimization
      ],
    });

    // Delete temp file after upload
    await fs.unlink(file.path).catch(err => console.error('Error deleting temp file:', err));

    return result.secure_url;
  } catch (error) {
    // Clean up temp file on error
    if (file.path) {
      await fs.unlink(file.path).catch(err => console.error('Error deleting temp file:', err));
    }
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Full Cloudinary URL
 */
const deleteImage = async (imageUrl) => {
  try {
    if (process.env.USE_LOCAL_STORAGE === 'true') {
      // Delete local file
      const filename = imageUrl.split('/').pop();
      await fs.unlink(`./uploads/${filename}`).catch(() => {});
      return;
    }

    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/'); // folder/filename.ext
    const publicId = publicIdWithExt.split('.')[0]; // Remove extension

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image deletion failure shouldn't block other operations
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
