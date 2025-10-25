const CategoryService = require("../services/CategoryService");

class CategoryController {
    async create(req, res) {
        try {
            const category = await CategoryService.createCategory(req.body);
            
            res.status(201).json({
                success: true,
                data: category,
                message: "Categoria criada com sucesso"
            });
        } catch (error) {
            console.error("Error in CategoryController.create:", error);

            if (error.message.includes("obrigatório") ||
                error.message.includes("já existe")) {
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
            const categories = await CategoryService.getAllCategories();

            res.json({
                success: true,
                data: categories,
                count: categories.length
            });
        } catch (error) {
            console.error("Error in CategoryController.findAll", error);
            res.status(500).json({
                success: false,
                error: "Erro ao buscar categorias"
            });
        }
    }

    async findById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            if (error.message === "Categoria não encontrada") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao buscar categoria"
            });
        }
    }

    async update(req, res) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);

            res.json({
                success: true,
                data: category,
                message: "Categoria atualizada com sucesso"
            });
        } catch (error) {
            if (error.message === "Categoria não encontrada") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes("já existe")) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao atualizar categoria"
            });
        }
    }

    async delete(req, res) {
        try {
            const result = await CategoryService.deleteCategory(req.params.id);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message === "Categoria não encontrada") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao excluir categoria"
            });
        }
    }
}

module.exports = new CategoryController();