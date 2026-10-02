const { verificarToken } = require("../utils/token");

module.exports=(req,res,next)=> {
    try {
        const h=req.headers.authorization;
        if (!h)return res.status(401).json( {
            mensagem:"Token não informado"
        }
        );
        const [b,t]=h.split(" ");
        if (b!=="Bearer"||!t)throw Error("Formato do token inválido");
        req.usuario=verificarToken(t);
        next()
    } catch (e) {
        res.status(401).json( {
            mensagem:e.message||"Token inválido ou expirado"
        }
        )
    }
};
