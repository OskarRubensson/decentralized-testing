const io = require("socket.io-client");
let socketClient = io("wss://decentralized-testing-server.herokuapp.com/");

socketClient.on("connect", () => {
  console.log("Connected to server");
  socketClient.emit("start");
  

});
socketClient.on("begin test", () => {
  process.exit(1);
})