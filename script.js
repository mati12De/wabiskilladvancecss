// SELECT ELEMENTS
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const toggleBtn = document.getElementById("toggleMode");

let draggedItem = null;

// =====================
// LOAD DATA ON START
// =====================
window.onload = function () {
  // Load tasks
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    createTask(task.text, task.completed);
  });

  // Load dark mode
  if (localStorage.getItem("mode") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.innerText = "☀️";
  }
};

// =====================
// ADD TASK
// =====================
function addTask() {
  if (input.value.trim() === "") return;

  createTask(input.value, false);
  saveTasks();
  input.value = "";
}

// =====================
// CREATE TASK
// =====================
function createTask(text, completed) {
  const li = document.createElement("li");
  li.setAttribute("draggable", true);

  li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">X</button>
    `;

  if (completed) {
    li.classList.add("completed");
  }

  // COMPLETE TASK
  li.querySelector(".task-text").onclick = function () {
    li.classList.toggle("completed");
    saveTasks();
  };

  // DELETE TASK
  li.querySelector(".delete-btn").onclick = function () {
    li.remove();
    saveTasks();
  };

  // ADD DRAG EVENTS
  addDragEvents(li);

  list.appendChild(li);
}

// =====================
// DRAG & DROP
// =====================
function addDragEvents(item) {
  item.addEventListener("dragstart", function () {
    draggedItem = item;
    setTimeout(() => (item.style.display = "none"), 0);
  });

  item.addEventListener("dragend", function () {
    setTimeout(() => {
      item.style.display = "flex";
      draggedItem = null;
      saveTasks();
    }, 0);
  });

  item.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  item.addEventListener("drop", function () {
    if (draggedItem !== item) {
      let allItems = [...list.children];
      let draggedIndex = allItems.indexOf(draggedItem);
      let droppedIndex = allItems.indexOf(item);

      if (draggedIndex < droppedIndex) {
        item.after(draggedItem);
      } else {
        item.before(draggedItem);
      }
    }
  });
}

// =====================
// SAVE TASKS
// =====================
function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text").innerText,
      completed: li.classList.contains("completed"),
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =====================
// DARK MODE TOGGLE
// =====================
toggleBtn.onclick = function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
    toggleBtn.innerText = "☀️";
  } else {
    localStorage.setItem("mode", "light");
    toggleBtn.innerText = "🌙";
  }
};
