# decentralized-testing
Tests the decentralized websites created using decentralized-website.  

Config.json contains the urls to test along with a key that defines what is being tested.  

npm run server - Starts the server instance  
npm run client - Starts a client instance  
node start.js - Starts the test on every client-instance that is being run and is connected to the server. The server then gathers the test-results in a file: output.json
