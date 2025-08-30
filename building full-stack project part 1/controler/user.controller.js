const registerUser = async (req, res) => {
    // get data
    // validate
    // check if user already exists
    // crete a carifiacation token
    // save token in dataBase
    // send taken as emil to user
    // send success status to user

    const {name, email, password} = req.body
    if (!name || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        });
    };
    console.log(email);
    
};


export {registerUser}
