const io = require("socket.io-client");
let socketClient = io("http://localhost:8000");
let runTest = require("./test");

socketClient.on("connect", () => {
  console.log("Connected to server");
});

socketClient.on("disconnect", () => {
  console.log("Disconnected from server");
});

socketClient.on("begin test", () => {
  socketClient.emit("starting test");
  runTest().then(times => { console.log(times); socketClient.emit("test complete", times)});
});