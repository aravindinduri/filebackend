import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${path.basename(file.originalname)}`); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and PDFs are allowed'));
    }
};

const upload = multer({
    storage,
    fileFilter,
});

export default upload;


