import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a simple storage configuration
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/flats'),
    filename: (req, file, cb) => {
        cb(null, `flat-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({ storage }).array('images', 5);