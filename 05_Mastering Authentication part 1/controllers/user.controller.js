import User from "../models/user.model.js"

const register = async (req, res) => {

    //1. get user data from req body
    const { name, email, password } = req.body

    //2. validate data
    if(!name || !email || !password){
        res.status(400).json({
            message: "user is not  exites"
        })
    }
    //3. password check
}

export {register}