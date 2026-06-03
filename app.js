// --- DOM CORE ELEMENT REGISTRY ---
const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const weatherDisplay = document.getElementById('weather-display');
const syncTimeEl = document.getElementById('sync-time');

// KPI Counters Selectors
const statTotalTasks = document.getElementById('stat-total-tasks');
const statCompletedTasks = document.getElementById('stat-completed-tasks');
const statTemp = document.getElementById('stat-temp');

// SFX Element Handles
const sfxClick = document.getElementById('sfx-click');
const sfxDeploy = document.getElementById('sfx-deploy');
const sfxAlert = document.getElementById('sfx-alert');

let API_KEY = '';

// --- FEATURE 1: HOLOGRAPHIC TOAST ALERTS ENGINE ---
function triggerHudNotification(message, type = 'error') {
    const toastZone = document.getElementById('hud-toast-zone');
    const toast = document.createElement('div');
    toast.className = `hud-toast ${type}`;
    toast.innerText = `> ${message}`;
    
    toastZone.appendChild(toast);
    
    if (type === 'error') sfxAlert.cloneNode(true).play().catch(() => {});
    else sfxDeploy.cloneNode(true).play().catch(() => {});

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// --- FEATURE 2: DYNAMIC ROUTING & SFX STREAM ---
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.dashboard-panel');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Play click audio signature cleanly
        sfxClick.cloneNode(true).play().catch(() => {});

        navItems.forEach(nav => nav.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));

        item.classList.add('active');
        const targetPanel = item.getAttribute('data-target');
        document.getElementById(targetPanel).classList.add('active');
        
        triggerHudNotification(`MapsD TO SYSTEM SEGMENT: ${targetPanel.toUpperCase()}`, 'success');
    });
});

// --- FEATURE 3: LIVE REACTION DIAGNOSTICS MACHINE ---
function computePerformanceStream() {
    const cpuAFill = document.getElementById('cpu-a-bar');
    const cpuBFill = document.getElementById('cpu-b-bar');
    const cpuAText = document.getElementById('cpu-a-text');
    const cpuBText = document.getElementById('cpu-b-text');

    if (!cpuAFill || !cpuBFill) return;

    setInterval(() => {
        const randLoadA = Math.floor(Math.random() * 45) + 20; // 20% - 65%
        const randLoadB = Math.floor(Math.random() * 60) + 15; // 15% - 75%

        cpuAFill.style.width = `${randLoadA}%`;
        cpuBFill.style.width = `${randLoadB}%`;
        cpuAText.innerText = `${randLoadA}%`;
        cpuBText.innerText = `${randLoadB}%`;
    }, 2500);
}

// --- CORE SYSTEM CHRONOMETER ENGINE ---
function updateClock() {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
    
    const hours = now.getHours();
    if (hours < 12) greetingEl.innerText = "SYSTEMS ONLINE // GOOD MORNING, OPERATOR";
    else if (hours < 18) greetingEl.innerText = "SYSTEMS ONLINE // GOOD AFTERNOON, OPERATOR";
    else greetingEl.innerText = "SYSTEMS ONLINE // GOOD EVENING, OPERATOR";
}
setInterval(updateClock, 1000);
updateClock();

// --- STATE MANAGEMENT PIPELINE ---
let tasks = JSON.parse(localStorage.getItem('hud_tasks')) || [];

function calculateMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;
}

function saveAndRenderTasks() {
    localStorage.setItem('hud_tasks', JSON.stringify(tasks));
    todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const completedClass = task.completed ? 'class="completed-task"' : '';
        
        li.innerHTML = `
            <span ${completedClass} onclick="toggleTask(${index})" style="cursor: pointer; flex: 1;">
                ${task.text}
            </span>
            <button onclick="deleteTask(${index})">PURGE_</button>
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
        triggerHudNotification("NEW DATA PIPELINE DEPLOYED SUCCESSFULLY", "success");
    } else {
        triggerHudNotification("INPUT EMPTY // DEPLOYMENT ABORTED");
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRenderTasks();
    sfxClick.cloneNode(true).play().catch(() => {});
    triggerHudNotification(`PIPELINE STATE RECONFIGURED AT NODE: [${index}]`, "success");
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRenderTasks();
    triggerHudNotification(`DATA RECORD PURGED FROM MAIN INDEX: [${index}]`);
};

// --- AUTOMATED SENSOR WEATHER FEEDS ---
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

        weatherDisplay.innerHTML = `
            <h3>${data.name.toUpperCase()} SENSOR FEED</h3>
            <h1 style="font-size: 2.8rem; margin: 10px 0; color: #00f3ff; font-family: 'Orbitron';">${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase;">CONDITION // ${data.weather[0].description}</p>
            <p style="color: #506b8e; font-size: 0.9rem; margin-top: 5px;">HUMIDITY: ${data.main.humidity}% | VELOCITY: ${data.wind.speed} M/S</p>
        `;

        statTemp.innerText = `${Math.round(data.main.temp)}°C`;
        const timeNow = new Date();
        syncTimeEl.innerText = `LAST COMPILATION: ${timeNow.toLocaleTimeString()}`;
        triggerHudNotification("GLOBAL WEATHER METRIC SYNC COMPLETED", "success");

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: #ff0055;">ERROR STREAMING ATMOSPHERIC FEED.</p>`;
        triggerHudNotification("CRITICAL FEEDS OVERFLOW // DATA SYNC FAULT");
        console.error(err);
    }
}

// Config Profiler Validation
import('./config.js')
    .then(config => {
        API_KEY = config.WEATHER_API_KEY;
        fetchWeatherEngine();
        setInterval(fetchWeatherEngine, 600000);
    })
    .catch(() => {
        weatherDisplay.innerHTML = `<p style="color: #ef4444;">AWAITING LOCAL CONFIG PROFILER VALUE...</p>`;
        API_KEY = localStorage.getItem('weather_api_key');
        if (!API_KEY) {
            API_KEY = prompt("ENTER TAC-COM OPENWEATHER KEY:");
            if (API_KEY) {
                localStorage.setItem('weather_api_key', API_KEY);
                location.reload();
            }
        } else {
            fetchWeatherEngine();
            setInterval(fetchWeatherEngine, 600000);
        }
    });

// Initial Dashboard Boot execution hooks
saveAndRenderTasks();
computePerformanceStream();
  