const todoInput = document.getElementById("todoInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const filterAllButton = document.getElementById("filterAllButton");
const filterDoneButton = document.getElementById("filterDoneButton");
const filterTodoButton = document.getElementById("filterTodoButton");
const deleteDoneTasksButton = document.getElementById("deleteDoneTasksButton");
const deleteAllTasksButton = document.getElementById("deleteAllTasksButton");
const errorMessage = document.getElementById("errorMessage");
const modal = document.getElementById("modal");
const modalInput = document.getElementById("modalInput");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editingIndex = null;

const saveToLocalStorage = () => localStorage.setItem("todos", JSON.stringify(todos));

const renderTodos = (filter = "all") => {
  todoList.innerHTML = "";

  const filteredTodos =
    filter === "all"
      ? todos
      : filter === "done"
      ? todos.filter(todo => todo.done)
      : todos.filter(todo => !todo.done);

      filteredTodos.forEach((todo, index) => {
        const listItem = document.createElement("li");
        listItem.className = `todo-item ${todo.done ? "done" : ""}`;
        listItem.innerHTML = `
          <span class="task">${todo.text}</span>
          <div class="actions">
            <input type="checkbox" ${todo.done ? "checked" : ""} onclick="toggleDone(${index})">
            <button onclick="openEditModal(${index})">✏</button>
            <button onclick="deleteTask(${index})">🗑</button>
          </div>
        `;
        todoList.appendChild(listItem);
    });
    

  deleteDoneTasksButton.disabled = todos.every(todo => !todo.done);
  deleteAllTasksButton.disabled = todos.length === 0;
};

const addTask = () => {
  const text = todoInput.value.trim();
  if (!text) {
    errorMessage.textContent = "Task cannot be empty!";
    return;
  }
  if (text.length < 5) {
    errorMessage.textContent = "Task must be at least 5 characters long!";
    return;
  }
  if (/^\d/.test(text)) {
    errorMessage.textContent = "Task cannot start with a number!";
    return;
  }

  todos.push({ text, done: false });
  saveToLocalStorage();
  renderTodos();
  todoInput.value = "";
  errorMessage.textContent = "";
};

const toggleDone = index => {
  todos[index].done = !todos[index].done;
  saveToLocalStorage();
  renderTodos();
};

const deleteTask = index => {
  todos.splice(index, 1);
  saveToLocalStorage();
  renderTodos();
};

const deleteDoneTasks = () => {
  todos = todos.filter(todo => !todo.done);
  saveToLocalStorage();
  renderTodos();
};

const deleteAllTasks = () => {
  todos = [];
  saveToLocalStorage();
  renderTodos();
};

const openEditModal = index => {
  editingIndex = index;
  modalInput.value = todos[index].text;
  modal.classList.remove("hidden");
};

const confirmEdit = () => {
  const text = modalInput.value.trim();
  if (!text || text.length < 5 || /^\d/.test(text)) {
    errorMessage.textContent = "Invalid input!";
    return;
  }
  todos[editingIndex].text = text;
  saveToLocalStorage();
  renderTodos();
  modal.classList.add("hidden");
};

const closeModal = () => modal.classList.add("hidden");

addTaskButton.addEventListener("click", addTask);
filterAllButton.addEventListener("click", () => renderTodos("all"));
filterDoneButton.addEventListener("click", () => renderTodos("done"));
filterTodoButton.addEventListener("click", () => renderTodos("todo"));
deleteDoneTasksButton.addEventListener("click", deleteDoneTasks);
deleteAllTasksButton.addEventListener("click", deleteAllTasks);
confirmButton.addEventListener("click", confirmEdit);
cancelButton.addEventListener("click", closeModal);

renderTodos();