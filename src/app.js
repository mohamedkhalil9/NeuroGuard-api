import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import appRouter from './routes/indexRouter.js';
import mongoose from 'mongoose';
import './services/passport.js';
import cors from 'cors';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { v2  as cloudinary } from 'cloudinary';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  }) 
}))

// XSS - CSRF (cros site something) 'security'
// WINSTON (logger)
// SWAGGER (api documentation with ui 'swagger-ui')
// dev and prod env (.env variable for diffrenet environments for control over them)

//cloudinary.config({ 
//  cloud_name: 'my_cloud_name', 
//  api_key: 'my_key', 
//  api_secret: 'my_secret'
//});
//cloudinary.uploader
//  .upload("my_image.jpg")
//  .then(result=>console.log(result));
// Apply rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);
app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', appRouter);

app.all('*', (req, res, next)=> {
  return res.status(404).json({ status: "error", message: 'this resource is not available'});
})

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500)
  .json({ status: error.statusText || "error", message: error.message, code: error.statusCode || 500, data: null});
})

export default app;
