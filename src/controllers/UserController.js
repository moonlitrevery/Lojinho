const UserService = require("../services/UserService");

class UserController {
    async create(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            
            res.status(201).json({
                success: true,
                data: user,
                message: "Usuário criado com sucesso"
            });
        } catch (error) {
            console.error("Error in UserController.create:", error);

            if (error.message.includes("obrigatórios") ||
                error.message.includse("já cadastrado") ||
                error.message.includes("Senha deve ser")) {
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
            const users = await UserService.getAllUsers();

            res.json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error) {
            console.error("Error in UserController.index", error);
            res.status(500).json({
                success: false,
                error: "Erro ao buscar usuário"
            });
        }
    }

    async findById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error.message === "Usuário não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao buscar usuário"
            });
        }
    }

    async update(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);

            res.json({
                success: true,
                data: user,
                message: "Usuário atualizado com successo"
            });
        } catch (error) {
            if (error.message === "Usuário não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes("já está em uso")) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                errro: "Erro ao atualizar usuário"
            });
        }
    }

    async delete(req, res) {
        try {
            const result = await UserService.deleteUser(req.params.id);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message === "Usuário não encontrado") {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: "Erro ao excluir usuário"
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.validateUserCredentials(email, password);

            res.json({
                success: true,
                data: user,
                message: "Login realizado com sucesso"
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                error: err.message
            });
        }
    }
}

module.exports = new UserController();
