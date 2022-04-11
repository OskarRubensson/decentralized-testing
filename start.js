const io = require("socket.io-client");
let socketClient = io("http://localhost:8000");

socketClient.on("connect", (socket) => {
  console.log("Connected to server");
  socketClient.emit("start");
  
});

socketClient.on("begin test", () => {
  process.exit(1);
})