console.log("JS CONNECTED");
const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const filterSelect = document.getElementById("filter");
const deleteAllBtn = document.getElementById("delete-all");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(list = tasks) {
    taskList.innerHTML = "";

    if (list.length === 0) {
        taskList.innerHTML =
            `<tr><td colspan="4" class="empty">No tasks found</td></tr>`;
        return;
    }

    list.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.text}</td>
            <td>${task.date}</td>
            <td>
                <span class="${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td>
                <button class="complete-btn">✓</button>
                <button class="delete-btn">✕</button>
            </td>
        `;

        row.querySelector(".complete-btn").addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        row.querySelector(".delete-btn").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(row);
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (!text || !date) {
        alert("Please fill all fields!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    });

    saveTasks();
    renderTasks();
    form.reset();
});

deleteAllBtn.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

filterSelect.addEventListener("change", function () {
    const today = new Date().toISOString().split("T")[0];

    if (this.value === "today") {
        renderTasks(tasks.filter(t => t.date === today));
    } else if (this.value === "upcoming") {
        renderTasks(tasks.filter(t => t.date > today));
    } else if (this.value === "completed") {
        renderTasks(tasks.filter(t => t.completed));
    } else {
        renderTasks();
    }
});

/* ===== THEME ===== */

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
}

themeToggle.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
    }
});

renderTasks();
