require("dotenv").config();

const cloudinary = require("./config/cloudinary");

console.log({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    hasSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
});

cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    {
        folder: "my-app/test",
    },
    (error, result) => {
        if (error) {
            console.error("========== CLOUDINARY ERROR ==========");
            console.error(error);
            console.error("======================================");
            return;
        }

        console.log("========== SUCCESS ==========");
        console.log({
            url: result.secure_url,
            publicId: result.public_id,
        });
    }
);
