import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import axios from "axios";
import FormData from "form-data";

const BASE_URL = process.env.BASE_URL;

export const prediction = asyncWrapper(async (req, res) => {
  const response = await axios.post(`${BASE_URL}/predict/`, req.body);
  const prediction = response.data;
  res.status(200).json({ status: "success", data: prediction });
});

export const uploadImage = asyncWrapper(async (req, res) => {
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

  const detection = response.data;
  res.status(200).json({ status: "success", data: detection });
});

export const srganPrediction = asyncWrapper(async (req, res) => {
  if (!req.file) throw new ApiError("No file uploaded", 400);

  const formData = new FormData();
  formData.append("file", req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });
  const modelResponse = await axios.post(
    `${BASE_URL}/predict/srgan/`,
    formData,
    {
      headers: formData.getHeaders(),
      responseType: "arraybuffer",
    },
  );
  const modelImageBuffer = Buffer.from(modelResponse.data, "binary");

  const formData2 = new FormData();
  formData2.append("file", modelImageBuffer, {
    filename: "model_output.png",
    contentType: "image/png",
  });
  const detectionResponse = await axios.post(
    `${BASE_URL}/upload-image/`,
    formData2,
    {
      headers: formData2.getHeaders(),
      responseType: "json",
    },
  );

  const base64Image = modelImageBuffer.toString("base64");

  res.status(200).json({
    status: "success",
    data: {
      image: base64Image,
      detection: detectionResponse.data,
    },
    message: "Success: SRGAN output processed and detection completed.",
  });
});

export const denoisingPrediction = asyncWrapper(async (req, res) => {
  if (!req.file) throw new ApiError("No file uploaded", 400);

  const formData = new FormData();
  formData.append("file", req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });
  const modelResponse = await axios.post(
    `${BASE_URL}/predict/denoising/`,
    formData,
    {
      headers: formData.getHeaders(),
      responseType: "arraybuffer",
    },
  );
  const modelImageBuffer = Buffer.from(modelResponse.data, "binary");

  const formData2 = new FormData();
  formData2.append("file", modelImageBuffer, {
    filename: "model_output.png",
    contentType: "image/png",
  });
  const detectionResponse = await axios.post(
    `${BASE_URL}/upload-image/`,
    formData2,
    {
      headers: formData2.getHeaders(),
      responseType: "json",
    },
  );

  const base64Image = modelImageBuffer.toString("base64");

  res.status(200).json({
    status: "success",
    data: {
      image: base64Image,
      detection: detectionResponse.data,
    },
    message: "Success: Denoising GAN output processed and detection completed.",
  });
});

export const cycleganPrediction = asyncWrapper(async (req, res) => {
  if (!req.file) throw new ApiError("No file uploaded", 400);
  const formData = new FormData();
  formData.append("file", req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });
  const modelResponse = await axios.post(
    `${BASE_URL}/predict/cyclegan/`,
    formData,
    {
      headers: formData.getHeaders(),
      responseType: "arraybuffer",
    },
  );
  const modelImageBuffer = Buffer.from(modelResponse.data, "binary");

  const formData2 = new FormData();
  formData2.append("file", modelImageBuffer, {
    filename: "model_output.png",
    contentType: "image/png",
  });
  const detectionResponse = await axios.post(
    `${BASE_URL}/upload-image/`,
    formData2,
    {
      headers: formData2.getHeaders(),
      responseType: "json",
    },
  );

  const base64Image = modelImageBuffer.toString("base64");

  res.status(200).json({
    status: "success",
    data: {
      image: base64Image,
      detection: detectionResponse.data,
    },
    message: "Success: CycleGAN output processed and detection completed.",
  });
});

// export const chatbot = asyncWrapper(async (req, res) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/chat/stream`, req.body);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.response?.data || error.message || "Internal Server Error" });
//   }
// });

// export const uploadPdf = [
//   upload.single("file"),
//   asyncWrapper(async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       const formData = new FormData();
//       formData.append("file", req.file.buffer, req.file.originalname);

//       const response = await axios.post(`${BASE_URL}/upload-pdf/`, formData, {
//         headers: {
//           ...formData.getHeaders(),
//         },
//       });

//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.response?.data || error.message || "Internal Server Error" });
//     }
//   }),
// ];
