import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localFilePath) {

    function unlinkFileSync() {
        fs.unlinkSync(localFilePath, (err) => {
            if (err) throw err;
            console.log(`\nDEBUG: ${localFilePath} was deleted`);
        });
    }

    if (!localFilePath) {
        return null;
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        console.log("\nDEBUG: File uploaded to Cloudinary with response:\n", JSON.stringify(response));
        unlinkFileSync();
        return response;
    }
    catch (error) {
        // remove the local file as upload operation failed
        console.error("\nERROR - CLOUDINARY: Failed to upload file\n",error);
        unlinkFileSync();
        return null;
    }
}

export { uploadToCloudinary };