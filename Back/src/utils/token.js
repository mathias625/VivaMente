const crypto=require("crypto");
const b=o=>Buffer.from(JSON.stringify(o)).toString("base64url");
const key=()=>process.env.JWT_SECRET||"dev-secret-change-me";
const criarToken=(p,e="1d")=> {
    const h=b( {
        alg:"HS256",typ:"JWT"
    }
    ),exp=Math.floor(Date.now()/1000)+(e.endsWith("h")?+e.slice(0,-1)*3600:e.endsWith("d")?+e.slice(0,-1)*86400:86400),body=b( {
        ...p,iat:Math.floor(Date.now()/1000),exp
    }
    ),d=h+"."+body,s=crypto.createHmac("sha256",key()).update(d).digest("base64url");
    return d+"."+s
}
;
const verificarToken=t=> {
    const [h,p,s]=String(t).split("."),d=h+"."+p,exp=crypto.createHmac("sha256",key()).update(d).digest("base64url");
    if (!h||!p||!s||!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(exp)))throw Error("Token inválido");
    const x=JSON.parse(Buffer.from(p,"base64url"));
    if (x.exp<Date.now()/1000)throw Error("Token expirado");
    return x
}
;
module.exports= {
    criarToken,verificarToken
}
;
