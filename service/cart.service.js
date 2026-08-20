const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (userId, productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
    }
    const product = await Product.findById(productId);
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{
                product: productId,
                quantity: 1,
            },],
        });

        return await cart.populate("items.product");
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());

    if (existingItem) {
        return await cart.populate("items.product");
    }

    cart.items.push({
        product: productId,
        quantity: 1,
    });

    await cart.save();

    return await cart.populate("items.product");
};

const getCart = async (userId) => {
    const cart = await Cart.findOne({
        user: userId,
    }).populate("items.product");

    if (!cart) {
        return {
            user: userId,
            items: [],
        };
    }

    return cart;
};


const removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    cart.items = cart.items.filter(
        (item) =>
            item.product.toString() !== productId.toString()
    );

    await cart.save();

    return await cart.populate("items.product");
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
};