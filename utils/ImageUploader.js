const cloudinary = require('cloudinary').v2;

exports.uploadPdfToCloudinary = async (file, folder) => {
    const options = { folder };
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    options.access_mode='public'

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.destroyImageFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (err) {
        console.log("Error deleting user's image from Cloudinary");
        console.log(err);
    }
};

// File format -> handler controller
exports.isFileTypeSupported = (fileName, supportedTypes) => {
    const fileType = fileName.split('.')[1].toLowerCase();
    return supportedTypes.includes(fileType);
};