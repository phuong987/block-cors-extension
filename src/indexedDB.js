// window.addEventListener('load', () => {
//     initDB().then(() => {
//         document.getElementById('loadButton').addEventListener('click', loadData);
//     });
// })

// Initialize IndexedDB
let db;

initDB = () => {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open('jsonDatabase', 1);

        request.onerror = function(event) {
            console.error('Database error:', event.target.error);
            reject();
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve();
        };

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            let objectStore = db.createObjectStore('jsonStore', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('date', ['date'], { unique: true });
        };
    });
}

function loadData() {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(['jsonStore'], 'readonly');
        let objectStore = transaction.objectStore('jsonStore');

        let request = objectStore.getAll();
        request.onsuccess = (event) => {
            let data = event.target.result;
            //document.getElementById('dataDisplay').textContent = JSON.stringify(data, null, 2);
            resolve(data);
        };
        request.onerror = (event) => {
            console.error('Load data error:', event.target.error);
            reject(event.target.error);
        };
    });
}

function updateData(newData) {
    let transaction = db.transaction(['jsonStore'], 'readwrite');
    let objectStore = transaction.objectStore('jsonStore');

    // Using objectStore.put to delete available record has same unique key, then save newData
    let request = objectStore.put(newData);

    request.onsuccess = function(event) {
        console.log('Data updated: ', newData.date);
    };

    request.onerror = function(event) {
        console.error('Update data error:', event.target.error);
    };
}