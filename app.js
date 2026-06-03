// --- DOM INTERFACE SELECTORS ---
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

// Preferences Selector Form Targets
const settingTheme = document.getElementById('setting-theme');
const settingCity = document.getElementById('setting-city');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// Modal Elements
const modalOverlay = document.getElementById('hud-modal-overlay');
const modalDetailsBody = document.getElementById('modal-details-body');
const closeModalBtn = document.getElementById('close-modal-btn');

let API_KEY = '';

// --- 1. WEB AUDIO API SYNTHESIZER NODES ---
function triggerSynthBeep(frequency = 880, duration = 0.08) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // Low safe volume footprint
        
        // Audio Node Stream Connections
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Audio Context pipeline blocked by user interaction restrictions.");
    }
}

// --- 2. PERSISTENT PREFERENCES MANAGER ---
let userConfig = JSON.parse(localStorage.getItem('hud_user_config')) || {
    theme: 'cyan',
    defaultCity: ''
};

function enforceSavedConfig() {
    // Apply theme variable directly to custom root attributes
    document.documentElement.setAttribute('theme', userConfig.theme);
    settingTheme.value = userConfig.theme;
    settingCity.value = userConfig.defaultCity;
}

saveSettingsBtn.addEventListener('click', () => {
    userConfig.theme = settingTheme.value;
    userConfig.defaultCity = settingCity.value.trim();
    localStorage.setItem('hud_user_config', JSON.stringify(userConfig));
    
    triggerSynthBeep(1200, 0.15);
    enforceSavedConfig();
    runAtmosphericFeedsEngine(); // Re-trigger weather logic with new local city preferences
});

// --- 3. STATE AND REACTIVE DATA CHARTS ENGINE ---
// Transition data models into structural object tracking components containing timestamps
let tasks = JSON.parse(localStorage.getItem('hud_matrix_tasks')) || [];

function synchroniseGlobalMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;

    // Calculate structural metrics and push variables down into the CSS layout tree
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
            <div style="display:flex; gap:10px; align-items:center;">
                <button onclick="inspectTaskMetadata(${index})" style="border-color:var(--neon-cyan); color:var(--neon-cyan);">INFO</button>
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
    if (taskText) {
        tasks.push({ 
            text: taskText, 
            completed: false,
            timestamp: new Date().toLocaleString(),
            id: 'VEC_' + Math.floor(Math.random() * 90000 + 10000)
        });
        todoInput.value = '';
        triggerSynthBeep(950, 0.1);
        saveAndRenderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    triggerSynthBeep(600, 0.05);
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    triggerSynthBeep(450, 0.12);
    saveAndRenderTasks();
};

// --- 4. INTERACTIVE TOOL META DIALOG PANEL ---
window.inspectTaskMetadata = function(index) {
    const item = tasks[index];
    triggerSynthBeep(800, 0.08);
    
    modalDetailsBody.innerHTML = `
        <p style="margin-bottom:10px;"><strong>VECTOR ID:</strong> <span style="color:var(--neon-cyan);">${item.id}</span></p>
        <p style="margin-bottom:10px;"><strong>OPERATIONAL DISPATCH MESSAGE:</strong> "${item.text}"</p>
        <p style="margin-bottom:10px;"><strong>REGISTRY TIMESTAMP:</strong> ${item.timestamp}</p>
        <p><strong>PIPELINE STATUS EXECUTION:</strong> ${item.completed ? '<span style="color:var(--neon-green);">COMPLETED</span>' : '<span style="color:var(--neon-pink);">STAGED_STANDBY</span>'}</p>
    `;
    modalOverlay.classList.remove('hidden');
};

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    triggerSynthBeep(500, 0.05);
});

// --- 5. DRAGGABLE LAYOUT GRID CONTROLLER ---
function configureGridDragAndDrop() {
    const windows = document.querySelectorAll('.cyber-window-box');
    const columns = document.querySelectorAll('.hud-column-wrapper');
    
    windows.forEach(win => {
        win.setAttribute('draggable', 'true');
        
        win.addEventListener('dragstart', () => {
            win.classList.add('dragging');
            triggerSynthBeep(700, 0.05);
        });
        
        win.addEventListener('dragend', () => {
            win.classList.remove('dragging');
            triggerSynthBeep(900, 0.05);
        });
    });

    columns.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });

        col.addEventListener('dragleave', () => {
            col.classList.remove('drag-over');
        });

        col.addEventListener('drop', () => {
            col.classList.remove('drag-over');
            const movingBox = document.querySelector('.cyber-window-box.dragging');
            if (movingBox) {
                col.appendChild(movingBox);
            }
        });
    });
}

// --- TELEMETRY WEATHER CONSOLE CORE ---
function requestDeviceCoordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function runAtmosphericFeedsEngine() {
    if (!API_KEY) return;

    try {
        let fetchUrl = '';
        
        // If a user saved a manual city target preference, prioritize it over browser geolocation tracking
        if (userConfig.defaultCity) {
            fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userConfig.defaultCity}&appid=${API_KEY}&units=metric`;
        } else {
            const positioning = await requestDeviceCoordinates().catch(() => null);
            if (positioning) {
                fetchUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${positioning.coords.latitude}&lon=${positioning.coords.longitude}&appid=${API_KEY}&units=metric`;
            } else {
                // Hard fallback if coordinates are restricted
                fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}&units=metric`;
            }
        }

        const payload = await fetch(fetchUrl);
        if (!payload.ok) throw new Error();
        const data = await payload.json();

        weatherDisplay.innerHTML = `
            <h3>${data.name.toUpperCase()} DATA STATION</h3>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase; font-size: 0.85rem; color: var(--neon-cyan);">Metrics: ${data.weather[0].description}</p>
        `;

        document.querySelectorAll('.sync-temp-field').forEach(field => {
            field.innerText = `${Math.round(data.main.temp)}°C`;
        });

        syncTimeEl.innerText = `Last updated: ${new Date().toLocaleTimeString()}`;

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color:var(--neon-pink);">FEED STREAM FAULT</p>`;
    }
}

// --- INITIAL SYSTEM CONTEXT BOOT CODES ---
function executeSystemClock() {
    clockEl.innerText = new Date().toLocaleTimeString();
}
setInterval(executeSystemClock, 1000);
executeSystemClock();

// Component Sub-routing Navigation Layout Signals
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        triggerSynthBeep(800, 0.05);
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
    });

// Initialize core routines
enforceSavedConfig();
saveAndRenderTasks();
configureGridDragAndDrop();