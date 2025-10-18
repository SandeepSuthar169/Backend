import { ApiResponse } from "../utils/api-response.js"


const helthCheck = (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {message: "Server is running"})
    )
}


export { helthCheck }