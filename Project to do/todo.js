// Select elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const todoList = document.getElementById('todoList');
const filterAll = document.getElementById('filterAll');
const filterDone = document.getElementById('filterDone');
const filterTodo = document.getElementById('filterTodo');
const deleteDoneTasks = document.getElementById('deleteDoneTasks');
const deleteAllTasks = document.getElementById('deleteAllTasks');

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task.text, task.done));
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(todoList.children).map(item => ({
        text: item.querySelector('span').textContent,
        done: item.classList.contains('done')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create a task element
function createTaskElement(taskText, done = false) {
    const taskItem = document.createElement('li');
    taskItem.className = `todo-item ${done ? 'done' : ''}`;

    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;

    const completeButton = document.createElement('button');
    completeButton.textContent = '✔';
    completeButton.classList.add('complete');
    completeButton.onclick = () => {
        taskItem.classList.toggle('done');
        saveTasks();
    };

    const editButton = document.createElement('button');
    editButton.textContent = '✏';
    editButton.classList.add('edit');
    editButton.onclick = () => {
        const newTaskText = prompt('Edit task:', taskContent.textContent);
        if (newTaskText) {
            taskContent.textContent = newTaskText;
            saveTasks();
        }
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑';
    deleteButton.classList.add('delete');
    deleteButton.onclick = () => {
        taskItem.remove();
        saveTasks();
    };

    taskItem.append(taskContent, completeButton, editButton, deleteButton);
    todoList.appendChild(taskItem);
}

// Add task
addTaskButton.onclick = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return alert('Task cannot be empty.');
    createTaskElement(taskText);
    taskInput.value = '';
    saveTasks();
};

// Filter tasks
filterAll.onclick = () => Array.from(todoList.children).forEach(item => (item.style.display = 'flex'));
filterDone.onclick = () => Array.from(todoList.children).forEach(item => (item.style.display = item.classList.contains('done') ? 'flex' : 'none'));
filterTodo.onclick = () => Array.from(todoList.children).forEach(item => (item.style.display = !item.classList.contains('done') ? 'flex' : 'none'));

// Delete done tasks
deleteDoneTasks.onclick = () => {
    Array.from(todoList.children)
        .filter(item => item.classList.contains('done'))
        .forEach(item => item.remove());
    saveTasks();
};

// Delete all tasks
deleteAllTasks.onclick = () => {
    todoList.innerHTML = '';
    saveTasks();
};

// Load tasks on page load
loadTasks();
