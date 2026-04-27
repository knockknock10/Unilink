import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = ['uploads/images', 'uploads/videos', 'uploads/docs'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, 'uploads/images');
        } else if (file.fieldname === 'video') {
            cb(null, 'uploads/videos');
        } else if (file.fieldname === 'document') {
            cb(null, 'uploads/docs');
        } else {
            cb(new Error('Invalid field name'), false);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File Filtering
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png/;
    const allowedVideoTypes = /mp4|mov/;
    const allowedDocTypes = /pdf|docx/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (file.fieldname === 'image') {
        if (allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype)) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, jpeg, png) are allowed!'));
    } else if (file.fieldname === 'video') {
        if (allowedVideoTypes.test(extname) || mimetype.includes('video')) {
            return cb(null, true);
        }
        cb(new Error('Only videos (mp4, mov) are allowed!'));
    } else if (file.fieldname === 'document') {
        if (allowedDocTypes.test(extname) || mimetype.includes('pdf') || mimetype.includes('word')) {
            return cb(null, true);
        }
        cb(new Error('Only documents (pdf, docx) are allowed!'));
    } else {
        cb(new Error('Unknown file field'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

/**
 * Wraps upload.fields() and catches multer errors cleanly.
 */
const handlePostUpload = (req, res, next) => {
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'document', maxCount: 1 },
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        console.log('[multer] req.files:', req.files || 'NO FILES RECEIVED');
        next();
    });
};

export { upload, handlePostUpload };
