

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ipfs-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formDiv = document.querySelector('#ipfs-form');
        const formData = new FormData(formDiv);
        const data = Object.fromEntries(formData);
        console.log('Begin test hyper: ', data);
        socket.emit('begin test', data);
    });
    document.getElementById('http-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formDiv = document.querySelector('#http-form');
        const formData = new FormData(formDiv);
        const data = Object.fromEntries(formData);
        console.log('Begin test http: ', data);
        socket.emit('begin test', data);
    });
    document.getElementById('hyper-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formDiv = document.querySelector('#hyper-form');
        const formData = new FormData(formDiv);
        const data = Object.fromEntries(formData);
        console.log('Begin test hyper: ', data);
        socket.emit('begin test', data);
    });
    document.getElementById('clear-results-btn').addEventListener('click', clearAllMeasureResults);
    document.getElementById('clear-local-results-btn').addEventListener('click', clearLocalMeasureResults);
});
/**
 * Function for getting value from local storage
 * @param {string} key - key of the value to get
 * @returns - JSON object containing values
 */
function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
/**
 * Function for setting key value pair in local storage
 * @param {string} key - key of the value to set
 * @param {Object} value - value to set
 */
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Function for clearing the measured result on the server and in local storage
 */
function clearAllMeasureResults() {
    localStorage.clear();
    socket.emit('clear result');
}
/**
 * Function for clearing the measured result in local storage
 */
function clearLocalMeasureResults() {
    localStorage.clear();
}

function navigate(key) {
    setResultToShow(key);
    window.location.href = '/server/public/result.html';
}

function setResultToShow(key) {
    setLocalStorage('showResult', key);
}