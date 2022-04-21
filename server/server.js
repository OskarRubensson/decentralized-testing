const express = require('express');
const http = require('http');
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
let sender;
const TESTROOM = 'tester';
const CLIENTROOM = 'client';
let runningTest = false;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    runningClients = runningClients.filter(id => id !== socket.id);
  });

  // Connect testers to their own room
  socket.on("tester connect", () => {
    socket.join(TESTROOM);
    console.log("User assigned as tester", `Currently ${io.sockets.adapter.rooms.get(TESTROOM).size} testers`);
  });
  
  // Connect clients to their own room
  socket.on("client connect", () => {
    socket.join(CLIENTROOM);
    console.log("User assigned as client", `Currently ${io.sockets.adapter.rooms.get(CLIENTROOM).size} clients`);
  });

  // Start test according to config
  socket.on('begin test', async config => {
    if (!config.protocol || !config.url || !config.name) {
      console.log("invalid config: ", config);
      return;
    }
    
    let testers = await io.in(TESTROOM).fetchSockets();
    config.amount > 0 ? testers = testers : testers = testers.slice(0, config.amount);

    console.log(`running test on ${testers.length} tester(s) with config: `, config);
    for (let tester of testers) {
      tester.emit('run test', config);
      runningTest = true;
    }
  })

  socket.on('client count', async () => {
    let clients = await io.in(TESTROOM).fetchSockets();
    socket.emit('client count', clients.length);
  })




  socket.on('start', () => {
    console.log("Starting tests...")
    runningClients = [];
    times = {};
    socket.broadcast.emit('begin test');
    sender = socket.id;
  })

  socket.on('starting test', () => {
    runningClients.push(socket.id);
    console.log(socket.id + " is starting test", "Currently running: " + runningClients.length);
  })

  socket.on('test complete', time => {
    appendTime(time);    

    runningClients = runningClients.filter(id => id !== socket.id);    
    console.log(socket.id + " finished test", runningClients.length ? "Currently running: " + runningClients.length : "No more running clients");

    if(runningClients.length === 0) {
      writeJson(times);
      if (io.sockets.sockets.get(sender)) {
        console.log("sending to start-instance that test is complete...");
        io.sockets.sockets.get(sender).emit('test complete', times);
      }else
        console.log("No start-instance to send to");
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