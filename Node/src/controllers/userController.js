const User = require('../models/User');

const userController = {};

userController.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

userController.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

userController.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

userController.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

userController.login = async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const user = await User.findOne({ nome, senha });

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        res.status(200).json({ message: "Login bem-sucedido", user });
    } catch (error) {
        console.error("Erro durante a autenticação:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

module.exports = userController;
