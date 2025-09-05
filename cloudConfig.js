const Cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

Cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: 'wandarlust.dev',
    allowerdFormats : ["png" ,"jpg" ,"jpeg"],
  },
});

module.exports ={
    Cloudinary,
    storage,
};