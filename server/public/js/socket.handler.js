import {setInstancesDiv, setInstancesRunningDiv} from './util.status.component.js';

socket.emit('client connect');

socket.on('tester count', async (response) => { 
    console.log("Number of clients: ", response);
    setInstancesDiv(response);
});

socket.on('tester completed', async (response) => { 
    console.log("Tester completed: ", response);
    setInstancesRunningDiv(response);
});

socket.on('test complete', (response) => {
    console.log("Test complete: ", response);
    var keys = Object.keys(response);
    keys.map(key => {
        var values = Object.values(response[key]);
        localStorage.setItem(key, JSON.stringify(values));
    });
});

socket.on('test started', (response) => {
    console.log("Test started: ", response);
    setInstancesRunningDiv(response);
});

socket.on('test failed', (response) => {
    console.log("Test failed: ", response);
});