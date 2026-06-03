// DOM Element Registry
const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const weatherDisplay = document.getElementById('weather-display');
const syncTimeEl = document.getElementById('sync-time');

// Metric Selectors
const statTotalTasks = document.getElementById('stat-total-tasks');
const statCompletedTasks = document.getElementById('stat-completed-tasks');
const statTemp = document.getElementById('stat-temp');

let API_KEY = '';

// --- 1. SINGLE PAGE ROUTING CONTROLLER ---
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.dashboard-panel');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));

        item.classList.add('active');
        const targetPanel = item.getAttribute('data-target');
        document.getElementById(targetPanel).classList.add('active');
    });
});

// --- 2. CLOCK & CRON COUNTER ---
function updateClock() {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
    
    const hours = now.getHours();
    if (hours < 12) greetingEl.innerText = "Systems Online // Good Morning, Admin";
    else if (hours < 18) greetingEl.innerText = "Systems Online // Good Afternoon, Admin";
    else greetingEl.innerText = "Systems Online // Good Evening, Admin";
}
setInterval(updateClock, 1000);
updateClock();

// --- 3. STATE AND DATA METRICS ---
let tasks = JSON.parse(localStorage.getItem('admin_tasks')) || [];

function calculateMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;
}

function saveAndRenderTasks() {
    localStorage.setItem('admin_tasks', JSON.stringify(tasks));
    todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const completedClass = task.completed ? 'class="completed-task"' : '';
        
        li.innerHTML = `
            <span ${completedClass} onclick="toggleTask(${index})" style="cursor: pointer; flex: 1;">
                ${task.text}
            </span>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        todoList.appendChild(li);
    });
    calculateMetrics();
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        todoInput.value = '';
        saveAndRenderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRenderTasks();
};

// --- 4. ENGINE WEATHER CONTROLLER (POLLING AUTOMATION) ---
function getCoords() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function fetchWeatherEngine() {
    if (!API_KEY) return;

    try {
        const geo = await getCoords();
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${geo.coords.latitude}&lon=${geo.coords.longitude}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error("API stream broken");
        const data = await res.json();

        // Update Weather Panel Interface
        weatherDisplay.innerHTML = `
            <h3>${data.name}</h3>
            <h1 style="font-size: 3rem; margin: 10px 0; color: #3b82f6;">${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: capitalize;">Condition: ${data.weather[0].description}</p>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 5px;">Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
        `;

        // Update Overview Analytics Counters
        statTemp.innerText = `${Math.round(data.main.temp)}°C`;
        
        // Timestamp Tracking
        const timeNow = new Date();
        syncTimeEl.innerText = `Last updated: ${timeNow.toLocaleTimeString()}`;

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: #ef4444;">Error mapping metrics feed.</p>`;
        console.error(err);
    }
}

// Dynamic Bootstrap Entry Hook
import('./config.js')
    .then(config => {
        API_KEY = config.WEATHER_API_KEY;
        fetchWeatherEngine();
        // Set up polling interval: 10 minutes = 600,000 milliseconds
        setInterval(fetchWeatherEngine, 600000);
    })
    .catch(() => {
        weatherDisplay.innerHTML = `<p style="color: #eab308;">Awaiting local config.js profile validation...</p>`;
        API_KEY = localStorage.getItem('weather_api_key');
        if (!API_KEY) {
            API_KEY = prompt("Enter OpenWeatherMap Key:");
            if (API_KEY) {
                localStorage.setItem('weather_api_key', API_KEY);
                location.reload();
            }
        } else {
            fetchWeatherEngine();
            setInterval(fetchWeatherEngine, 600000);
        }
    });

// Initial Startup Calls
saveAndRenderTasks();
  