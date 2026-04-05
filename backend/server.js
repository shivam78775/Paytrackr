import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';

// Route imports
import authRoutes from './routes/auth.js';
import dueRoutes from './routes/dues.js';
import stitchingRoutes from './routes/stitching.js';
import dashboardRoutes from './routes/dashboard.js';
import reportsRoutes from './routes/reports.js';
import { requireAuth } from './middleware/requireAuth.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("PayTrackr API is running 🚀");
});

app.use('/api/auth', authRoutes);
app.use('/api/dues', requireAuth, dueRoutes);
app.use('/api/stitching', requireAuth, stitchingRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/reports', requireAuth, reportsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
