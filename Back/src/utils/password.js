const crypto=require("crypto");
const hashPassword=s=> {
    const salt=crypto.randomBytes(16).toString("hex");
    return `scrypt:${salt}:${crypto.scryptSync(s,salt,64).toString("hex")}`
}
;
const comparePassword=(s,h)=> {
    try {
        const [a,salt,hex]=String(h).split(":");
        if (a!=="scrypt")return false;
        return crypto.timingSafeEqual(crypto.scryptSync(s,salt,64),Buffer.from(hex,"hex"))
    } catch {
        return false
    }
}
;
module.exports= {
    hashPassword,comparePassword
}
;
