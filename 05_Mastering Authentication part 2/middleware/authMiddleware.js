import jwt from "jsonwebtoken"

const authMiddleware = (req, res, mext) => {
    const token = req.cookies.access_token;
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })   
     }

     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next()
     } catch (error) {
        console.log("JWT verification error:", error)
        return res.status(401).json({
            message: "Unauthrized in catch part"
        })
     }
}

export default authMiddleware;