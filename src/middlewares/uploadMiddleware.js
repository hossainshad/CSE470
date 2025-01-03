import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/uploads/flats',
    filename: (req, file, cb) => {
        cb(null, `flat-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (extname && mimetype) cb(null, true);
        else cb('Error: Images only!');
    }
}).array('images', 5); // Max 5 images