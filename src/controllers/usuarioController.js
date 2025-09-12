import UsuarioModel from "../models/usuarioModel.js";

export const addUsuario = async (req, res) => {

    const { email, senha } = req.body;

    try {

        const usuario = new UsuarioModel({ email, senha });

        await usuario.save();

        return res.status(201).json(usuario);

    } catch (error) {

        return res.status(500).json({ error: 'Erro ao adicionar usuário', details: error.message });

    }
}   

export const retornarUsuarios = async (req, res) => {

    try {

        const usuarios = await UsuarioModel.find();

        res.json(usuarios);

    } catch (error) {

        res.status(500).json({ erro: "Erro ao buscar usuários", detalhes: error.message });
    }
}

export const validarUsuario = async (req, res) => {

    const { email, senha } = req.body;

    try {

        const usuario = await UsuarioModel.findOne({ email, senha });

        if (usuario) {

            return res.json({ valido: true })

        } else {

            return res.json({ valido: false })

        }

    } catch (error) {

        res.status(500).json({ erro: "Erro ao validar usuários", detalhes: error.message });     
    }   

}

