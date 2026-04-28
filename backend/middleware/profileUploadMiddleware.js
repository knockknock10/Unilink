import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists (only in local development)
const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY;
if (!isProduction) {
    const uploadDir = 'uploads/';
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (err) {
        console.warn(`Could not create directory ${uploadDir}:`, err.message);
    }
}

// Disk storage — saves file with original extension so Cloudinary can detect type
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + ext);
    },
});

// Only allow image MIME types
const fileFilter = (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMime.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'), false);
    }
};

const profileUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/**
 * Wraps profileUpload.single('image') and catches multer-specific errors.
 * Returns a clean JSON 400 response instead of crashing the server.
 */
const handleProfileUpload = (req, res, next) => {
    profileUpload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        console.log('[multer] req.file:', req.file || 'NO FILE RECEIVED');
        next();
    });
};

export { profileUpload, handleProfileUpload };
