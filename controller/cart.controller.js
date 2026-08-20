const cartService = require("../service/cart.service");

const addToCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Please login to add product to cart",
            });
        }

        const {productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
            });
        }

        const cart = await cartService.addToCart(req.user.id, productId);

         return res.status(200).json({
            message: "Product added to cart successfully",
            cart,
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);

        return res.status(200).json({cart});
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const {productId} = req.params;

        const cart = await cartService.removeFromCart(req.user.id , productId);

        return res.status(200).json({
            message: "Product removed from cart", 
            cart,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
};