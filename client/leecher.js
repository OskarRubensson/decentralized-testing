const io = require("socket.io-client");
let socketClient = io(process.env.SERVER_IP || "http://localhost:8000");

var Docker = require("dockerode");
var docker = new Docker();
// For docker container locally: http://host.docker.internal:8000 
// For AWS EC2 instance: ws://ec2-13-48-57-141.eu-north-1.compute.amazonaws.com:8000
// For Heroku: wss://decentralized-testing-server.herokuapp.com/

const maxContainers = 1000;
const IMAGE_NAME = 'toastaren/decentralizedtesting';
const CONTAINER_NAME_PREFIX = 'dt';
let containers = []

socketClient.on("connect", () => {
  console.log("Connected to server");
  socketClient.emit("leecher connect");
});

socketClient.on("disconnect", () => {
  console.log("Disconnected from server");
});


socketClient.on("init leechers", async (n) => {
  console.log('new config recieved... clearing all containers');
  await clearContainers().then(() => containers = []);

  console.log(`Initializing ${n > maxContainers ? maxContainers : n} leechers...`);

  // Create amount-number of instances
  for (let i = 0; i < n && i < maxContainers; i++) {
    docker.createContainer({
      Image: IMAGE_NAME,
      name: `${CONTAINER_NAME_PREFIX}-${i}`,
      HostConfig: {
        ExtraHosts: ["host.docker.internal:host-gateway"],
        Ulimits: [{ Name: "nofile", Soft: 65536, Hard: 65536 }],
        Privileged: true
      }
    }).then(container => {
      containers.push(container);
      return container.start();
    })
  }

  console.log(`\n${n} leecher(s) initialized`);
  socketClient.emit("leechers initialized");
});

function clearContainers() {
  return Promise.allSettled(
    containers.map(container => docker.getContainer(container.id).remove({ force: true }))
  )
}