import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const isLoggedIn  = async (req, res, next) => {
    console.log("toke here");
    
   try {
        //1.  get token from cookie
        //// const token = req.body.JwtToken      
        
        const accessToken = req.cookies.accessToken
        const refreshToken = req.cookies.refreshToken
        console.log(accessToken);
        
        //  if check user have access Token after thar direct login after toke create new & genreate new access token 
        // if check user don't hace access token after check refresh token. after the completion will make access token, refresh token. 
        // bouth are not. will make them. 
        if(!accessToken){
            // console.log("haha");
            
            if(!refreshToken){
                return res.status(401).json({
                    message: "Unathorized access",
                    success: false
                })
            }
            // refresh token is 
            const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
            console.log(refreshDecoded.id);

            const user = await User.findOne({_id: refreshDecoded.id})
            console.log(user.email);

            if(!user){
                return res.status(401).json({
                    message: "Unauthrized access"
                })
            }

            const newAccessToken = jwt.sign(
                { id: user._id}, 
                process.env.ACCESSTOKEN_SECRET,
                {expiresIn: process.env.ACCESSTOKEN_EXPIRY
            })
            
            const newRefreshToken = jwt.sign(
                { id: user._id}, 
                process.env.REFRESHTOKEN_SECRET,
                {expiresIn: process.env.REFRESHTOKEN_EXPIRY
            })

            user.refreshToken = newRefreshToken
            await user.save()
            
            const cookieOptons = {
                httpOnly: true
            };

            res.cookie("accessToken", newAccessToken, cookieOptons)
            res.cookie("refreshToken", newRefreshToken, cookieOptons)

            req.user = refreshDecoded
            next()



        
        } else {
            const accessDecoded = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET)
            
            const user = await User.findOne({_id: accessDecoded.id})
            
            if(!user){
                return res.status(401).json({
                    message:"unauthrized acces user"
                })
            }

            const newAccessToken = jwt.sign(
                { id: user._id}, 
                process.env.REFRESHTOKEN_SECRET,
                {expiresIn: process.env.ACCESSTOKEN_EXPIRY
            })
            
            const newRefreshToken = jwt.sign(
                { id: user._id}, 
                process.env.ACCESSTOKEN_SECRET,
                {expiresIn: process.env.REFRESHTOKEN_EXPIRY
            })

            user.refreshToken = newRefreshToken
            await user.save()
            
            const cookieOptons = {
                httpOnly: true
            };

            
            res.cookie("accessToken", newAccessToken, cookieOptons)
            res.cookie("refreshToken", newRefreshToken, cookieOptons)

            req.user = refreshDecoded
            next()

        }
        
     
       


    } catch (error) {
        return res.status(500).json({
            message: "Invalid or Internal server error. ",
            success: false
        })
    }

}

export default isLoggedIn