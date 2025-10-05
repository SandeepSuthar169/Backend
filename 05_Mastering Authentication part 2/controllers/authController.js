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

    res.cookie('oath_state', state, {
        httpOnly: true,
        maxAge: 1000 * 600,
    });

    res.cookie("oauth", nonce, {
        httpOnly: true,
        maxAge: 1000 * 600
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20email%20profile&state=${state}&nonce=${nonce}`;
    
    res.redirect(googleAuthUrl)
};


// 2. Handle Google Callback and Exchange Code for Tokens
const googleCallback = async (req, res) => {
    try {
        const { code, state } = req.body
        const savedState = req.cookies.oauth_state;
        const savedNonce = req.cookies.oauth_nonce;

        res.clearCookie("oauth_state");
        res.clearCookie("oauth_nonce");

        if(!state || !savedState || state !== savedState){
            return res.status(401).json({
                message: "Invalid state"
            })
        }

        //exchange code for goole tokens
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            null,
            {
                params: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
                    code,
                    grant_type: "authorization_code"
                },
            }
        )

        const { id_token, refresh_token } = tokenResponse.data;
        if(!id_token){
            return res.status(401).json({
                message: "Invalid id token"
            })
        }

        // verify id token
    const decodedToken = await verifyGoogleToken(id_token);

    // check if nonce matches the one stored in cookie
    if(!decodedToken.nonce || decodedToken.nonce !== savedNonce) {
         return res.status(401).json({ message: "invalid nonce parametr" })
    }

    //find or create the user in the db
    let user = await User.findOne({ googleId: decodedToken.sub })
    if (!user) {
        user = await User.create({
            googleId: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name,
            refreshToken: refresh_token || null
        })
    } else if (refresh_token) {
        //update refresh token if it is changes
        user.refreshToken = refresh_token;
        await user.save()
    }
    // Generate own JWT  token for user
    const accessToken = jwt.sign({
        userID: user._id, email: user.email
    }, process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    })

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 3600000
    })

    res.status(201).json({
        message: "Lonin Successfull",
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        }
    })
    } catch (error) {
        return res.status(400).json({ message: "Authentication failed" })
    }
};

// 3. get User Profile
const getProfile = async (req, res) => {};

//4. Logout User
const logout = (req, res) => {};


export { googleLogin, googleCallback, getProfile, logout }