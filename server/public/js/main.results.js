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
    const table = document.createElement('table');
    div.className = 'controllers';
    div.id = key;
    div.innerHTML = `<h3>${key} (ms)</h3>`;

    table.id = 'result-table-' + key;
    div.appendChild(table);
    content.appendChild(div);
    setTimeout(() => {
        loadTable(table.id, data, false, ['Type', 'Time (ms)']); 
    }, 10);
}