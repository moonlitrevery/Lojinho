const ProductModel = require('../models/ProductModel');

class ProductService {
    async createProduct(productData) {
        if (!productData.name || !productData.price) {
            throw new Error ("Nome e preço são obrigatórios");
        }

        if (productData.price < 0) {
            throw new Error ("O preço não pode ser negativo");
        }

        const product = await ProductModel.create(productData);
        return product;
    }

    async getAllProducts() {
        return await ProductModel.findAll();
    }

    async getProductById(productId) {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error("Produto não encontrado");
        }
        return product;
    }

    async updateProduct(productId, productData) {
        const productExists = await ProductModel.findById(productId);
        if (!productExists) {
            throw new Error("Produto não encontrado");
        }

        if (productData.price && productData.price < 0) {
            throw new Error("O preço não pode ser negativo");
        }

        return await ProductModel.update(productId, productData);
    }

    async deleteProduct(productId) {
        const productExists = await ProductModel.findById(productId);
        if (!productExists) {
            throw new Error("Produto não encontrado");
        }

        const deleted = await ProductModel.delete(productId);
        if (!deleted) {
            throw new Error("Falha ao excluir produto");
        }

        return {message: "Produto excluído com sucesso"};
    }

}

module.exports = new ProductService();
