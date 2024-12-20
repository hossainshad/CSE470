import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import registerRoutes from './routes/registerRoutes.js';
import loginRoutes from "./routes/loginRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import homepageRoutes from "./routes/homeRoutes.js"
import OwnerController from './controllers/OwnerController.js';
import tenantRoutes from './routes/tenantRoutes.js'; 

import session from 'express-session';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized:false,
}));


// Setting EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/tenant/ownerInfo', OwnerController.showOwnerInfo);
// Routes
app.use(registerRoutes);
app.use(loginRoutes);
app.use(dashboardRoutes);
app.use(homepageRoutes);
app.use('/tenant', tenantRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
