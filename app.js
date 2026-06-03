// DOM Element Handles
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

let API_KEY = '';

// --- 1. SYSTEM HOLOGRAPHIC NOTIFICATION ROUTINE ---
function deployHudAlert(message, alertType = 'error') {
    const alertDeck = document.getElementById('hud-alert-deck');
    const alertBox = document.createElement('div');
    alertBox.className = `hud-alert-capsule ${alertType}`;
    alertBox.innerText = `> ${message}`;
    
    alertDeck.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(12px)';
        alertBox.style.transition = 'all 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)';
        setTimeout(() => alertBox.remove(), 400);
    }, 4000);
}

// --- 2. MULTI-PANEL VIEWPORT ROUTER ---
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.dashboard-panel');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));

        item.classList.add('active');
        const targetPanel = item.getAttribute('data-target');
        document.getElementById(targetPanel).classList.add('active');
        
        deployHudAlert(`ROUTING STREAM TO COMPONENT: ${targetPanel.toUpperCase()}`, 'success');
    });
});

// --- 3. CANVAS REALTIME GRAPH MATRIX (Pure Canvas Drawing) ---
function initCanvasWaveOscillator() {
    const canvas = document.getElementById('realtime-line-graph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let points = Array(20).fill(22);

    setInterval(() => {
        // Shift metrics leftward and append new random sensor inputs
        points.shift();
        points.push(Math.floor(Math.random() * 35) + 5);

        // Wipe current canvas frame clean
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw HUD Neon Wave Outline
        ctx.beginPath();
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff66';

        points.forEach((y, x) => {
            const posX = x * (canvas.width / (points.length - 1));
            if (x === 0) ctx.moveTo(posX, y);
            else ctx.lineTo(posX, y);
        });

        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shading engine
    }, 200);
}

// --- SYSTEM CHRONOMETER TRACKING ---
function processSystemClock() {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
    
    const hours = now.getHours();
    if (hours < 12) greetingEl.innerText = "SYSTEMS OPERATIONAL // GOOD MORNING, ADMIN";
    else if (hours < 18) greetingEl.innerText = "SYSTEMS OPERATIONAL // GOOD AFTERNOON, ADMIN";
    else greetingEl.innerText = "SYSTEMS OPERATIONAL // GOOD EVENING, ADMIN";
}
setInterval(processSystemClock, 1000);
processSystemClock();

// --- OPERATIONAL COMPONENT STATE CONTROL ---
let tasks = JSON.parse(localStorage.getItem('terminal_tasks')) || [];

function calculateMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;
}

function saveAndRenderTasks() {
    localStorage.setItem('terminal_tasks', JSON.stringify(tasks));
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
        deployHudAlert("NEW OPERATIONAL MATRIX VECTOR DEPLOYED", "success");
    } else {
        deployHudAlert("INPUT EMPTY // DISPATCH ABORTED");
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRenderTasks();
    deployHudAlert(`VECTOR MATRIX OVERRIDE COMPLETED AT NODE [${index}]`, "success");
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRenderTasks();
    deployHudAlert(`OPERATIONAL VECTOR RECORD PURGED FROM MAIN LOGS: [${index}]`);
};

// --- AUTOMATED SENSOR WEATHER FEEDS ---
function fetchLocationTelemetry() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function fetchAtmosphericSensorStream() {
    if (!API_KEY) return;

    try {
        const coords = await fetchLocationTelemetry();
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.coords.latitude}&lon=${coords.coords.longitude}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error("Telemetry broadcast broken");
        const data = await res.json();

        // Update atmospheric readout components
        weatherDisplay.innerHTML = `
            <h3>${data.name.toUpperCase()} DATA RECON TERMINAL</h3>
            <h1 style="font-size: 2.8rem; margin: 12px 0; color: #00f3ff; font-family: 'Orbitron';">${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase; font-size: 0.95rem;">METRIC CONDITION // ${data.weather[0].description}</p>
            <p style="color: #4e678a; font-size: 0.9rem; margin-top: 6px;">HUMIDITY LAYER: ${data.main.humidity}% | WIND SPEED: ${data.wind.speed} M/S</p>
        `;

        statTemp.innerText = `${Math.round(data.main.temp)}°C`;
        const timestamp = new Date();
        syncTimeEl.innerText = `LAST COMPILATION: ${timestamp.toLocaleTimeString()}`;
        deployHudAlert("ATMOSPHERIC DATA RECON METRICS LINK SYNCHRONIZED", "success");

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: #ff0055;">CRITICAL ATMOSPHERIC FEED SYNC FAILURE.</p>`;
        deployHudAlert("CORE TRANSCEIVER SENSOR SYNC FAULT DETECTED");
        console.error(err);
    }
}

// Config Dynamic Initializers Execution
import('./config.js')
    .then(config => {
        API_KEY = config.WEATHER_API_KEY;
        fetchAtmosphericSensorStream();
        setInterval(fetchAtmosphericSensorStream, 600000); // 10 Min Polling Engine
    })
    .catch(() => {
        weatherDisplay.innerHTML = `<p style="color: #ff0055;">AWAITING LOCAL SECURE PROFILE VALUE...</p>`;
        API_KEY = localStorage.getItem('weather_api_key');
        if (!API_KEY) {
            API_KEY = prompt("ENTER SYSTEM OPENWEATHER KEY:");
            if (API_KEY) {
                localStorage.setItem('weather_api_key', API_KEY);
                location.reload();
            }
        } else {
            fetchAtmosphericSensorStream();
            setInterval(fetchAtmosphericSensorStream, 600000);
        }
    });

// Initial boot execution hooks
saveAndRenderTasks();
initCanvasWaveOscillator();