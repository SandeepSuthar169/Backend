import jwt from "jsonwebtoken"
import  JwksClient  from "jwks-rsa"
import User from "../models/User.model.js"
import axios from "axios"
import { generateState, generateNonce } from "../utils/authUtils.js"

// create a JWKS client for Google's cretigicate endpoint
const getJwksClient = () => {
    return JwksClient({
        jwksUri: process.env.GOOGLE_JWKS_URL,
        cache: true,
        rateLimit: true
    })
};

// function to get the signing key for a given key ID
const getSigingKey = async (kid) => {
    const client = getJwksClient();
    return new Promise((resolve, reject) => {
        client.getSigningKey((kid, (err, key) => {
            if(err) {
                return reject(err);
            }
            const signingKey = key.getPubllicKey()
            resolve(signingKey)           
        }))
    })
};

//function to verify the ID token using the siging key
const verifyGoogleToken = async (token) => {
    try {
        const decoded = jwt.decode(token, {complete: true});
            if(!decoded){
                throw new Error("Invalid error")
            }
        

        const kid = decoded.header.kid;
        const SigningKey = await getSigingKey(kid)

        const verificationToken = jwt.verify(token, SigningKey, {
            algorithms: ["RS256"],
            audience: process.env.CLIENT_ID
        })

        return verificationToken
        
    } catch (error) {
        throw new Error("token verify faild")
    }
}

// 1. Redirect to Google Login
const googleLogin = (req, res) => {
    const state = generateState()
    const nonce = generateNonce();

    res.cookies('oath_state', state, {
        httpOnly: true,
        maxAge: 1000 * 60,
    });

    res.cookies("oauth", nonce, {
        httpOnly: true,
        maxAge: 1000 * 60
    });

    const googleAuthUrl = `http://accounts.google.com/0/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_url=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=email%20profile%20openid&state=${state}&nonce=${nonce}`
    
    res.redirect(googleAuthUrl)
};


// 2. Handle Google Callback and Exchange Code for Tokens
const googleCallback = async (req, res) => {};

// 3. get User Profile
const getProfile = async (req, res) => {};

//4. Logout User
const logout = (req, res) => {};


export { googleLogin, googleCallback, getProfile, logout }