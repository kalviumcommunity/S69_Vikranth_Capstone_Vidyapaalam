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
        console.log('Attempting Cloudinary upload...');
        console.log('File Mimetype:', fileBuffer.mimetype);
        console.log('File Size (bytes):', fileBuffer.size);
       

        const base64File = `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`;

        const options = {
          resource_type: 'auto',
          folder: `vidyapaalam/${folder}`,
          use_filename: true,
          unique_filename: true,
          overwrite: false
        };

        const result = await cloudinary.uploader.upload(base64File, options);
        console.log('Cloudinary upload successful. Public ID:', result.public_id);
        return result;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to Cloudinary');
      }
    };


const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  console.log(`DEBUG: Cloudinary deletion request for Public ID: ${publicId}, Resource Type: ${resourceType}`);
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`DEBUG: Cloudinary deletion result for ${publicId}:`, result);
    if (result.result === 'ok') {
      return true;
    } else {
      console.error(`DEBUG: ERROR: Cloudinary deletion failed for ${publicId}. Result:`, result);
      throw new Error(`Cloudinary deletion failed for ${publicId}: ${result.result}`);
    }
  } catch (error) {
    console.error(`DEBUG: ERROR: Exception during Cloudinary deletion for ${publicId}:`, error.message);
    throw error;
  }
};


    module.exports = { uploadToCloudinary, deleteFromCloudinary };
