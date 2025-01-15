
const todoInput = document.getElementById("todoInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const filterAllButton = document.getElementById("filterAllButton");
const filterDoneButton = document.getElementById("filterDoneButton");
const filterTodoButton = document.getElementById("filterTodoButton");
const deleteDoneTasksButton = document.getElementById("deleteDoneTasksButton");
const deleteAllTasksButton = document.getElementById("deleteAllTasksButton");

const editModal = document.getElementById("editModal");
const deleteModal = document.getElementById("deleteModal");

const modalInput = document.getElementById("modalInput");
const confirmEditButton = document.getElementById("confirmEditButton");
const cancelEditButton = document.getElementById("cancelEditButton");

const deleteConfirmButton = document.getElementById("deleteConfirmButton");
const deleteCancelButton = document.getElementById("deleteCancelButton");

const errorMessage = document.getElementById("errorMessage");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editingIndex = null;


const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showErrorMessage = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  errorMessage.style.color = "#ff4d4d"; 
  errorMessage.style.textAlign = "center"; 
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000); // Hide the error message after 3 seconds //
};

const validateTask = (text) => {
  if (!text) {
    showErrorMessage("Task cannot be empty!");
    return false;
  }
  if (text.length < 5) {
    showErrorMessage("Task must be at least 5 characters long!");
    return false;
  }
  if (/^\d/.test(text)) {
    showErrorMessage("Task cannot start with a number!");
    return false;
  }
  return true;
};

const focusInput = () => {
  todoInput.focus();
};


const renderTodos = (filter = "all") => {
  todoList.innerHTML = "";

  const filteredTodos =
    filter === "all"
      ? todos
      : filter === "done"
      ? todos.filter((todo) => todo.done)
      : todos.filter((todo) => !todo.done);

  
  if (filteredTodos.length === 0) {
    const noTasksMessage = document.createElement("li");
    noTasksMessage.textContent = "No tasks";
    noTasksMessage.style.textAlign = "center";
    noTasksMessage.style.color = "#888"; 
    noTasksMessage.style.fontStyle = "italic"; 
    todoList.appendChild(noTasksMessage);
  } else {
    
    filteredTodos.forEach((todo, index) => {
      const listItem = document.createElement("li");
      listItem.className = `task ${todo.done ? "completed-task" : ""}`;
      listItem.innerHTML = `
        <span>${todo.text}</span>
        <div class="task-buttons">
          <input type="checkbox" ${todo.done ? "checked" : ""} data-index="${index}" class="toggle-done">
          <button class="edit" data-index="${index}">✏</button>
          <button class="delete" data-index="${index}">🗑</button>
        </div>
      `;
      todoList.appendChild(listItem);
    });
  }

  deleteDoneTasksButton.disabled = todos.every((todo) => !todo.done);
  deleteAllTasksButton.disabled = todos.length === 0;
};


const addTask = () => {
  const text = todoInput.value.trim();
  if (!validateTask(text)) return;

  todos.push({ text, done: false });
  saveToLocalStorage();
  renderTodos();
  todoInput.value = "";
  focusInput();
};


const toggleDone = (index) => {
  todos[index].done = !todos[index].done;
  saveToLocalStorage();
  renderTodos();
};


const deleteTask = (index) => {
  openDeleteModal("Are you sure you want to delete this task?", () => {
    todos.splice(index, 1);
    saveToLocalStorage();
    renderTodos();
  });
};


const openDeleteModal = (message, onConfirm) => {
  deleteModal.querySelector("p").textContent = message; 
  deleteModal.style.display = "block"; 

  deleteConfirmButton.onclick = () => {
    onConfirm();
    closeDeleteModal();
  };
};

const closeDeleteModal = () => {
  deleteModal.style.display = "none";
};

const deleteDoneTasks = () => {
  openDeleteModal("Are you sure you want to delete all completed tasks?", () => {
    todos = todos.filter((todo) => !todo.done);
    saveToLocalStorage();
    renderTodos();
  });
};

const deleteAllTasks = () => {
  openDeleteModal("Are you sure you want to delete all tasks?", () => {
    todos = [];
    saveToLocalStorage();
    renderTodos();
  });
};

const openEditModal = (index) => {
  editingIndex = index;
  modalInput.value = todos[index].text;
  editModal.style.display = "block";
  modalInput.focus();
};


const confirmEdit = () => {
  const text = modalInput.value.trim();
  if (!validateTask(text)) return;

  todos[editingIndex].text = text;
  saveToLocalStorage();
  renderTodos();
  closeEditModal();
};


const closeEditModal = () => {
  editModal.style.display = "none";
  focusInput();
};


addTaskButton.addEventListener("click", addTask);
filterAllButton.addEventListener("click", () => renderTodos("all"));
filterDoneButton.addEventListener("click", () => renderTodos("done"));
filterTodoButton.addEventListener("click", () => renderTodos("todo"));
deleteDoneTasksButton.addEventListener("click", deleteDoneTasks);
deleteAllTasksButton.addEventListener("click", deleteAllTasks);
confirmEditButton.addEventListener("click", confirmEdit);
cancelEditButton.addEventListener("click", closeEditModal);
deleteCancelButton.addEventListener("click", closeDeleteModal);

todoList.addEventListener("click", (event) => {
  const index = event.target.dataset.index;
  if (event.target.classList.contains("edit")) {
    openEditModal(index);
  } else if (event.target.classList.contains("delete")) {
    deleteTask(index);
  } else if (event.target.classList.contains("toggle-done")) {
    toggleDone(index);
  }
});

renderTodos();
