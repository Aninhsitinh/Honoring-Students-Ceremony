const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteCloudinaryImage = async (url) => {
  if (!url || !url.includes('cloudinary.com')) return;
  try {
    const parts = url.split('/');
    const fileWithExt = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const fileName = fileWithExt.split('.')[0];
    
    // According to multer config, images are in folder 'honoring_students'
    // Ensure we capture the correct folder structure if it exists
    let publicId = fileName;
    if (folder !== 'upload') {
      publicId = `${folder}/${fileName}`;
    }
    
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
};

module.exports = {
  deleteCloudinaryImage
};
