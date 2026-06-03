// --- DOM CORE COMPONENT REGISTRY ---
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

// Preferences Selector Input Targets
const settingTheme = document.getElementById('setting-theme');
const settingCity = document.getElementById('setting-city');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// Inspection Modals Nodes
const modalOverlay = document.getElementById('hud-modal-overlay');
const modalDetailsBody = document.getElementById('modal-details-body');
const closeModalBtn = document.getElementById('close-modal-btn');

let API_KEY = '';

// --- 1. NATIVE WEB AUDIO FREQUENCY SYNTHESIZER ---
function triggerAudioBeepSynth(frequency = 880, duration = 0.08) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); // Safe output volume boundary
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Audio thread context blocked by native user initialization policies.");
    }
}

// --- 2. SINGLE PAGE DISPATCH APP PREFERENCES ---
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
    
    triggerAudioBeepSynth(1100, 0.15);
    enforceSavedConfig();
    runAtmosphericFeedsEngine();
});

// --- 3. ADVANCED VISUALIZATION CHANNELS (PURE CANVAS RENDERING) ---

// A. Real-Time Sparkline Trend Oscillator Line Graph Engine
let sparklinePoints = Array(15).fill(20);
function drawRealTimeSparkline() {
    const canvas = document.getElementById('hud-line-sparkgraph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Shift coordinates leftward and append fresh randomized operational fluctuations
    sparklinePoints.shift();
    sparklinePoints.push(Math.floor(Math.random() * 25) + 5);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 1.5;

    sparklinePoints.forEach((val, index) => {
        const x = index * (canvas.width / (sparklinePoints.length - 1));
        if (index === 0) ctx.moveTo(x, val);
        else ctx.lineTo(x, val);
    });
    ctx.stroke();
}
setInterval(drawRealTimeSparkline, 400);

// B. Dynamic Operational Load Distribution Pie Chart Engine
function drawReactivePieChart() {
    const canvas = document.getElementById('hud-pie-distribution');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fallback draw loop if registry contains zero vector items
    if (total === 0) {
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0,243,255,0.2)';
        ctx.lineWidth = 4;
        ctx.stroke();
        return;
    }

    const completedAngle = (completed / total) * 2 * Math.PI;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Slice 1: Completed Tasks Arc (Neon Green Highlight)
    if (completedAngle > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 18, 0, completedAngle);
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    // Slice 2: Pending Tasks Arc (Neon Cyan Theme Highlight)
    if (completedAngle < 2 * Math.PI) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 18, completedAngle, 2 * Math.PI);
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

// C. 3D Mathematical Projected Rotating Earth Globe Wireframe Engine
let globeRotationAngle = 0;
function drawProjectedWireframeGlobe() {
    const canvas = document.getElementById('hud-matrix-globe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = 45;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    globeRotationAngle += 0.015;

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 1;

    // Draw Outer Sphere Boundary Profiler Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Mathematically render horizontal Latitude Ring Strips
    for (let lat = -5; lat <= 5; lat++) {
        const h = radius * Math.sin((lat * Math.PI) / 12);
        const r = radius * Math.cos((lat * Math.PI) / 12);
        
        ctx.beginPath();
        ctx.ellipse(cx, cy + h, r, r * 0.25, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Mathematically render rotating vertical Longitude Ring Strips
    for (let lon = 0; lon < 6; lon++) {
        const localAngle = globeRotationAngle + (lon * Math.PI) / 3;
        const w = radius * Math.sin(localAngle);
        
        // Hide backing perspective strokes to achieve clear 3D projection look
        if (Math.cos(localAngle) > 0) {
            ctx.beginPath();
            ctx.ellipse(cx, cy, Math.abs(w), radius, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
setInterval(drawProjectedWireframeGlobe, 30);

// --- 4. DATA STATE MANAGEMENT CONTROL ENGINE ---
let tasks = JSON.parse(localStorage.getItem('hud_matrix_tasks')) || [];

function synchroniseGlobalMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;

    // Inject layout tracking custom properties down to root styles
    const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
    document.documentElement.style.setProperty('--completion-rate', `${completionPercentage}%`);

    document.querySelectorAll('.sync-total-field').forEach(field => {
        field.innerText = total;
    });

    // Re-trigger Canvas Pie Chart render cycles dynamically on state variations
    drawReactivePieChart();
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
    if (taskText) {
        tasks.push({ 
            text: taskText, 
            completed: false,
            timestamp: new Date().toLocaleString(),
            id: 'VEC_' + Math.floor(Math.random() * 90000 + 10000)
        });
        todoInput.value = '';
        triggerAudioBeepSynth(950, 0.08);
        saveAndRenderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    triggerAudioBeepSynth(550, 0.04);
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    triggerAudioBeepSynth(400, 0.1);
    saveAndRenderTasks();
};

window.inspectTaskMetadata = function(index) {
    const item = tasks[index];
    triggerAudioBeepSynth(750, 0.06);
    
    modalDetailsBody.innerHTML = `
        <p style="margin-bottom:8px;"><strong>VECTOR ID:</strong> <span style="color:var(--neon-cyan);">${item.id}</span></p>
        <p style="margin-bottom:8px;"><strong>OPERATIONAL DISPATCH DATA:</strong> "${item.text}"</p>
        <p style="margin-bottom:8px;"><strong>REGISTRY TIMESTAMP:</strong> ${item.timestamp}</p>
        <p><strong>PIPELINE ENFORCEMENT:</strong> ${item.completed ? '<span style="color:var(--neon-green);">COMPLETED</span>' : '<span style="color:var(--neon-pink);">STAGED_STANDBY</span>'}</p>
    `;
    modalOverlay.classList.remove('hidden');
};

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    triggerAudioBeepSynth(480, 0.05);
});

// --- 5. DRAGGABLE WORKSPACE PANEL MECHANICS ---
function configureGridDragAndDrop() {
    const windows = document.querySelectorAll('.cyber-window-box');
    const columns = document.querySelectorAll('.hud-column-wrapper');
    
    windows.forEach(win => {
        win.setAttribute('draggable', 'true');
        win.addEventListener('dragstart', () => {
            win.classList.add('dragging');
            triggerAudioBeepSynth(650, 0.05);
        });
        win.addEventListener('dragend', () => {
            win.classList.remove('dragging');
            triggerAudioBeepSynth(850, 0.05);
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

// --- ATMOSPHERIC TELEMETRY SENSOR ROUTINES ---
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
            <h3>${data.name.toUpperCase()} DATA HUB</h3>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase; font-size: 0.8rem; color: #6c86a8;">Metrics: ${data.weather[0].description}</p>
        `;

        document.querySelectorAll('.sync-temp-field').forEach(field => {
            field.innerText = `${Math.round(data.main.temp)}°C`;
        });

        syncTimeEl.innerText = `Last updated: ${new Date().toLocaleTimeString()}`;

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: var(--neon-pink);">FEED TRANSCEIVER FAIL</p>`;
    }
}

// Single-Page Routing Click Inits
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        triggerAudioBeepSynth(800, 0.04);
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

// Chronometer Loop
function executeSystemClock() {
    clockEl.innerText = new Date().toLocaleTimeString();
}
setInterval(executeSystemClock, 1000);
executeSystemClock();

// Bootstrap Orchestration Profile Hook
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

// Execute startup sequences
enforceSavedConfig();
saveAndRenderTasks();
configureGridDragAndDrop();