/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path from the backend
 * @param {string} type - Type of image ('profile' or 'cover') for fallback placeholder
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath, type = 'profile') => {
  // Default placeholders
  const defaultProfilePicture = 'https://ui-avatars.com/api/?name=User&background=1DA1F2&color=fff&size=150';
  const defaultCoverPhoto = 'https://via.placeholder.com/600x200/1DA1F2/ffffff?text=Cover+Photo';

  // If no image path, return appropriate placeholder
  if (!imagePath) {
    return type === 'cover' ? defaultCoverPhoto : defaultProfilePicture;
  }

  // If already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Otherwise, prepend the backend URL
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${backendUrl}${imagePath}`;
};
