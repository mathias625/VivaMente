const crypto = require("crypto");
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const getKey = () => {
    const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET;
    if (!secret) throw new Error("DATA_ENCRYPTION_KEY ou JWT_SECRET não configurado");
    return crypto.createHash("sha256").update(secret).digest();
}
;
const criptografar = (valor) => {
    if (valor === null || valor === undefined) return valor;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(String(valor), "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}
;
const descriptografar = (valor) => {
    if (!valor || typeof valor !== "string" || !valor.includes(":")) return valor;
    try {
        const [ivB64, tagB64, dataB64] = valor.split(":");
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, "base64"));
        decipher.setAuthTag(Buffer.from(tagB64, "base64"));
        return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf8");
    }  catch {
        return valor;
    }
}
;
module.exports = {
    criptografar, descriptografar
}
;
