const Product = require("../models/Product");


const createProduct = async ({ image, name, description, price, owner }) => {
    const product = await Product.create({
        image, name, description, price, owner,
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

const updateProduct = async(productId , userId,updateData) => {
    const product = await Product.findById(productId);

    if(!product) {
        throw new Error("Product not found");
    }

    if(product.owner.toString() !== userId.toString()){
        const error = new Error("You are not allowed to update this product");

        error.statusCode = 403;

        throw error;
    }

    const updateProduct = await Product.findByIdAndUpdate(productId , updateData, {
        new: true,
        runValidators: true,
    });

    return updateProduct;
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


