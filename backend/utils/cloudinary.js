// utils/cloudinary.js

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true 
});


const uploadToCloudinary = async (fileBuffer, folder) => {
  try {
    
    const base64File = `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`;

    const options = {
      resource_type: 'auto', 
      folder: `vidyapaalam/${folder}`, 
      use_filename: true,
      unique_filename: true, 
      overwrite: false 
    };

    const result = await cloudinary.uploader.upload(base64File, options);
    return result; 
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Deleted ${publicId} from Cloudinary. Result:`, result);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
