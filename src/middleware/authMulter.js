import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadsDir = path.resolve('src', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created inside src folder');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, 
  },
}).array('attachments', 3); 

export default upload;