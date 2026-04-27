import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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
            // e.g. LIMIT_FILE_SIZE
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            // fileFilter rejection or other error
            return res.status(400).json({ message: err.message });
        }

        // Debug log — shows what multer received
        console.log('[multer] req.file:', req.file || 'NO FILE RECEIVED');

        next();
    });
};

export { profileUpload, handleProfileUpload };
