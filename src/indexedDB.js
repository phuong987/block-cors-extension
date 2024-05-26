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
            // {keyPath: 'date'} mean date is PK, so can use objectStore.delete(PK)
            let objectStore = db.createObjectStore('jsonStore', {keyPath: 'date'});
            //objectStore.createIndex('dateIndex', 'date', { unique: true });
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

function overwriteData(newData) {
    let transaction = db.transaction(['jsonStore'], 'readwrite');
    let objectStore = transaction.objectStore('jsonStore');
    let request = objectStore.delete(newData.date);

    request.onsuccess = function(event) {
        addOrUpdateData(newData, objectStore);
    };
}

function addOrUpdateData(newData, objectStore) {
    if (objectStore == null) {
        let transaction = db.transaction(['jsonStore'], 'readwrite');
        objectStore = transaction.objectStore('jsonStore');
    }
    let request = objectStore.add(newData);

    request.onsuccess = function(event) {
        console.log('Data updated: ', newData.date);
    };

    request.onerror = function(event) {
        console.error('Update data error:', event.target.error);
    };
}