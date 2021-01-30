const express = require('express')
const fs = require('fs')
const os = require('os')
const chokidar = require('chokidar')


const LOG_FILE = './sample.log'


const app = express()
app.use(express.static('public'))

// Single endpoint to be used as event source for server sent events
app.get('/watch', function(req, res) {
   watchFile(req, res)
})




function watchFile(req, res){



   let lastFileSize = fs.statSync(LOG_FILE).size
   const watcher = chokidar.watch(LOG_FILE)

   res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
   })

   res.write('\n')


   const fd = fs.openSync(LOG_FILE, 'r')

   // Reads whoel file to a buffer, convert buffer to string and split into lines
   // Slice last 10 lines of file and write one by one to client
   fs.read(fd, (err, bytes, buffer) => {
      const lines = buffer.toString().split(os.EOL).slice(-11, -1)
      lines.forEach((line, index, arr) => { 
         if (index < arr.length && line) {
            res.write(`data: ${line}\n\n`)
         }
      })
   })


   // Watches for changes on the specified file
   // Use fs.Stats to determine the byte size of the file on initial request
   // Compares current file size to previous file size to determine the required amount of bytes to read
   watcher.on('change', (path, stats) => {

      const sizeDiff = stats.size - lastFileSize
      if(sizeDiff <= 0){
         lastFileSize = stats.size
         return
      }


      const buffer = Buffer.alloc(sizeDiff)
      fs.read(fd, buffer, 0, sizeDiff, lastFileSize, (err, bytes, buffer) => {

         buffer.toString().split(os.EOL).forEach((line, index, arr) => {
            if (index < arr.length && line) {
               res.write(`data: ${line}\n\n`)
            }
         })
      })

      lastFileSize = stats.size
   })

}



app.listen(3000, () => console.log('Listening on port 3000!'))