// DOM Elements
const todoInput = document.getElementById('todoInput');
const addTaskButton = document.getElementById('addTaskButton');
const todoList = document.getElementById('todoList');
const errorMessage = document.getElementById('errorMessage');
const filterAllButton = document.getElementById('filterAllButton');
const filterDoneButton = document.getElementById('filterDoneButton');
const filterTodoButton = document.getElementById('filterTodoButton');
const deleteDoneTasksButton = document.getElementById('deleteDoneTasksButton');
const deleteAllTasksButton = document.getElementById('deleteAllTasksButton');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmAction = document.getElementById('confirmAction');
const cancelAction = document.getElementById('cancelAction');
const editTaskModal = document.getElementById('editTaskModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditButton = document.getElementById('saveEditButton');
const cancelEditButton = document.getElementById('cancelEditButton');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filterStatus = 'all';
let editingTaskId = null;

const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const validateInput = (taskText) => {
  if (!taskText) return 'Task cannot be empty.';
  if (!isNaN(taskText.charAt(0))) return 'Task cannot start with a number.';
  if (taskText.length < 5) return 'Task must be at least 5 characters long.';
  return '';
};

const renderTasks = () => {
  todoList.innerHTML = '';
  const filteredTasks = tasks.filter(task => 
    filterStatus === 'all' || 
    (filterStatus === 'done' && task.completed) || 
    (filterStatus === 'todo' && !task.completed)
  );
  
  if (filteredTasks.length === 0) {
    todoList.innerHTML = '<p style="color: #888; font-style: italic;">No tasks to display.</p>';
    return;
  }

  filteredTasks.forEach(task => {
    const taskElement = document.createElement('li');
    taskElement.className = task.completed ? 'completed-task' : '';
    taskElement.innerHTML = `
      <span>${task.text}</span>
      <div class="task-buttons">
        <button class="checkbox" onclick="toggleTask(${task.id})">${task.completed ? '✔️' : '⬜'}</button>
        <button class="edit" onclick="openEditModal(${task.id})">✏️</button>
        <button class="delete" onclick="openConfirmModal('Are you sure you want to delete this task?', () => deleteTask(${task.id}))">🗑️</button>
      </div>
    `;
    todoList.appendChild(taskElement);
  });

  updateDeleteButtons();
};

const toggleTask = (taskId) => {
  const task = tasks.find(task => task.id === taskId);
  if (task) task.completed = !task.completed;
  saveTasks();
  renderTasks();
};

const deleteTask = (taskId) => {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
};

const updateDeleteButtons = () => {
  deleteDoneTasksButton.disabled = !tasks.some(task => task.completed);
  deleteAllTasksButton.disabled = tasks.length === 0;
};

const showErrorMessage = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  setTimeout(() => errorMessage.style.display = 'none', 3000);
};

const openConfirmModal = (message, confirmCallback) => {
  confirmMessage.textContent = message;
  confirmModal.style.display = 'flex';
  confirmAction.onclick = () => {
    confirmCallback();
    closeModal();
  };
  cancelAction.onclick = closeModal;
};

const closeModal = () => {
  confirmModal.style.display = 'none';
  editTaskModal.style.display = 'none';
};

const openEditModal = (taskId) => {
  editingTaskId = taskId;
  const task = tasks.find(task => task.id === taskId);
  editTaskInput.value = task.text;
  editTaskModal.style.display = 'flex';
};

const saveEditTask = () => {
  const newText = editTaskInput.value.trim();
  const validationError = validateInput(newText);
  if (validationError) {
    showErrorMessage(validationError);
    return;
  }

  const task = tasks.find(task => task.id === editingTaskId);
  task.text = newText;
  saveTasks();
  renderTasks();
  closeModal();
};

addTaskButton.addEventListener('click', () => {
  const taskText = todoInput.value.trim();
  const validationError = validateInput(taskText);
  if (validationError) {
    showErrorMessage(validationError);
    return;
  }

  tasks.push({ id: Date.now(), text: taskText, completed: false });
  saveTasks();
  todoInput.value = '';
  renderTasks();
});

filterAllButton.addEventListener('click', () => { filterStatus = 'all'; renderTasks(); });
filterDoneButton.addEventListener('click', () => { filterStatus = 'done'; renderTasks(); });
filterTodoButton.addEventListener('click', () => { filterStatus = 'todo'; renderTasks(); });

deleteDoneTasksButton.addEventListener('click', () => {
  openConfirmModal('Are you sure you want to delete all completed tasks?', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
  });
});

deleteAllTasksButton.addEventListener('click', () => {
  openConfirmModal('Are you sure you want to delete all tasks?', () => {
    tasks = [];
    saveTasks();
    renderTasks();
  });
});

saveEditButton.addEventListener('click', saveEditTask);
cancelEditButton.addEventListener('click', closeModal);

renderTasks();