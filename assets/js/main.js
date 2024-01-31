
var idbApp = (function () {

  "use strict";

  const dbName = 'ToDoList';
  const tableName = 'toDoList';


  let createTag = function (taskObject) {
    return `<div class=" alert alert-danger d-flex justify-content-between align-items-center px-4">
                    <p  data-target="${taskObject.title}" class="task lead mb-0 ">
                        <span id="taskName" class="fw-bolder ">${taskObject.title}</span> -
                        <span id="taskTime" class="fw-bolder ">${taskObject.date}</span>.
                    </p>
                    <button id="deleteBtn" onclick="idbApp.deleteTask('${taskObject.title}')" class="btn btn-danger">X</button>
                </div>`
  }
  let tasksContainer = document.getElementById("tasksContainer");


  // * Check for support
  //#region 
  if (!("indexedDB" in window)) {
    console.warn("This browser does not support indexedDB");
    return;
  }
  //#endregion

  // * Create database "ToDoList"
  var dbPromise = idb.open(dbName, 2, function (upgradeDB) {
    //#region 
    switch (upgradeDB.oldVersion) {
      case 1:
        // ~ Create table "toDoList" with primary-key {task-name}
        //#region 
        upgradeDB.createObjectStore(tableName, { keyPath: "title", unique: true });
        console.log(`table tableName with primary-key {task-name} has created.`);
        //#endregion
        break;
    }
    //#endregion 
  });

  function resetForm() {
    document.getElementById("title").value = '';
    document.getElementById("mins").value = '';
    document.getElementById("hours").value = '';
    document.getElementById("day").value = 'dd';
    document.getElementById("month").value = 'mm';
    document.getElementById("year").value = 'yyyy';
  }

  function addNewTask() {
    //#region 
    dbPromise.then(db => {

      // * Get Task Data from html inputs
      function getTaskData() {
        //#region
        // ~ HTML Elements
        const TaskInputs = {
          //#region 
          title: document.getElementById("title").value,
          min: document.getElementById("mins").value,
          hour: document.getElementById("hours").value,
          day: document.getElementById("day").value,
          month: document.getElementById("month").value,
          year: document.getElementById("year").value,

          //#endregion
        }
        // ~ Check task data
        if (TaskInputs.title == '' || TaskInputs.min == '' || TaskInputs.hour == ''
          || TaskInputs.day == 'dd' || TaskInputs.month == 'mm' || TaskInputs.year == 'yyyy') {
          alert("Invalid data!");
          return;
        }
        // ~ Create Task Object
        var dateFullFormat = new Date(TaskInputs.year, TaskInputs.month - 1, TaskInputs.day, TaskInputs.hour, TaskInputs.min)
        const Task = {
          //#region 
          title: TaskInputs.title.trim(),
          date: dateFullFormat.toDateString() + " " + dateFullFormat.toLocaleTimeString(), // Months are 1-indexed
          disDate: new Date(TaskInputs.year, TaskInputs.month - 1, TaskInputs.day, TaskInputs.hour, TaskInputs.min), // Months are 1-indexed
          complete: false,
          //#endregion
        };
        // ~ Return Task Object
        return Task;
        //#endregion
      }

      const task = getTaskData();

      // ~ transaction
      var tx = db.transaction(tableName, 'readwrite');

      // ~ Store
      var store = tx.objectStore(tableName);

      return store
        .add(task)
        .then(() => {
          console.log("task added: ", task);

          tasksContainer.innerHTML += createTag(task);


          var taskTime = task.disDate.getTime();



          var currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          var currentTime = currentDate.getTime();

          // !

          var timeDiff = taskTime - currentTime;
          console.log({ taskTime }, { currentTime }, { timeDiff });
          displayNotification(task, timeDiff, task.title);
          resetForm();
        })
        .catch((error) => {
          console.log('Could not add task: ', error);
          tx.abort();
        });
    })
  }




  (function () {
    return dbPromise.then((db) => {
      const tx = db.transaction(tableName, "readonly");
      const store = tx.objectStore(tableName);

      return store
        .getAll()
        .then((tasks) => {

          tasksContainer.innerHTML = "";

          tasks.forEach((task) => {


            var taskTime = task.disDate.getTime();

            var currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            var currentTime = currentDate.getTime();

            // !

            var timeDiff = taskTime - currentTime;
            console.log({ taskTime }, { currentTime }, { timeDiff });
            displayNotification(task, timeDiff, task.title);

            tasksContainer.innerHTML += createTag(task);
            if (task.complete) {
              document
                .querySelector(`.task[data-target="${task.title}"]`)
                .classList.add("text-decoration-line-through", "text-black-50");

            }
          });
        })
        .catch((err) => {
          console.warn('getAll: ', err);
          // tasksContainer.innerHTML = 'No Data!';
        });
    });
  })();

  function deleteTask(taskTitle) {
    console.log(taskTitle);
    dbPromise.then((db) => {
      const tx = db.transaction(tableName, "readwrite");
      const store = tx.objectStore(tableName);

      return store
        .delete(taskTitle)
        .then(() => {
          console.log("Task deleted:", taskTitle);

          document.querySelector(`.task[data-target="${taskTitle}"]`).parentElement.remove();

        })
        .catch((err) => {
          console.error("delete task: ", err);
        });
    });
  }


  function displayNotification(task, time, title) {
    setTimeout(() => {
      console.log('from setTimeout', time);
      if ("Notification" in window) {


        Notification.requestPermission().then((permission) => {

          if (permission === 'granted') {
            navigator.serviceWorker.getRegistration()
              .then(registration => {

                const options = {
                  body: task.title,
                  icon: 'assets/images/favicon.ico',
                  image: 'assets/images/favicon.ico',
                  // silent: true,
                  vibrate: [200, 100, 200, 100, 200, 100, 200],
                  // requireInteraction: true,
                  data: {
                    primaryKey: 1,
                    dateOfArrival: Date.now()
                  },
                  actions: [
                    { action: 'delete', title: 'Delete', icon: 'assets/images/xmark.png' }
                  ]
                }


                registration.showNotification('TODO Notification', options);

                document
                  .querySelector(`.task[data-target="${title}"]`)
                  .classList.add("text-decoration-line-through", "text-black-50");

                updateStore(title);
              })
              .catch(error => {
                console.log('navigator.serviceWorker.getRegistration()', error);
              })
          }

        });
      }
    }, time);
  }

  function updateStore(title) {
    dbPromise.then((db) => {
      const tx = db.transaction(tableName, "readwrite");
      const store = tx.objectStore(tableName);

      return store.get(title).then((task) => {
        if (task) {
          task.complete = true;
          console.log('after updated: ', task);
          store.put(task);
        }
      });
    });
  }


  return {
    dbPromise: dbPromise,
    addNewTask: addNewTask,
    deleteTask: deleteTask,
  };



})();




// const databaseName = 'your_database_name';