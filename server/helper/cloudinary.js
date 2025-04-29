const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  const fs = require('fs');

  if (!fs.existsSync(filePath)) {
    console.error('File does not exist at path:', filePath);
    throw new Error('Local file not found');
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error.response || error.message || error);
    throw new Error("Error uploading to Cloudinary");
  }
};


const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting from Cloudinary");
  }
};

module.exports = {uploadMediaToCloudinary, deleteMediaFromCloudinary};