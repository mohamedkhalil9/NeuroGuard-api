import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import './services/passport.js';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express'
import spec from './utils/swagger.js';
import connectDB from './config/db.js';
import appRouter from './routes/indexRouter.js';

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

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api', apiLimiter);
app.use(helmet());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))
app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(spec)
})
app.use('/api/v1', appRouter);

app.all('*', (req, res, next)=> {
  return res.status(404).json({ status: "error", message: 'this resource is not available'});
})
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500)
  .json({ status: error.statusText || "error", message: error.message, code: error.statusCode || 500, data: null});
})

export default app;
