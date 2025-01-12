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
    listItem.className = `task ${todo.done ? "completed-task" : ""}`;
    listItem.innerHTML = `
      <span>${todo.text}</span>
      <div class="task-buttons">
        <input type="checkbox" ${todo.done ? "checked" : ""} onchange="toggleDone(${index})">
        <button class="edit" data-index="${index}">✏</button>
        <button class="delete" onclick="deleteTask(${index})">🗑</button>
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
    errorMessage.style.display = "block";
    return;
  }
  if (text.length < 5) {
    errorMessage.textContent = "Task must be at least 5 characters long!";
    errorMessage.style.display = "block";
    return;
  }
  if (/^\d/.test(text)) {
    errorMessage.textContent = "Task cannot start with a number!";
    errorMessage.style.display = "block";
    return;
  }

  todos.push({ text, done: false });
  saveToLocalStorage();
  renderTodos();
  todoInput.value = "";
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
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
  editingIndex = index; // Save the index of the task being edited
  modalInput.value = todos[index].text; // Set the modal input value to the current task text
  modal.classList.add("show-modal"); // Show the modal
};

const confirmEdit = () => {
  const text = modalInput.value.trim();

  // Validation checks
  if (!text) {
    errorMessage.textContent = "Task cannot be empty!";
    errorMessage.style.display = "block";
    return;
  }
  if (text.length < 5) {
    errorMessage.textContent = "Task must be at least 5 characters long!";
    errorMessage.style.display = "block";
    return;
  }
  if (/^\d/.test(text)) {
    errorMessage.textContent = "Task cannot start with a number!";
    errorMessage.style.display = "block";
    return;
  }

  // Update the task
  todos[editingIndex].text = text;
  saveToLocalStorage();
  renderTodos();

  // Close the modal
  closeModal();
};

const closeModal = () => {
  modal.classList.remove("show-modal");
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
};

// Listen for edit button clicks
todoList.addEventListener("click", event => {
  if (event.target.classList.contains("edit")) {
    const index = event.target.dataset.index; // Get the index of the task
    openEditModal(index); // Open the modal with the correct task
  }
});

// Event listeners
addTaskButton.addEventListener("click", addTask);
filterAllButton.addEventListener("click", () => renderTodos("all"));
filterDoneButton.addEventListener("click", () => renderTodos("done"));
filterTodoButton.addEventListener("click", () => renderTodos("todo"));
deleteDoneTasksButton.addEventListener("click", deleteDoneTasks);
deleteAllTasksButton.addEventListener("click", deleteAllTasks);
confirmButton.addEventListener("click", confirmEdit);
cancelButton.addEventListener("click", closeModal);

// Initial render
renderTodos();
