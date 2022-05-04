
var inputIndex = 0;
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-data-btn').addEventListener('click', (e) => {
        const formIPFS = document.getElementById('ipfs');
        const formHyper = document.getElementById('hyper');
        const formIpfsData = new FormData(formIPFS);
        const formHyperData = new FormData(formHyper);

        var ipfsData = Object.fromEntries(formIpfsData);
        var hyperData = Object.fromEntries(formHyperData);

        ipfsData = transformData('ipfs', ipfsData);
        hyperData = transformData('hyper', hyperData);

        var data = new Object();
        if(ipfsData) data.ipfs = ipfsData;
        if(hyperData) data.hyper = hyperData;
        console.log(data);

        if(Object.keys(data).length == 0) return;
        socket.emit('seeder config', data);
    });

    document.getElementById('leechers').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = document.getElementById('leechers');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.amount = Number.parseInt(data.amount);

        console.log(data);
        socket.emit('leecher config', data.amount);
    });
});
/**
 * Function for adding fields to a specific form
 * @param {string} id - id of the form that the field should be added to
 */
function addFieldToForm(id) {
    var form = document.getElementById(id);

    var inputNumber = document.createElement("input");
    inputNumber.type = "number";
    inputNumber.name = "quantity" + inputIndex;
    inputNumber.value = "0";
    inputNumber.min = "0";
    form.prepend(inputNumber);

    var input = document.createElement("input");

    input.type = "text";
    input.name = "hash" + inputIndex;
    input.placeholder = "hash";
    form.prepend(input);

    inputIndex++;
}
/**
 * Function for transforming data from the form into a format that can be sent to the server
 * @param {string} id - id of the form that the data is from
 * @param {Object} data - data from the form
 * @returns - transformed data
 */
function transformData(id, data) {
    const tmpData = {};
    const array = Object.entries(data);

        
    for(let i = 0; i <= array.length; i++) {
        if(i % 2 == 1) {
            const quantity = array[i][1];
            const hash = array[i - 1][1];

            if(quantity == 0 || hash == "") return null;

            tmpData[hash] = Number.parseInt(quantity);
        }
    }
    return tmpData;
}