//1. ---------------------------------------------------------------
// const fs  = require('fs')

// setTimeout(() => console.log("set Timeout"), 0)   // 2

// setImmediate(() => console.log('set Immediate'))   // 3

// console.log();  //1 


// 2. ---------------------------------------------------------------

// setTimeout(() => console.log("set Timeout"), 0)   // 2

// setImmediate(() => console.log('set Immediate'))   // 1



// 3. ______________________________________________________________

// const fs  = require('fs')

// setTimeout(() => console.log("set Timeout"), 0)   // 2

// setImmediate(() => console.log('set Immediate'))   // 3

// fs.readFile('sample.txt', 'utf-8', function(err, data){
//     setTimeout(() => console.log('set TimeOut inSide fs'), 0) // 5
//     setImmediate(() => console.log("innedate inside fs - 1"))  // 4
// })

// console.log("hello"); //1 
  


//4. ______________________________________________________________



const fs  = require('fs')  //1
const crypto = require('crypto') //1

setTimeout(() => console.log("set Timeout"), 0)   //2
setImmediate(() => console.log('set Immediate'))   //3

fs.readFile('sample.txt', 'utf-8', function(err, data){
    setTimeout(() => console.log('set TimeOut inSide fs'), 0) //5
    setImmediate(() => console.log("innedate inside fs - 1"))  //4

    const start = Date.now();

    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 1`)  //6
    })
    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 2`)  //7
    })
    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 3`)  //8
    })
    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 4`)  //9
    })
    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 5`)  // 10
    })
    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 6`)  //11
    })
    crypto.pbkdf2('password', 'salt1', 100000, 1012, 'sha512', (err, data) => {
        console.log(`[${Date.now()- start}ms]: Password 7`)  //12
    })
})

console.log("hello"); //1


