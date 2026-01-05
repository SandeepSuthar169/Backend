const fs = require("fs")  // 2
const crypto = require("crypto")

let start = Date.now()
process.env.UV_THREADPOOL_SIZE = 1   

setTimeout(() => console.log("hello from Timer 0"), 0)  // 3

setImmediate(() => console.log("heeeeeeeee")) // 5

fs.readFile("txt.txt", "utf-8", () => {
    console.log("IO polling end");    // 4

    setTimeout(() => console.log("hello from Timer 1"), 0)  // 5
    setTimeout(() => console.log("hello from Timer 2"), 5 * 1000)  // 6

    crypto.pbkdf2("password1", "slt1", 5000, 1024, "sha512", () => {
        console.log(`${Date.now() - start}`,"password 1 Dome");
        
    })

    crypto.pbkdf2("password2", "slt1", 5000, 1024, "sha512", () => {
        console.log(`${Date.now() - start}`,"password 2 Dome");
        
    })

    crypto.pbkdf2("password3", "slt1", 5000, 1024, "sha512", () => {
        console.log(`${Date.now() - start}`,"password 3 Dome");
        
    })
    
    crypto.pbkdf2("password4", "slt1", 5000, 1024, "sha512", () => {
        console.log(`${Date.now() - start}`,"password 4 Dome");
        
    })
    
    crypto.pbkdf2("password5", "slt1", 5000, 1024, "sha512", () => {
        console.log(`${Date.now() - start}`,"password 5 Dome");
        
    })



})

console.log("Hello from top level code "); // 1
