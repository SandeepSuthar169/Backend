class ApiResponse {
    constructor(statusCode, date, messsage = "Success"){
        this.statusCode = statusCode;
        this.date = date
        this.messsage = messsage
        this.success = statusCode < 400
    }
}

export { ApiResponse };