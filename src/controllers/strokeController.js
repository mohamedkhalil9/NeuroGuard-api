import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const detection = asyncWrapper(async (req, res) => {

//const storage = multer.memoryStorage();
//const upload = multer({
//  storage: storage,
//  limits: {
//    fileSize: 4 * 1024 * 1024,
//  },
//});

// Multer from client to server => return req.files
//upload(img)

//const uploadImages = async (imageFiles) => {
//  const res = await cloudinary.v2.uploader.upload(dataURI);
//  return res.url;
//}

// Cloudinary from server to cloud => return Url
//const imageFiles = req.files;
//const imageUrls = await uploadImages(imageFiles);

})


export const prediction = asyncWrapper(async (req, res) => {

})

export const chatbot = asyncWrapper(async (req, res) => {

})
