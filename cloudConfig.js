const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderbnb_DEV',
        allowedFormats: ["png", "jpg", "jpeg"]
    },
});

module.exports = {
    cloudinary,
    storage
}


// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
//   api_key: process.env.CLOUD_API_KEY,       // Replace with your Cloudinary API key
//   api_secret: process.env.CLOUD_API_SECRET, // Replace with your Cloudinary API secret
// });

// // Initialize CloudinaryStorage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'wanderbnb_DEV', // Replace with the desired folder name in Cloudinary
//     allowed_formats: ['jpg', 'png'], // Specify allowed formats (optional)
//     public_id: (req, file) => file.originalname, // Use original file name as public ID
//   },
// });

// // Initialize multer with the Cloudinary storage
// const upload = multer({ storage });

// // Example usage in an Express route
// const express = require('express');
// const app = express();

// app.post('/upload', upload.single('image'), (req, res) => {
//   res.status(200).json({ message: 'Image uploaded successfully!', file: req.file });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
