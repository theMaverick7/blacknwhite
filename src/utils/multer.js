import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'media/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage });
export default upload;