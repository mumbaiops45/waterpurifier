const productService = require("../service/product.service");

const createProduct = async (req, res) => {
    try {
        const { image, name, description, price } = req.body;

        if (!image || !name || !description || price === undefined) {
            return res.status(400).json({
                message: "Image, name, description and price are required",
            });
        }

        const product = await productService.createProduct({
            image, name, description, price, owner: req.user.id,
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
       const products = await productService.getAllProducts();

       return res.status(200).json({products});
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product =
            await productService.getProductById(id);

        return res.status(200).json({
            product,
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            image,
            name,
            description,
            price,
        } = req.body;

        const updatedProduct =
            await productService.updateProduct(
                id,
                req.user.id,
                {
                    image,
                    name,
                    description,
                    price,
                }
            );

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await productService.deleteProduct(
            id,
            req.user.id
        );

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};


const getMyProducts = async (req, res) => {
    try {
        const products =
            await productService.getMyProducts(req.user.id);

        return res.status(200).json({
            products,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts,
};