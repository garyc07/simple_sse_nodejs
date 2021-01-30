const fs = require('fs')
const os = require('os')

function log(){
   fs.appendFileSync("sample.log", " - " + Math.random().toString(36).substring(2) + os.EOL)
}

setInterval(log, 1000)