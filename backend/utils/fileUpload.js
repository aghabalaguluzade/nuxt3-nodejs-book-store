import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/uploads');
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
      // cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`);
   }
});

const upload = multer({
   storage,
   fileFilter: (req, file, cb) => {
      if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
         cb(null, true);     
      }else {
         cb(new Error('MimeType not supported'), false);
      }
   },
   limits: {
      fileSize: 1024 * 1024 * 2
   },
});

export default upload;