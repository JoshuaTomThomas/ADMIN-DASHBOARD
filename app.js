// --- DOM COMPONENT REGISTRY ---
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

// Preferences Configuration Fields Selector Targets
const settingTheme = document.getElementById('setting-theme');
const settingCity = document.getElementById('setting-city');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// Modal Elements
const modalOverlay = document.getElementById('hud-modal-overlay');
const modalDetailsBody = document.getElementById('modal-details-body');
const closeModalBtn = document.getElementById('close-modal-btn');

// Lockdown Interceptors
const lockdownScreen = document.getElementById('hud-lockdown-screen');
const clearLockdownBtn = document.getElementById('clear-lockdown-btn');
const manualLockdownTrigger = document.getElementById('trigger-lockdown-mock');
const sysStatusIndicator = document.getElementById('system-status-indicator');

let API_KEY = '';

// --- FEATURE 1: MATHEMATICAL WEB AUDIO OSCILLATOR SYNTH ---
function playCyberAcousticSynth(frequency = 880, duration = 0.08, type = 'sine') {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); // Standardized safe output volume profile
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Audio Context pipeline blocked by user interaction policies.");
    }
}

// --- FEATURE 2: PERSISTENT PREFERENCES PROFILE ---
let userConfig = JSON.parse(localStorage.getItem('hud_user_config')) || {
    theme: 'cyan',
    defaultCity: ''
};

function enforceSavedConfig() {
    document.documentElement.setAttribute('theme', userConfig.theme);
    settingTheme.value = userConfig.theme;
    settingCity.value = userConfig.defaultCity;
}

saveSettingsBtn.addEventListener('click', () => {
    userConfig.theme = settingTheme.value;
    userConfig.defaultCity = settingCity.value.trim();
    localStorage.setItem('hud_user_config', JSON.stringify(userConfig));
    
    playCyberAcousticSynth(1100, 0.15);
    enforceSavedConfig();
    runAtmosphericFeedsEngine();
});

// --- FEATURE 3: REAL-TIME CANVAS TELEMETRY MATRIX WAVE ---
function triggerCanvasWaveFeed() {
    const canvas = document.getElementById('hud-telemetry-oscillator');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = Array(18).fill(20);

    setInterval(() => {
        nodes.shift();
        nodes.push(Math.floor(Math.random() * 30) + 5);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 1.5;

        nodes.forEach((y, x) => {
            const posX = x * (canvas.width / (nodes.length - 1));
            if (x === 0) ctx.moveTo(posX, y);
            else ctx.lineTo(posX, y);
        });
        ctx.stroke();
    }, 250);
}

// --- FEATURE 4: BIOMETRIC TERMINAL LOCKDOWN SYSTEMS ---
function toggleLockdownMode(activate) {
    if (activate) {
        lockdownScreen.classList.remove('hidden');
        sysStatusIndicator.className = 'pulse-node-green lockdown-active';
        playCyberAcousticSynth(150, 0.6, 'sawtooth');
    } else {
        lockdownScreen.classList.add('hidden');
        sysStatusIndicator.className = 'pulse-node-green';
        playCyberAcousticSynth(900, 0.1, 'sine');
    }
}

manualLockdownTrigger.addEventListener('click', () => toggleLockdownMode(true));
clearLockdownBtn.addEventListener('click', () => toggleLockdownMode(false));

// --- FEATURE 5: DRAGGABLE WORKSPACE PANEL MECHANICS ---
function configureGridDragAndDrop() {
    const windows = document.querySelectorAll('.cyber-window-box');
    const columns = document.querySelectorAll('.hud-column-wrapper');
    
    windows.forEach(win => {
        win.setAttribute('draggable', 'true');
        win.addEventListener('dragstart', () => {
            win.classList.add('dragging');
            playCyberAcousticSynth(650, 0.05);
        });
        win.addEventListener('dragend', () => {
            win.classList.remove('dragging');
            playCyberAcousticSynth(850, 0.05);
        });
    });

    columns.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });
        col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        col.addEventListener('drop', () => {
            col.classList.remove('drag-over');
            const movingBox = document.querySelector('.cyber-window-box.dragging');
            if (movingBox) col.appendChild(movingBox);
        });
    });
}

// --- CORE SYSTEM CHRONOMETER ENGINE ---
function executeSystemClock() {
    clockEl.innerText = new Date().toLocaleTimeString();
}
setInterval(executeSystemClock, 1000);
executeSystemClock();

// --- STATE MANAGEMENT AND REACTIVE GRAPH CORES ---
let tasks = JSON.parse(localStorage.getItem('hud_matrix_tasks')) || [];

function synchroniseGlobalMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;

    const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
    document.documentElement.style.setProperty('--completion-rate', `${completionPercentage}%`);

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
            <div style="display:flex;">
                <button onclick="inspectTaskMetadata(${index})">INFO</button>
                <button onclick="deleteTask(${index})">✕</button>
            </div>
        `;
        todoList.appendChild(li);
    });
    synchroniseGlobalMetrics();
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    
    // Security check: simulate lockdown on dangerous strings
    if (taskText.toUpperCase() === 'TRIGGER LOCKDOWN') {
        todoInput.value = '';
        toggleLockdownMode(true);
        return;
    }

    if (taskText) {
        tasks.push({ 
            text: taskText, 
            completed: false,
            timestamp: new Date().toLocaleString(),
            id: 'VEC_' + Math.floor(Math.random() * 90000 + 10000)
        });
        todoInput.value = '';
        playCyberAcousticSynth(950, 0.08);
        saveAndRenderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    playCyberAcousticSynth(550, 0.04);
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    playCyberAcousticSynth(400, 0.1);
    saveAndRenderTasks();
};

window.inspectTaskMetadata = function(index) {
    const item = tasks[index];
    playCyberAcousticSynth(750, 0.06);
    
    modalDetailsBody.innerHTML = `
        <p style="margin-bottom:8px;"><strong>VECTOR ID:</strong> <span style="color:var(--neon-cyan);">${item.id}</span></p>
        <p style="margin-bottom:8px;"><strong>OPERATIONAL VECTOR MESSAGE:</strong> "${item.text}"</p>
        <p style="margin-bottom:8px;"><strong>REGISTRY TIMESTAMP:</strong> ${item.timestamp}</p>
        <p><strong>PIPELINE ENFORCEMENT:</strong> ${item.completed ? '<span style="color:var(--neon-green);">COMPLETED</span>' : '<span style="color:var(--neon-pink);">STAGED_STANDBY</span>'}</p>
    `;
    modalOverlay.classList.remove('hidden');
};

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    playCyberAcousticSynth(480, 0.05);
});

// --- GEOLOCATION SENSOR TELEMETRY UPDATES ---
function requestDeviceCoordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function runAtmosphericFeedsEngine() {
    if (!API_KEY) return;

    try {
        let fetchUrl = '';
        if (userConfig.defaultCity) {
            fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userConfig.defaultCity}&appid=${API_KEY}&units=metric`;
        } else {
            const positioning = await requestDeviceCoordinates().catch(() => null);
            if (positioning) {
                fetchUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${positioning.coords.latitude}&lon=${positioning.coords.longitude}&appid=${API_KEY}&units=metric`;
            } else {
                fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}&units=metric`;
            }
        }

        const payload = await fetch(fetchUrl);
        if (!payload.ok) throw new Error();
        const data = await payload.json();

        weatherDisplay.innerHTML = `
            <h3>${data.name.toUpperCase()}</h3>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase; font-size: 0.8rem; color: #6784ab;">Metrics: ${data.weather[0].description}</p>
        `;

        document.querySelectorAll('.sync-temp-field').forEach(field => {
            field.innerText = `${Math.round(data.main.temp)}°C`;
        });

        syncTimeEl.innerText = `Last updated: ${new Date().toLocaleTimeString()}`;

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: var(--neon-pink);">FEED TRANSCEIVER BREAK</p>`;
    }
}

// Single Page Navigation Event Setup
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        playCyberAcousticSynth(800, 0.04);
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

import('./config.js')
    .then(config => {
        API_KEY = config.WEATHER_API_KEY;
        runAtmosphericFeedsEngine();
        setInterval(runAtmosphericFeedsEngine, 600000);
    })
    .catch(() => {
        API_KEY = localStorage.getItem('weather_api_key');
        if (!API_KEY) {
            API_KEY = prompt("Enter OpenWeather API Key:");
            if (API_KEY) localStorage.setItem('weather_api_key', API_KEY);
        }
        runAtmosphericFeedsEngine();
        setInterval(runAtmosphericFeedsEngine, 600000);
    });

// Run deployment bootstrap routines
enforceSavedConfig();
saveAndRenderTasks();
triggerCanvasWaveFeed();
configureGridDragAndDrop();