const ProductService = require("../services/ProductService");

class ProductController {
    async create(req, res) {
        try {
            const product = await ProductService.createProduct(req.body);
            
            res.status(201).json({
                success: true,
                data: product,
                message: "Produto criado com sucesso"
            });
        } catch (error) {
            console.error("Error in ProductController.create:", error);

            if (error.message.includes("obrigatórios") ||
                error.message.includes("negativo")) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }

                res.status(500).json({
                    success: false,
                    error: "Erro interno no servidor"
                });
        }
    }

    async findAll(req, res) {
        try {
            const product = await ProductService.getAllProducts();

            res.json({
                success: true,
                data: product,
                count: product.length
            });
        } catch (error) {
            console.error("Error in ProductController.findAll", error);
            res.status(500).json({
                success: false,
                error: "Erro ao buscar produtos"
            });
        }
    }

    async findById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            if (error.message === "Produto não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao buscar produto"
            });
        }
    }

    async update(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);

            res.json({
                success: true,
                data: product,
                message: "Produto atualizado com successo"
            });
        } catch (error) {
            if (error.message === "Produto não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes("negativo")) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                errro: "Erro ao atualizar Produto"
            });
        }
    }

    async delete(req, res) {
        try {
            const result = await ProductService.deleteProduct(req.params.id);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message === "Produto não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao excluir produto"
            });
        }
    }

}

module.exports = new ProductController();
