const fs = require('fs')

fs.writeFile('./text.txt', "hey sandeep", () => {})

console.log({
    __filename,    // __filename: 'S:\\01_Web-Dec Cohot\\NODE\\04_The_Backend_Internals\\index.js',
    __dirname      // __dirname: 'S:\\01_Web-Dec Cohot\\NODE\\04_The_Backend_Internals'      
});
