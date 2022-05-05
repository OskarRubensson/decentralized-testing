const io = require("socket.io-client");
let socketClient = io(process.env.SERVER_IP || "http://localhost:8000"); 
// For docker container locally: http://host.docker.internal:8000 
// For AWS EC2 instance: ws://ec2-16-170-211-57.eu-north-1.compute.amazonaws.com:8000
// For Heroku: wss://decentralized-testing-server.herokuapp.com/
let testSite = require("./test");

socketClient.on("connect", () => {
  console.log("Connected to server");
  socketClient.emit("tester connect");
});

socketClient.on("disconnect", () => {
  console.log("Disconnected from server");
});

socketClient.on("run test", (config) => {
  socketClient.emit("starting test");
  console.log("Starting test with config: ", config)
  testSite(config.name, config.url).then(time => {
    socketClient.emit("test complete", {protocol: config.protocol, name: config.name, time});
  }).catch(err => {
    console.log("Test failed:", err)
    socketClient.emit("test failed")
  
  });
});