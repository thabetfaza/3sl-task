// تحديد العناصر من الـ HTML
const todoInput = document.getElementById("todoInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const errorMessage = document.getElementById("errorMessage");
const filterAllButton = document.getElementById("filterAllButton");
const filterDoneButton = document.getElementById("filterDoneButton");
const filterTodoButton = document.getElementById("filterTodoButton");
const deleteDoneTasksButton = document.getElementById("deleteDoneTasksButton");
const deleteAllTasksButton = document.getElementById("deleteAllTasksButton");
const confirmModal = document.getElementById("confirmModal");
const confirmMessage = document.getElementById("confirmMessage");
const confirmAction = document.getElementById("confirmAction");
const cancelAction = document.getElementById("cancelAction");

let tasks = []; // قائمة المهام
let filterStatus = "all"; // الفلتر الحالي

// إضافة مهمة جديدة
addTaskButton.addEventListener("click", () => {
  const taskText = todoInput.value.trim();
  if (taskText === "") {
    showErrorMessage("Please enter a task!");
    return;
  }
  tasks.push({ id: Date.now(), text: taskText, completed: false });
  todoInput.value = ""; // إعادة تعيين الإدخال
  renderTasks();
  updateDeleteButtons();
});

// عرض المهام حسب الفلتر
function renderTasks() {
  todoList.innerHTML = ""; // مسح القائمة

  if (tasks.length === 0) {
    // عرض رسالة إذا كانت القائمة فارغة
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No tasks.";
    emptyMessage.style.color = "#888";
    emptyMessage.style.fontStyle = "italic";
    todoList.appendChild(emptyMessage);
    return;
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "done") return task.completed;
    if (filterStatus === "todo") return !task.completed;
  });

  filteredTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.className = task.completed ? "completed-task" : "";
    taskElement.innerHTML = `
      <span>${task.text}</span>
      <div class="task-buttons">
        <button class="checkbox" onclick="toggleTask(${task.id})">
          ${task.completed ? "✔️" : "⬜"}
        </button>
        <button class="edit" onclick="editTask(${task.id})">✏️</button>
        <button class="delete" onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;
    todoList.appendChild(taskElement);
  });
}

// تغيير حالة المهمة (تم أو لم يتم)
function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
    updateDeleteButtons();
  }
}

// تعديل مهمة
function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    const newText = prompt("Edit task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      renderTasks();
    }
  }
}

// حذف مهمة
function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  renderTasks();
  updateDeleteButtons();
}

// تحديث أزرار الحذف
function updateDeleteButtons() {
  deleteDoneTasksButton.disabled = !tasks.some((task) => task.completed);
  deleteAllTasksButton.disabled = tasks.length === 0;
}

// عرض رسالة خطأ
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}

// تطبيق الفلاتر
filterAllButton.addEventListener("click", () => {
  filterStatus = "all";
  renderTasks();
});
filterDoneButton.addEventListener("click", () => {
  filterStatus = "done";
  renderTasks();
});
filterTodoButton.addEventListener("click", () => {
  filterStatus = "todo";
  renderTasks();
});

// حذف المهام المكتملة
deleteDoneTasksButton.addEventListener("click", () => {
  openModal("Are you sure you want to delete all completed tasks?", () => {
    tasks = tasks.filter((task) => !task.completed);
    renderTasks();
    updateDeleteButtons();
  });
});

// حذف جميع المهام
deleteAllTasksButton.addEventListener("click", () => {
  openModal("Are you sure you want to delete all tasks?", () => {
    tasks = [];
    renderTasks();
    updateDeleteButtons();
  });
});

// فتح نافذة التأكيد
function openModal(message, confirmCallback) {
  confirmMessage.textContent = message;
  confirmModal.style.display = "flex";
  confirmAction.onclick = () => {
    confirmCallback();
    closeModal();
  };
  cancelAction.onclick = closeModal;
}

// إغلاق نافذة التأكيد
function closeModal() {
  confirmModal.style.display = "none";
}

// عرض المهام عند التحميل الأولي
renderTasks();
