const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

function addTask(task) {
  const li = document.createElement("li");
  const taskText = document.createElement("span");
  taskText.innerText = task;

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", () => {
    editTask(li, taskText);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteTask(li);
  });

  li.appendChild(taskText);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  taskList.appendChild(li);
}

function editTask(li) {
  const taskText = li.querySelector("span");
  const taskInput = document.createElement("input");
  taskInput.value = taskText.innerText;

  taskInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const newTask = taskInput.value.trim();
      if (newTask !== "") {
        taskText.innerText = newTask;
        li.removeChild(taskInput);
      }
    } else if (e.key === "Escape") {
      li.removeChild(taskInput);
    }
  });

  li.appendChild(taskInput);
  taskInput.focus();
}

function deleteTask(li) {
  li.remove();
}

function saveTasks() {
  const tasks = [];
  const taskItems = taskList.getElementsByTagName("li");

  for (let i = 0; i < taskItems.length; i++) {
    tasks.push(taskItems[i].getElementsByTagName("span")[0].innerText);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (tasks) {
    tasks.forEach((task) => {
      addTask(task);
    });
  }
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();

  if (task !== "") {
    addTask(task);
    saveTasks();
    taskInput.value = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});