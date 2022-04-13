const io = require("socket.io-client");
const fileWriter = require("./server/fileWriter");
let socketClient = io("wss://decentralized-testing-server.herokuapp.com/");

socketClient.on("connect", () => {
  console.log("Connected to server");
  socketClient.emit("start");
});

socketClient.on("test complete", (times) => {
  fileWriter.writeJson(times);
  process.exit(1);
})