const express = require('express');
const http = require('http');
const writeJson = require('./fileWriter');

const app = express();
const server = http.createServer(app);
console.log(process.env.NODE_ENV === 'production' ? 'Running on production' : 'Running in development');

const socket = require('socket.io');
const { SocketAddress } = require('net');

const io = socket(server, {
	cors: {
		methods: ['GET', 'POST']
	}
});

let times = {};
const TESTROOM = 'tester';
const CLIENTROOM = 'client';
const RUNNINGTESTER = 'running testers';
const SEEDERROOM = 'seeder';
let runningTest = false;
let initSeeders = true;
let testQueue = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (runningTest)
      handleTestDone();
  });

  // Connect testers to their own room
  socket.on("tester connect", () => {
    socket.join(TESTROOM);
    console.log("User assigned as tester", `Currently ${io.sockets.adapter.rooms.get(TESTROOM)?.size | 0} testers`);
    io.in(CLIENTROOM).emit("tester count", io.sockets.adapter.rooms.get(TESTROOM)?.size | 0);
  });
  
  // Connect clients to their own room
  socket.on("client connect", () => {
    socket.join(CLIENTROOM);
    console.log("User assigned as client", `Currently ${io.sockets.adapter.rooms.get(CLIENTROOM).size | 0} clients`);
    socket.emit('tester count', io.sockets.adapter.rooms.get(TESTROOM)?.size | 0);
    socket.emit('test started', io.sockets.adapter.rooms.get(RUNNINGTESTER)?.size | 0);
    socket.emit('test complete', times);
  });

  socket.on("seeder connect", () => {
    socket.join(SEEDERROOM);
    console.log("User assigned as seeder", `Currently ${io.sockets.adapter.rooms.get(SEEDERROOM).size | 0} seeder`);
  })

  socket.on("seeder config", (config) => {
    console.log("Seeder config received", config);
    initSeeders = true;
    io.in(SEEDERROOM).emit("init seeders", config);
  })

  socket.on("seeders initialized", () => {
    console.log("Seeders initialized");
    initSeeders = false;
    if (testQueue.length > 0) {
      beginTest(testQueue.shift());
    }
  })

  // Start test according to config
  socket.on('begin test', config => beginTest(config));

  socket.on('test failed', () => {
    console.log("Tester failed");
    socket.leave(RUNNINGTESTER);
    handleTestDone();
  })

  socket.on('test complete', result => {
    console.log("Tester completed test");
    socket.leave(RUNNINGTESTER);
    appendTime(result);
    handleTestDone();
  })

  socket.on('clear result', () => {
    console.log("Result was cleared");
    times = {};
  });

  const beginTest = async config => {
    if (!config.protocol || !config.url || !config.name) {
      console.log("invalid config: ", config);
      return;
    }

    if (runningTest) {
      console.log("Test already running, putting in queue");
      testQueue.push(config);
      return;
    }
    
    let testers = await io.in(TESTROOM).fetchSockets();
    config.amount <= 0 ? testers = testers : testers = testers.slice(0, config.amount);

    console.log(`running test on ${testers.length} tester(s) with config: `, config);

    io.in(CLIENTROOM).emit('test started', testers.length);
    for (let tester of testers) {
      tester.emit('run test', config);
      tester.join(RUNNINGTESTER);
      runningTest = true;
    }
  } 

  const handleTestDone = async () => {
    let runningClients = await io.in(RUNNINGTESTER).fetchSockets();
    socket.to(CLIENTROOM).emit('tester completed', runningClients.length);
    console.log("Currently running testers: ", runningClients.length);
    if (runningClients.length === 0) {
      console.log("All testers have completed their tests");
      io.in(CLIENTROOM).emit('test complete', times);
      writeJson(times);
      runningTest = false;
      
      if (testQueue.length > 0) {
        console.log("Running next test in queue");
        let config = testQueue.shift();
        beginTest(config);
      }
    }
  }
})

function appendTime(result) {
  let protocol = result.protocol;
  let name = result.name;
  let time = result.time;

  if (times[protocol] === undefined)
    times[protocol] = {};
  if (times[protocol][name] === undefined)
    times[protocol][name] = [ time ];
  else
    times[protocol][name].push(time);
}

server.listen(process.env.PORT || 8000, '0.0.0.0', () => console.log(`server is running on port ${process.env.PORT || 8000}`));