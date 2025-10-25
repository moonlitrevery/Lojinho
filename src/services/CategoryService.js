const CategoryModel = require('../models/CategoryModel');

class CategoryService {
    async createCategory(categoryData) {
        if (!categoryData.category_name) {
            throw new Error("Nome da categoria é obrigatório");
        }

        const exists = await CategoryModel.categoryExists(categoryData.category_name);
        if (exists) {
            throw new Error("Já existe uma categoria com esse nome");
        }

        const category = await CategoryModel.create(categoryData);
        return category;
    }

    async getAllCategories() {
        return await CategoryModel.findAll();
    }

    async getCategoryById(categoryId) {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            throw new Error("Categoria não encontrada");
        }
        return category;
    }

    async updateCategory(categoryId, categoryData) {
        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
            throw new Error("Categoria não encontrada");
        }

        if (categoryData.category_name && categoryData.category_name !== categoryExists.category_name) {
            const exists = await CategoryModel.categoryExists(categoryData.category_name);
            if (exists) {
                throw new Error("Já existe uma categoria com esse nome");
            }
        }

        return await CategoryModel.update(categoryId, categoryData);
    }

    async deleteCategory(categoryId) {
        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
            throw new Error("Categoria não encontrada");
        }

        const deleted = await CategoryModel.delete(categoryId);
        if (!deleted) {
            throw new Error("Falha ao excluir categoria");
        }

        return { message: "Categoria excluída com sucesso" };
    }
}

module.exports = new CategoryService();