const loginService = require("../services/login.services");

const validarLogin = async (req, res) => {
    try {
        const {
            email,
            senha,
            tipo
        } = req.body;

        if (!email || !senha || !tipo) {
            return res.status(400).json({
                mensagem: "Email, senha e tipo são obrigatórios"
            });
        }

        const resultado = await loginService.validarLogin(
            email,
            senha,
            tipo
        );

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(401).json({
            mensagem: error.message
        });
    }
};

module.exports = {
    validarLogin
};
