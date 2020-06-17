let db;

const request = indexedDB.open('transaction', 1); //(name of the database, version)

// when version numbr chnaged, it's needed to build or change(update) database
request.onupgradeneeded = (event) => {
  db = event.target.result;

  db.createObjectStore('pending', {
    autoIncrement: true,
  });
};

request.onsuccess = (event) => {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = (event) => {
  console.log(event.target.errorCode);
};

//save data in the indexedDB as pending state.
const saveRecord = (item) => {
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  store.add(item);
};

const checkDatabase = () => {
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  //get all the data from indexedDB and transfer to the mongodb and clear the indexedDB
  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      // check if i have any data in the indexedDB
      axios.post('/api/transaction', getAll.result).then(() => {
        const transaction = db.transaction(['pending'], 'readwrite');
        const store = transaction.objectStore('pending');
        store.clear();
      });
    }
  };
};

//make sure when the window get back the internet online then to check the database.
window.addEventListener('online', checkDatabase);
