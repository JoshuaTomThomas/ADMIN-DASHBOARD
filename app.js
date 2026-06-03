// --- DOM COMPONENT REGISTRY ---
const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const weatherDisplay = document.getElementById('weather-display');
const syncTimeEl = document.getElementById('sync-time');

// KPI Counters Targets
const statTotalTasks = document.getElementById('stat-total-tasks');
const statCompletedTasks = document.getElementById('stat-completed-tasks');

let API_KEY = '';

// --- CHRONOMETER TERMINAL TIMER ---
function executeSystemClock() {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
    
    const hours = now.getHours();
    if (hours < 12) greetingEl.innerText = "Systems Online // Admin";
    else if (hours < 18) greetingEl.innerText = "Systems Online // Admin";
    else greetingEl.innerText = "Systems Online // Admin";
}
setInterval(executeSystemClock, 1000);
executeSystemClock();

// --- STATE INTEGRITY OPERATIONS ---
let tasks = JSON.parse(localStorage.getItem('hud_matrix_tasks')) || [];

function synchroniseGlobalMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    // Push updates to primary tracking labels
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;

    // Synchronize cross-widget values seamlessly
    document.querySelectorAll('.sync-total-field').forEach(field => {
        field.innerText = total;
    });
}

function saveAndRenderTasks() {
    localStorage.setItem('hud_matrix_tasks', JSON.stringify(tasks));
    todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const completedClass = task.completed ? 'class="completed-task"' : '';
        
        li.innerHTML = `
            <span ${completedClass} onclick="toggleTask(${index})">
                ${task.text}
            </span>
            <button onclick="deleteTask(${index})">✕</button>
        `;
        todoList.appendChild(li);
    });
    synchroniseGlobalMetrics();
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

// --- GEOLOCATION SENSOR UPDATER ARRAYS ---
function requestDeviceCoordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function runAtmosphericFeedsEngine() {
    if (!API_KEY) return;

    try {
        const positioning = await requestDeviceCoordinates();
        const payload = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${positioning.coords.latitude}&lon=${positioning.coords.longitude}&appid=${API_KEY}&units=metric`
        );
        if (!payload.ok) throw new Error("Broadcast line broke");
        const data = await payload.json();

        // Render data inside HUD telemetry boxes
        weatherDisplay.innerHTML = `
            <h3>${data.name.toUpperCase()}</h3>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase; font-size: 0.8rem; color: #708cb2;">Metrics: ${data.weather[0].description}</p>
            <p style="font-size: 0.75rem; color: #4b6380; margin-top: 2px;">Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
        `;

        // Update temperature metrics across different dashboard segments
        document.querySelectorAll('.sync-temp-field').forEach(field => {
            field.innerText = `${Math.round(data.main.temp)}°C`;
        });

        const now = new Date();
        syncTimeEl.innerText = `Last updated: ${now.toLocaleTimeString()}`;

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: #ff0055; font-size:0.85rem;">Feeds sync fault.</p>`;
        console.error(err);
    }
}

// Config Dynamic Initializers
import('./config.js')
    .then(config => {
        API_KEY = config.WEATHER_API_KEY;
        runAtmosphericFeedsEngine();
        setInterval(runAtmosphericFeedsEngine, 600000); // 10 Min Polling Cycle
    })
    .catch(() => {
        weatherDisplay.innerHTML = `<p style="color: #eab308; font-size:0.75rem;">Awaiting local profile key registration...</p>`;
        API_KEY = localStorage.getItem('weather_api_key');
        if (!API_KEY) {
            API_KEY = prompt("Enter Tac-Com Weather API Key:");
            if (API_KEY) {
                localStorage.setItem('weather_api_key', API_KEY);
                location.reload();
            }
        } else {
            runAtmosphericFeedsEngine();
            setInterval(runAtmosphericFeedsEngine, 600000);
        }
    });

// Run standard layout build orders
saveAndRenderTasks();