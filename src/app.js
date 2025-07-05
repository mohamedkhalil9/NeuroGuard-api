import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import spec from "./utils/swagger.js";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import "./services/passport.js";
import appRouter from "./routes/indexRouter.js";
import { notFound, globalErrorHandler } from "./middlewares/errorHandler.js";
import allowedOrigins from "./utils/allowedOrigins.js";

connectDB();
connectCloudinary();

const app = express();
app.use(compression());
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  }),
);

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });
// app.use("/api", apiLimiter);
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  }),
);
app.use(morgan("dev"));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(spec);
});
app.use("/api/v1", appRouter);

app.all("*", notFound);
app.use(globalErrorHandler);

export default app;
