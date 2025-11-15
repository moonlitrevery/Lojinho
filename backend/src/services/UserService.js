const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

class UserService {
  async createUser(userData) {
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    if (userData.password.length < 6) {
      throw new Error("A senha precisa ter pelo menos 6 caracteres");
    }

    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    const password_hash = await bcrypt.hash(userData.password, 12);

    const user = await UserModel.create({
      username: userData.username,
      email: userData.email,
      password_hash: password_hash,
    });

    return user;
  }

  async getAllUsers() {
    return await UserModel.findAll();
  }

  async getUserById(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  }

  async updateUser(userId, userData) {
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    const updateData = {};

    // Verifica nome
    if (userData.username !== undefined) {
      if (!userData.username.trim()) {
        throw new Error("Nome de usuário não pode estar vázio");
      }
      updateData.username = userData.username;
    }

    // Verifica email
    if (userData.email !== undefined) {
      if (!userData.email.trim()) {
        throw new Error("Email não pode estar vázio");
      }

      if (userData.email !== userExists.email) {
        const emailExists = await UserModel.findByEmail(userData.email);
        if (emailExists) {
          throw new Error("Email já está em uso");
        }
      }
      updateData.email = userData.email;
    }

    // Verifica senha
    if (userData.password !== undefined) {
      if (userData.password.length<6) {
        throw new Error("A senha precisa ter pelo menos 6 caracteres");
      }
      updateData.password_hash = await bcrypt.hash(userData.password, 12);
    }

    // Verifica se tem algo pra atualizar
    if (Object.keys(updateData).length === 0) {
      throw new Error("Nenhum dado válido fornecido para atualização")
    }

    return await UserModel.update(userId, updateData);
  }

  async deleteUser(userId) {
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    const deleted = await UserModel.delete(userId);
    if (!deleted) {
      throw new Error("Falha ao excluir usuário");
    }

    return { message: "Usuário excluído com sucesso" };
  }

  async validateUserCredentials(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error("Credenciais inválidas");
    }

    const { password_hash, ...userWithoutPassowrd } = user;
    return userWithoutPassowrd;
  }
}

module.exports = new UserService();
