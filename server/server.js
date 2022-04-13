const express = require('express');
const http = require('https');
const writeJson = require('./fileWriter');

const app = express();
const server = http.createServer(app);
console.log(process.env.NODE_ENV === 'production' ? 'Running on production' : 'Running in development');

const socket = require('socket.io');

const io = socket(server, {
	cors: {
		methods: ['GET', 'POST']
	}
});

let runningClients = [];
let times = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('start', () => {
    console.log("Starting tests...")
    times = {};
    socket.broadcast.emit('begin test');
  })

  socket.on('starting test', () => {
    runningClients.push(socket.id);
    console.log(socket.id + " is starting test", "Currently running: " + runningClients.length);
  })

  socket.on('test complete', time => {
    appendTime(time);    
    
    console.log(socket.id + " finished test", "Currently running: " + runningClients.length);

    runningClients = runningClients.filter(id => id !== socket.id);
    if(runningClients.length === 0) {
      writeJson(times);
    }
  })
})

function appendTime(time) {
  if (times.length === 0)
    times = time;
  else {
    for (let protocol in time) {
      for (let key in time[protocol]) {
        if (times[protocol] === undefined)
          times[protocol] = {};
        if (times[protocol][key] === undefined)
          times[protocol][key] = [ time[protocol][key] ];
        else
          times[protocol][key].push(time[protocol][key]);
      }
    }
  }
}

server.listen(process.env.PORT || 8000, () => console.log(`server is running on port ${process.env.PORT || 8000}`));