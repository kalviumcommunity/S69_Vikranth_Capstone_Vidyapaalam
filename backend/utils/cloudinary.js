const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const LARGE_VIDEO_THRESHOLD_BYTES = 50 * 1024 * 1024;

const uploadToCloudinary = async (fileBuffer, folder) => {
  const base64File = `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`;
  const uploadOptions = {
    resource_type: 'auto',
    folder: `vidyapaalam/${folder}`,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };

  try {
    if (fileBuffer.mimetype.startsWith('video/') && fileBuffer.size > LARGE_VIDEO_THRESHOLD_BYTES) {
      return await cloudinary.uploader.upload_large(base64File, uploadOptions);
    } else {
      return await cloudinary.uploader.upload(base64File, uploadOptions);
    }
  } catch (error) {
    throw new Error(`Cloudinary upload failed for ${folder}/${fileBuffer.originalname}: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return false;

  // Strip folder prefix from publicId
  const folderPrefix = `vidyapaalam/${resourceType === 'image' ? 'avatars' : 'videos'}/`;
  const cleanPublicId = publicId.startsWith(folderPrefix) ? publicId.replace(folderPrefix, '') : publicId;

  console.log(`DEBUG: Attempting to delete from Cloudinary with cleanPublicId: ${cleanPublicId} (resourceType: ${resourceType})`);

  try {
    const result = await cloudinary.uploader.destroy(cleanPublicId, { resource_type: resourceType });
    if (result.result === 'ok') {
      console.log(`DEBUG: Cloudinary deletion successful for ${cleanPublicId}`);
      return true;
    } else {
      throw new Error(`Cloudinary deletion failed for ${cleanPublicId}: ${result.result || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(`DEBUG: Cloudinary deletion error for ${cleanPublicId}: ${error.message}`);
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
