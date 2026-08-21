const cloudinary = require("../config/cloudinary");

const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "my-app/products",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.error(
                        "CLOUDINARY ERROR:",
                        error
                    );

                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

const deleteImage = async (publicId) => {
    if (!publicId) {
        return;
    }

    return cloudinary.uploader.destroy(publicId);
};

module.exports = {
    uploadImage,
    deleteImage,
};
