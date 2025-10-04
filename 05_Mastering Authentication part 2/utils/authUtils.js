import crypto from "crypto";

export const generateState = () => {
    return crypto.randomBytes(32).toString('hex')
}


export const generateNonce = () => {
    return crypto.randomBytes(32).toString('hex')
}