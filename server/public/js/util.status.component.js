
async function fetchNumberOfInstances() {
    socket.emit('tester count');
}

function setInstancesDiv(numberOfInstances) {
    var instancesDiv = document.querySelector('#status-text');
    instancesDiv.innerHTML = numberOfInstances;
}

function setInstancesRunningDiv(numberOfInstances) {
    var instancesDiv = document.querySelector('#status-text-running');
    instancesDiv.innerHTML = numberOfInstances;
}

export { fetchNumberOfInstances, setInstancesDiv, setInstancesRunningDiv };