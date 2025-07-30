import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/temp");
    },
    filename: function(req, file, callback) {
        console.log("\nDEBUG: multer.middleware.js -> storage -> filename -> file:\n", JSON.stringify(file))
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        callback(null, file.originalname);
    }
});

export const upload = multer({ storage: storage });