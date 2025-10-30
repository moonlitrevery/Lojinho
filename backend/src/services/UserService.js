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

    if (userData.email && userData.email != userExists.email) {
      const emailExists = await UserModel.findByEmail(userData.email);
      if (emailExists) {
        throw new Error("Email já cadastrado");
      }
    }

    return await UserModel.update(userId, userData);
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
