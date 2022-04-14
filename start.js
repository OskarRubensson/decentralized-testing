const io = require("socket.io-client");
const writeJson = require("./server/fileWriter");
let socketClient = io("wss://decentralized-testing-server.herokuapp.com/");

socketClient.on("connect", () => {
  console.log("Connected to server");
  socketClient.emit("start");
});

socketClient.on("test complete", async (times) => {
  writeJson(times);
})