
Node dev version: v12.18

To Run
- From this project root run  `npm install` to install dependencies
- Run `npm start` to start server
- On one or more browser tabs, navigate to localhost:3000/
   -- Expected to see last 10 lines of sample.log file
- In a separate terminal, run  `node testFileAppend.js` to append new random text lines to the log file
   -- Expected that in each connected browser tab the new lines will be pushed/appended to the current log lines 


Project potential caveats
- Developed and only tested on a Windows system. The file system API has some platform specifics and may not function the same on Linux/Mac
- Very limited error handling or attempts to reconnect from client if connection drops
- Browser used must support server sent events, IE doesn't 
- Only handles a hardcoded file residing within the project directory currently. No attempt made to deal with any file permission issues
