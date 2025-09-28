const fs = require('fs')
const math  = require('./math.js')  // import math  
                                    // start ./path is to find code another code files
                                    // start path is to fild our file code 


fs.writeFile('./text.txt', "hey sandeep", () => {})

console.log({
    exports,          // exports: {}
    require,
    module,
    __filename,      // __filename: 'S:\\01_Web-Dec Cohot\\NODE\\04_The_Backend_Internals\\index.js',
    __dirname,       // __dirname: 'S:\\01_Web-Dec Cohot\\NODE\\04_The_Backend_Internals'      
});

console.log(math);      // {}

console.log(math.add(2,3));  // 5

 