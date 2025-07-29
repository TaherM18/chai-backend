import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localFilePath) {
    if (!localFilePath) {
        return null;
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        console.log("file uploaded to Cloudinary", response.url);
        return response;
    }
    catch (error) {
        console.log();
        // remove the local file as upload operation failed
        fs.unlink(localFilePath);
        return null;
    }
}

export { uploadToCloudinary };