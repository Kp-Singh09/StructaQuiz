import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/formRoutes.js'; 
import responseRoutes from './routes/responseRoutes.js';
import imageKitRoutes from './routes/imageKitRoutes.js'; 
import statsRoutes from './routes/statsRoutes.js';

// Initialize App
dotenv.config();
const app = express();

// Middleware
// Configure CORS to only allow requests from your specific frontend URL
const corsOptions = {
  origin: process.env.FRONTEND_URL, 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test Route
app.get('/', (req, res) => {
  res.send('Form Builder API is running!');
});


// API Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/imagekit', imageKitRoutes);
app.use('/api/stats', statsRoutes);

// Database Connection and Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.error(`${error} did not connect`));