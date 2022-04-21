const io = require("socket.io-client");
let socketClient = io("http://host.docker.internal:8000");
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
  testSite(config.name, config.url).then(time => {
    socketClient.emit("test complete", {...config, time});
  }).catch(() => socketClient.emit("test failed"));
});