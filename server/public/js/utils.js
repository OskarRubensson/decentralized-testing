/**
 * 
 * @param {string} tableID - contains the element ID of a html table element
 * @param {object} data - contains the data for the table
 * @param {boolean} isHeader - value for showing a header or not
 * @param {string} headers - contains a array of header names
 */


 function loadTable  (tableID, data, isHeader, headers) {
    $(`#${tableID} tr`).remove(); 
    if(data == null || tableID == null || isHeader == null) return;
    let table = document.getElementById(tableID);
    let id = 0;
    let column, tolerance = 10;
    let row = document.createElement('tr');

    for(let i = 0; i < data.length; i++) {
        if(i % tolerance == 0) {
            table.appendChild(row);
            row = table.insertRow(-1);
        }
        column = document.createElement('th');
        column.innerHTML = data[i];
        row.appendChild(column);
    }
    if(!isHeader) return;
    var header = table.createTHead();
    row = header.insertRow(0);
    $.each(headers, function(index, header) {
        let headerCell = document.createElement("TH");
        headerCell.innerHTML = header;
        row.appendChild(headerCell);
    }); 
}

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

function navigate(key) {
    setResultToShow(key);
    window.location.href = '/server/public/result.html';
}

function setResultToShow(key) {
    setLocalStorage('showResult', key);
}
/**
 * Function for setting disabled property of a button
 * @param {string} id - id of the button
 * @param {boolean} value - value of the disabled property
 */
function setBtnDisabled(id, value) {
    document.getElementById(id).disabled = value;
}
