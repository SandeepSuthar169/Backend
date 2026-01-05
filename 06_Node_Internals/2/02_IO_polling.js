const fs = require("fs")  // 2

setTimeout(() => console.log("hello from Timer 0"), 0)  // 3

setImmediate(() => console.log("heeeeeeeee")) // 5

fs.readFile("txt.txt", "utf-8", () => {
    console.log("IO polling end");    // 4

    setImmediate(() => console.log("heeeeeeeee 2 ")) // 5
    setTimeout(() => console.log("hello from Timer 1"), 0)  // 5
    setTimeout(() => console.log("hello from Timer 2"), 5 * 1000)  // 6


})

console.log("Hello from top level code "); // 1
