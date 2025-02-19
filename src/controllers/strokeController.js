import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const BASE_URL = "http://127.0.0.1:8000";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const prediction = asyncWrapper(async (req, res) => {
  const response = await axios.post(`${BASE_URL}/predict/`, req.body);

  res.status(200).json({ status: "success", data: response.data });
});

export const uploadImage = [
  upload.single("file"),
  asyncWrapper(async (req, res) => {
    if (!req.file) throw new ApiError("No file uploaded", 400);

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${BASE_URL}/upload-image/`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.status(200).json({ status: "success", data: response.data });
  }),
];

export const chatbot = asyncWrapper(async (req, res) => {
  const response = await axios.post(`${BASE_URL}/chat/`, req.body);
  res.status(200).json({ status: "success", data: response.data });
});

export const uploadPdf = [
  upload.single("file"),
  asyncWrapper(async (req, res) => {
    if (!req.file) throw new ApiError("No file uploaded", 400);

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(`${BASE_URL}/upload-pdf/`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.status(200).json({ status: "success", data: response.data });
  }),
];
