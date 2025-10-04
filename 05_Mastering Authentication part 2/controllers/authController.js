import jwt from "jsonwebtoken"
import  JwksClient  from "jwks-rsa"
import User from "../models/User.model.js"
import axios from "axios"

// create a JWKS client for Google's cretigicate endpoint
const getJwksClient = () => {}

// function to get the signing key for a given key ID
const getSigingKey = async (kid) => {};

//function to verify the ID token using the siging key
const verifyGoogleToken = async (token) => {};

// 1. Redirect to Google Login
const googleLogin = (req, res) => {};


// 2. Handle Google Callback and Exchange Code for Tokens
const googleCallback = async (req, res) => {};

// 3. get User Profile
const getProgile = async (req, res) => {};

//4. Logout User
const logout = (req, res) => {};
