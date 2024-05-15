import path from 'path';
import multer from 'multer';

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      return callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      const rnd = Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      return callback(null, `${file.fieldname}-${Date.now()}-${rnd}${ext}`);
    },
  }),
  limits: {
    fieldNameSize: 300,
    fileSize: 1048576, // 1 Mb allowed
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return callback(error, false);
    }

    callback(null, true);
  },
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});
