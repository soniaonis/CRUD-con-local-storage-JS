document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  todoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const task = taskInput.value.trim();
    if (task !== '') {
      if (taskInput.dataset.mode === 'edit') {
        updateTask(task);
      } else {
        addTask(task, 'ToDo');
      }
      taskInput.value = '';
      taskInput.focus();
      taskInput.dataset.mode = 'add';
    }
  });

  taskList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
      toggleTaskStatus(event.target);
    } else if (event.target.classList.contains('delete-btn')) {
      deleteTask(event.target.parentElement);
    } else if (event.target.classList.contains('edit-btn')) {
      editTask(event.target.parentElement);
    }
  });

  loadTasks();

  function addTask(task, status) {
    const li = createTaskElement(task, status);
    taskList.appendChild(li);
    saveTask({ task, status });
  }

  function toggleTaskStatus(taskItem) {
    taskItem.classList.toggle('completed');
    const taskId = taskItem.dataset.taskId;
    const status = taskItem.classList.contains('completed') ? 'Done' : 'ToDo';
    updateTaskStatus(taskId, status);
  }

  function deleteTask(taskItem) {
    taskItem.remove();
    const taskId = taskItem.dataset.taskId;
    removeTask(taskId);
  }

  function editTask(taskItem) {
    const task = taskItem.firstChild.textContent;
    taskInput.value = task;
    taskInput.focus();
    taskInput.dataset.mode = 'edit';
    taskInput.dataset.taskId = taskItem.dataset.taskId;
  }

  function updateTask(task) {
    const taskId = taskInput.dataset.taskId;
    const taskItem = taskList.querySelector(`li[data-task-id="${taskId}"]`);
    taskItem.firstChild.textContent = task;
    updateStoredTask(taskId, task);
  }

  function updateTaskStatus(taskId, status) {
    const taskItem = taskList.querySelector(`li[data-task-id="${taskId}"]`);
    taskItem.classList.remove('completed', 'todo');
    taskItem.classList.add(status.toLowerCase());
    updateStoredTaskStatus(taskId, status);
  }

  function createTaskElement(task, status) {
    const li = document.createElement('li');
    const taskId = Date.now().toString();
    li.textContent = task;
    li.dataset.taskId = taskId;
    li.classList.add(status || '');
    // if (status) {
    //   li.classList.add(status.toLowerCase());
    //   // li.classList.add(status === 'ToDo' ? 'todo' : status.toLowerCase());
    // }
 
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';

    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
    return li;
  }

  function saveTask(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function removeTask(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(item => item.taskId !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateStoredTask(taskId, task) {
    let tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(item => item.taskId === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].task = task;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  function updateStoredTaskStatus(taskId, status) {
    let tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(item => item.taskId === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  function getTasksFromLocalStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  }

  function loadTasks() {
    // taskList.innerHTML = '';
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTask(task.task, task.status));
  }
});