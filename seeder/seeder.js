const io = require("socket.io-client");
let socketClient = io("http://localhost:8000");

var Docker = require("dockerode");
var docker = new Docker();
// For docker container locally: http://host.docker.internal:8000 
// For AWS EC2 instance: ws://ec2-16-170-254-219.eu-north-1.compute.amazonaws.com:8000
// For Heroku: wss://decentralized-testing-server.herokuapp.com/
let containers = [];
const maxContainers = 5;

socketClient.on("connect", () => {
  console.log("Connected to server");
  socketClient.emit("seeder connect");
});

socketClient.on("disconnect", () => {
  console.log("Disconnected from server");
});

// const config = {
//   IPFS: {
//     QmbSS9Ax34p3K65KqtxA3SAzAQRDN3qPwNsQg3YyUGW8nA: 5
//   }
// }

socketClient.on("init seeders", async (config) => {
  console.log('new config recieved... clearing all containers');
  await clearContainers();

  for (let protocol in config) {
    await initProtocolSeeder(protocol, config[protocol])
  }

  console.log("\nSeeders initialized with config: \n", config);
  socketClient.emit("seeders initialized");
});

async function initProtocolSeeder(protocol, config) {
  console.log(`Initializing ${protocol} seeders...`);
  if (protocol != "ipfs" && protocol != "hyper")
    return false;

  let seedCmd = protocol === 'ipfs' ? 'ipfs pin add' : '/usr/local/bin/node /cli/bin/hyp seed';

  // Find max amount of instances needed
  let amount = 0;
  for (let key in config) {
    amount = config[key] > amount ? amount = config[key] : amount;
  }

  // Create amount-number of instances
  for (let i = 0; i < amount && i < maxContainers; i++) {
    await createContainer(protocol, i).then(container => {
      containers.push(container);
      return container.start();
    })
  }

  // Start all containers
  //for (let container of containers) {
    //console.log("hej");
  //}

  // Give daemon time to start
  setTimeout(() => {

    // Pin hash according to the config
    for (let key in config) {
      let desiredPins = config[key];
      
      for (let i = 0; i < desiredPins; i++) {
        let container = containers[i];
        let cmd = `${seedCmd} ${key}`;
        runExec(container, cmd);
      }
    }
  }, 10000)
}

function createContainer(protocol, index) {
  let image = protocol == "ipfs" ? "ipfs/go-ipfs" : "toastaren/hypercore-cli:latest";
  return docker.createContainer({
    Image: image,
    name: `${protocol}-${index}`
  });
}

function clearContainers() {
  return new Promise(async (resolve, reject) => {
    docker.listContainers({ all: true }, async (err, cons) => {
      if (err)
        reject();
      else {
        for (let containerInfo in cons) {
          await docker.getContainer(containerInfo.Id).remove({ force: true });
        }
        resolve();
      }
    });
  });
}

/**
 * Get env list from running container
 * @param container
 */
function runExec(container, cmd) {

  var options = {
    Cmd: ["sh", "-c", cmd],
    AttachStdout: true,
    AttachStderr: true
  };

  container.exec(options, function (err, exec) {
    if (err) return;
    exec.start(function (err, stream) {
      if (err) {
        console.log("error : " + err);
        return;
      }

      container.modem.demuxStream(stream, process.stdout, process.stderr);
      exec.inspect(function (err, data) {
        if (err) {
          console.log("error : " + err);
          return;
        }
      });
    });
  });
}