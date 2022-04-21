

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
    // document.getElementById('start-http-test').addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const formDiv = document.querySelector('#http-form');
    //     const formData = new FormData(formDiv);
    //     const data = Object.fromEntries(formData);
    //     console.log('Begin test http: ', data);
    //     // socket.emit('begin test', data);
    // });
    // document.getElementById('start-hyper-test').addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const formDiv = document.querySelector('#hyper-form');
    //     const formData = new FormData(formDiv);
    //     const data = Object.fromEntries(formData);
    //     console.log('Begin test hyper: ', data);
    //     socket.emit('begin test', data);
    // });
    document.getElementById('hyper-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formDiv = document.querySelector('#hyper-form');
        const formData = new FormData(formDiv);
        const data = Object.fromEntries(formData);
        console.log('Begin test hyper: ', data);
        socket.emit('begin test', data);
    });
    
});

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}