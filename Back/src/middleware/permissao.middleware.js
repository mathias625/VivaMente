const permitir = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json( {
                mensagem: "Usuário não autenticado"
            }
            );
        }
        if (!tiposPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json( {
                mensagem: "Você não possui permissão para essa ação"
            }
            );
        }
        next();
    }
    ;
}
;
module.exports = permitir;
