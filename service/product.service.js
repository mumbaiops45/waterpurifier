const Product = require("../models/Product");
const {uploadImage , deleteImage} = require("./clodinary.service");


const createProduct = async ({ imageBuffer, name, description, price, owner }) => {
    const uploadedImage = await uploadImage(imageBuffer);

    const product = await Product.create({
        image : {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        }, name, description, price, owner,
    });
    return product;
};

const getAllProducts = async () => {
    const products = await Product.find().populate("owner", "name email").sort({createdAt: -1 });

    return products;
};

const getProductById = async (productId) => {
    const product = await Product.findById(productId).populate("owner", "name email");

    if(!product){
        throw new Error("Product not found");
    }
    return product;
};


const updateProduct = async (productId, userId, updateData, imageBuffer = null) => {
    const product = await Product.findById(productId).select("owner image");

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    if (product.owner.toString() !== userId.toString()) {
        const error = new Error("You are not allowed to update this product");
        error.statusCode = 403;
        throw error;
    }

    const patch = { ...updateData };
    let staleImageId = null;

    if (imageBuffer) {
        const uploaded = await uploadImage(imageBuffer);
        patch.image = { url: uploaded.secure_url, publicId: uploaded.public_id };
        staleImageId = product.image?.publicId || null;
    }

    if (Object.keys(patch).length === 0) {
        const error = new Error("Nothing to update");
        error.statusCode = 400;
        throw error;
    }

    const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: patch },
        { new: true, runValidators: true }
    );
    if (staleImageId) {
        deleteImage(staleImageId).catch((err) =>
            console.error("Cloudinary cleanup failed:", staleImageId, err.message)
        );
    }

    return updated;
};

const deleteProduct = async (productId, userId) => {
    const product = await Product.findById(productId);

    if(!product){
        throw new Error("Product not found");
    }

    if(product.owner.toString() !== userId.toString()) {
        const error = new Error("You are not allowed to delete this product");

        error.statusCode = 403;

        throw error;
    }

    await Product.findByIdAndDelete(productId);
    return true;
};


const getMyProducts = async (userId) => {
    const products = await Product.find({owner: userId,});
    return products;
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts,
};


