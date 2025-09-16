  const multer = require('multer');

  const storage = multer.memoryStorage(); 

  const fileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image and video files are allowed!'), false);
      }
    };

  const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024 
      }
    }).fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'galleryPhotos', maxCount: 10 } 
    ]);

    module.exports = upload;
    
