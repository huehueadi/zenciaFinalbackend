// import fs from 'fs';
// import multer from 'multer';
// import path from 'path';

// const uploadsDir = path.resolve('src', 'uploads');

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('Uploads directory created inside src folder');
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 3 * 1024 * 1024, 
//   },
// }).array('attachments', 3); 


// export default upload;




import { randomUUID } from 'crypto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Determine uploads directory based on environment
const isVercel = !!process.env.VERCEL; // Vercel sets this environment variable
const uploadsDir = isVercel
  ? path.join('/tmp', 'uploads')
  : path.resolve('src', 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Uploads directory created at ${uploadsDir}`);
  }
} catch (error) {
  console.error(`Failed to create uploads directory at ${uploadsDir}:`, error);
  throw new Error('Uploads directory initialization failed');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Use UUID to avoid filename collisions
    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Optional: Restrict file types for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },
  fileFilter,
}).array('attachments', 3);

export default upload;