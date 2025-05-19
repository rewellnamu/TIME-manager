// Load tasks from localStorage on page load
window.onload = function() {
  loadTasks();
};

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  updateStats();

  const toggle = document.getElementById("themeToggle");

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
});

function addTask() {
  const input = document.getElementById("todoInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    text: taskText,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  input.value = "";
  loadTasks();
  updateStats();
}

function loadTasks() {
  const tasks = getTasks();
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span onclick="toggleComplete(${index})">${task.text}</span>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    todoList.appendChild(li);
  });
  updateStats();
}

function toggleComplete(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  loadTasks();
  updateStats();
}

function deleteTask(index) {
  const tasks = getTasks();
  const todoList = document.getElementById("todoList");
  const item = todoList.children[index];

  if (item) {
    item.classList.add("removed");
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks(tasks);
      loadTasks();
      updateStats();
    }, 300); // Wait for fadeOut animation
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  const total = document.querySelectorAll('#todoList li').length;
  const completed = document.querySelectorAll('#todoList li.completed').length;

  animateCount('completedCount', completed);
  animateCount('totalCount', total);

  const progress = document.getElementById('progress');
  const percent = total === 0 ? 0 : (completed / total) * 100;
  progress.style.width = `${percent}%`;
}

// Animate numbers counting up smoothly
function animateCount(id, target) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent) || 0;
  const duration = 300;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(progress * (target - start) + start);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
