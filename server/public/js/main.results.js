window.addEventListener('DOMContentLoaded', init);


function init() {
    const key = getFromLocalStorage('showResult');
    const title = document.querySelector('#page-title');
    title.textContent = 'Dashboard » Result » ' + key;
    
    if(!localStorage.getItem(key)) return;
    const data = getFromLocalStorage(key);

    Object.keys(data).forEach(key => {
        createMeasureResultDiv(key, data[key]);
    });
}

function createMeasureResultDiv(key, data) {
    const content = document.querySelector('.content');
    const div = document.createElement('div');
    const table = document.createElement('div');
    div.className = 'controllers';
    div.id = key;
    div.innerHTML = `<h3>${key} (ms)</h3>`;

    table.id = 'result-table-' + key;
    table.className = 'result-table';
    div.appendChild(table);
    content.appendChild(div);

    data.map(measurement => {
        const element = createMeasurmentElement(measurement);
        table.appendChild(element);
    });
}

function createMeasurmentElement(data) {
    const div = document.createElement('div');
    div.className = 'measurement';
    div.innerHTML = `<h3>${data}</h3>`;
    return div;
}