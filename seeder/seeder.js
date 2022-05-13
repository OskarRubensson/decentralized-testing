const io = require("socket.io-client");
require("dotenv").config({ path: __dirname + "/../.env" });
let socketClient = io(process.env.SERVER_IP || "http://localhost:8000");

var Docker = require("dockerode");
var docker = new Docker();
// For docker container locally: http://host.docker.internal:8000 
// For AWS EC2 instance: ws://ec2-13-48-57-141.eu-north-1.compute.amazonaws.com:8000
// For Heroku: wss://decentralized-testing-server.herokuapp.com/

const maxContainers = 1000;
let containers = [];

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

  await clearContainers().then(() => containers = []);

  for (let protocol in config) {
    await initProtocolSeeder(protocol, config[protocol])
  }

  console.log("\nSeeders initialized with config: \n", config);
  socketClient.emit("seeders initialized");
});

async function initProtocolSeeder(protocol, config) {
  if (protocol != "ipfs" && protocol != "hyper")
    return false;
  let prot_containers = []
  let seedCmd = protocol === 'ipfs' ? 'ipfs pin add' : '/usr/local/bin/node /cli/bin/hyp seed';

  // Find max amount of instances needed
  let amount = 0;
  for (let key in config) {
    amount = config[key] > amount ? amount = config[key] : amount;
  }

  if (amount <= 0)
    return;
  console.log(`Initializing ${amount} ${protocol}-seeders...`);
  
  // Create amount-number of instances
  let promises = [];
  for (let i = 0; i < amount && i < maxContainers; i++) {
    promises.push(createContainer(protocol, i).then(container => {
      containers.push(container);
      prot_containers.push(container);
      return container.start();
    }).catch(err => { console.log("Couldn't start container", err)}));
  }

  Promise.allSettled(promises).then(results => {
    // Give daemon time to start
    setTimeout(() => {

      // Pin hash according to the config
      for (let key in config) {
        let desiredPins = config[key];
        
        const runContainers = prot_containers.slice(0, desiredPins);
        /*Promise.allSettled(
          runContainers.map(container => runExec(container, `${seedCmd} ${key}`))
        ).then(() => {
          console.log(`Seeding complete for ${protocol} - ${key}`)
          socketClient.emit("seeders initialized");
        }).catch(err => {
          console.log(`Error occured while trying to seed ${protocol} - ${key}`);
        })*/
        runContainers.forEach(async container => {
          await runExec(container, `${seedCmd} ${key}`).catch(err => console.log(`Error occured while trying to seed ${protocol} - ${key}`));
        });
        console.log(`Seeding complete for ${protocol} - ${key}`)
        socketClient.emit("seeders initialized");
      }
    }, 40000 )
  }).catch(err => {
    console.log("Error occured while trying to start containers", err);
  })
}

function createContainer(protocol, index) {
  let image = protocol == "ipfs" ? "toastaren/goipfs:latest" : "toastaren/hypercore-cli:latest";
  return docker.createContainer({
    Image: image,
    name: `${protocol}-${index}-1`,
    HostConfig: {
      Memory: 300 * 1024 * 1024,
      MemorySwap: 1024 * 1024 * 1024,
    }
  });
}

function clearContainers() {
  // console.log(containers);
  /*return new Promise(async (resolve, reject) => {
    docker.listContainers({ all: true }, async (err, cons) => {
      if (err)
        reject();
      else {
        Promise.allSettled(
          cons.map(containerInfo =>
            docker.getContainer(containerInfo.Id).remove({ force: true })
          )
        ).then(() => {
          resolve();
        })
      }
    });
    
  });*/
  return new Promise((resolve, reject) => {
    Promise.allSettled(
      containers.map(container => docker.getContainer(container.id).remove({ force: true }))
    ).then(() => resolve())
    .catch(() => reject());
  
  })
}

/**
 * Get env list from running container
 * @param container
 */
function runExec(container, cmd) {
  return new Promise((resolve, reject) => {
    //console.log(container, cmd)
    var options = {
      Cmd: ["sh", "-c", cmd],
      AttachStdout: true,
      AttachStderr: true
    };
    try{
      container.exec(options, function (err, exec) {
        if (err) {
          console.log("error:", err);
          reject();
        }
        exec.start(function (err, stream) {
          if (err) {
            console.log("error : " + err);
            reject();
          }
    
          container.modem.demuxStream(stream, process.stdout, process.stderr);
          exec.inspect(function (err, data) {
            if (err) {
              console.log("error : " + err);
              reject();
            }
            resolve();
          });
        });
      });
    } catch (err) {
      reject();
    }
  })
  
}