// --- STATE MANAGEMENT (Local Storage) ---
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let links = JSON.parse(localStorage.getItem('links')) || [];
let userName = localStorage.getItem('userName') || '';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGreeting();
    initClock();
    renderTodos();
    renderLinks();
});

// --- CHALLENGE 1: Light/Dark Mode ---
const themeToggleBtn = document.getElementById('theme-toggle');
function initTheme() {
    if (isDarkMode) document.body.classList.add('dark-mode');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
}

// --- CLOCK & GREETING ---
const timeDisplay = document.getElementById('time-display');
const dateDisplay = document.getElementById('date-display');
const greetingText = document.getElementById('greeting-text');
const nameInput = document.getElementById('name-input');

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dateDisplay.textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const hour = now.getHours();
    if (hour < 12) greetingText.textContent = "Good morning";
    else if (hour < 18) greetingText.textContent = "Good afternoon";
    else greetingText.textContent = "Good evening";
}

// --- CHALLENGE 2: Custom Name ---
function initGreeting() {
    nameInput.value = userName;
    nameInput.addEventListener('input', (e) => {
        userName = e.target.value;
        localStorage.setItem('userName', userName);
    });
}

// --- FOCUS TIMER ---
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('timer-start');
const btnStop = document.getElementById('timer-stop');
const btnReset = document.getElementById('timer-reset');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

btnStart.addEventListener('click', () => {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            alert("Focus session complete!");
        }
    }, 1000);
});

btnStop.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
});

btnReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// --- TO-DO LIST ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span style="cursor:pointer;" onclick="toggleTodo(${index})">${todo.text}</span>
            <div class="todo-actions">
                <button onclick="editTodo(${index})">Edit</button>
                <button class="danger" onclick="deleteTodo(${index})">Del</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    // CHALLENGE 4: Prevent duplicate tasks
    const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        alert("Task already exists!");
        return;
    }

    todos.push({ text, completed: false });
    todoInput.value = '';
    saveTodos();
});

window.toggleTodo = (index) => {
    todos[index].completed = !todos[index].completed;
    saveTodos();
};

window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveTodos();
};

window.editTodo = (index) => {
    const newText = prompt("Edit task:", todos[index].text);
    if (newText && newText.trim() !== "") {
        // Cek duplikasi saat edit
        const isDuplicate = todos.some((t, i) => i !== index && t.text.toLowerCase() === newText.trim().toLowerCase());
        if (isDuplicate) {
            alert("Task name already exists!");
            return;
        }
        todos[index].text = newText.trim();
        saveTodos();
    }
};

// --- QUICK LINKS ---
const linkForm = document.getElementById('link-form');
const linkName = document.getElementById('link-name');
const linkUrl = document.getElementById('link-url');
const linksContainer = document.getElementById('links-container');

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
}

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        
        div.innerHTML = `
            <a href="${link.url}" target="_blank" class="link-btn">${link.name}</a>
            <div class="link-delete" onclick="deleteLink(${index})">×</div>
        `;
        linksContainer.appendChild(div);
    });
}

linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let url = linkUrl.value.trim();
    const name = linkName.value.trim();
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    links.push({ name, url });
    linkName.value = '';
    linkUrl.value = '';
    saveLinks();
});

window.deleteLink = (index) => {
    links.splice(index, 1);
    saveLinks();
};