// ==========================================
// 1. CORE DOM REGISTRY & APP INITIALIZATION
// ==========================================
const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const weatherDisplay = document.getElementById('weather-display');
const syncTimeEl = document.getElementById('sync-time');

const statTotalTasks = document.getElementById('stat-total-tasks');
const statCompletedTasks = document.getElementById('stat-completed-tasks');

const settingTheme = document.getElementById('setting-theme');
const settingCity = document.getElementById('setting-city');
const saveSettingsBtn = document.getElementById('save-settings-btn');

const modalOverlay = document.getElementById('hud-modal-overlay');
const modalDetailsBody = document.getElementById('modal-details-body');
const closeModalBtn = document.getElementById('close-modal-btn');

let API_KEY = '';

// Minimal matrix representation of Earth's landmasses for the vector canvas globe
const WORLD_MAP_VECTORS = [
    [-20, 10, 15], [-40, -60, 20], [20, 30, 25], [40, -100, 30], 
    [-10, -50, 18], [0, 20, 12], [50, 15, 22], [60, -100, 28],
    [-30, 130, 15], [35, 100, 25], [10, 115, 18], [-25, 25, 14]
];

// Custom Safe Synthesizer Tone Generation via native Web Audio API
function triggerAudioBeep(frequency = 800, duration = 0.06) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime); 
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Log quietly if user has not yet interacted with the browser document window
    }
}

// ==========================================
// 2. HIGH-DENSITY CANVAS GRAPHICS ENGINE
// ==========================================

// A. 3D Spherical Coordinate Earth Projection Map Vector Globe
let globeRotation = 0;
function renderFuturisticGlobe() {
    const canvas = document.getElementById('hud-matrix-globe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 42;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    globeRotation += 0.015;

    // Get theme color dynamically
    const neonColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-cyan').trim() || '#00f3ff';

    // Base Atmospheric Wireframe Outer Limit Boundary Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = neonColor.replace(')', ', 0.2)').replace('rgb', 'rgba');
    ctx.lineWidth = 1;
    ctx.stroke();

    // Render Geometric Latitude Grid Line Arrays
    ctx.strokeStyle = neonColor.replace(')', ', 0.1)').replace('rgb', 'rgba');
    for (let i = -4; i <= 4; i++) {
        const latHeight = radius * Math.sin((i * Math.PI) / 10);
        const latRadius = radius * Math.cos((i * Math.PI) / 10);
        ctx.beginPath();
        ctx.ellipse(cx, cy + latHeight, latRadius, latRadius * 0.2, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Render Rotating Projected Vector Landmass Matrix Points
    WORLD_MAP_VECTORS.forEach(point => {
        let lat = point[0] * (Math.PI / 180);
        let lon = point[1] * (Math.PI / 180) + globeRotation;
        let pRadius = point[2];

        // 3D Spherical Transform Matrix Projection Conversion
        let x = radius * Math.cos(lat) * Math.sin(lon);
        let y = radius * Math.sin(lat);
        let z = radius * Math.cos(lat) * Math.cos(lon);

        // Render point coordinates only if situated on front hemisphere perspective horizon
        if (z > 0) {
            ctx.beginPath();
            ctx.arc(cx + x, cy + y, pRadius * 0.15, 0, 2 * Math.PI);
            ctx.fillStyle = neonColor;
            ctx.fill();
            
            // Render structural technical bounding crosshair ticks around points
            ctx.strokeStyle = neonColor.replace(')', ', 0.3)').replace('rgb', 'rgba');
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx + x - 3, cy + y); ctx.lineTo(cx + x + 3, cy + y);
            ctx.moveTo(cx + x, cy + y - 3); ctx.lineTo(cx + x, cy + y + 3);
            ctx.stroke();
        }
    });
}
setInterval(renderFuturisticGlobe, 33);

// B. Continuous Non-Blocking Sparkline Trend Line Plotter
let sparklineCoordinates = Array(12).fill(20);
function plotSparklineMatrix() {
    const canvas = document.getElementById('hud-line-sparkgraph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const neonColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-cyan').trim() || '#00f3ff';

    sparklineCoordinates.shift();
    sparklineCoordinates.push(Math.floor(Math.random() * 22) + 6);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 1.5;

    sparklineCoordinates.forEach((val, i) => {
        const x = i * (canvas.width / (sparklineCoordinates.length - 1));
        if (i === 0) ctx.moveTo(x, val);
        else ctx.lineTo(x, val);
    });
    ctx.stroke();
}
setInterval(plotSparklineMatrix, 350);

// C. Operational Distribution Allocation Dynamic Pie Chart Sub-System
function renderDistributionPieChart() {
    const canvas = document.getElementById('hud-pie-distribution');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const neonColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-cyan').trim() || '#00f3ff';

    if (total === 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
        ctx.lineWidth = 4;
        ctx.stroke();
        return;
    }

    const completedAngleSlice = (completed / total) * 2 * Math.PI;

    // Drawing Sector Array 1: Completed Task Metrics Allocation
    if (completedAngleSlice > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, completedAngleSlice);
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    // Drawing Sector Array 2: Pending Operation Stack Allocation
    if (completedAngleSlice < 2 * Math.PI) {
        ctx.beginPath();
        ctx.arc(cx, cy, 16, completedAngleSlice, 2 * Math.PI);
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

// ==========================================
// 3. APPLICATION RUNTIME REACTION STATE ENGINE
// ==========================================
let tasks = JSON.parse(localStorage.getItem('hud_matrix_tasks')) || [];

function synchroniseGlobalMetrics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    statTotalTasks.innerText = total;
    statCompletedTasks.innerText = completed;

    const rate = total > 0 ? (completed / total) * 100 : 0;
    document.documentElement.style.setProperty('--completion-rate', `${rate}%`);

    document.querySelectorAll('.sync-total-field').forEach(field => {
        field.innerText = total;
    });

    renderDistributionPieChart();
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
            <div style="display:flex; gap: 4px;">
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
        triggerAudioBeep(900, 0.08);
        saveAndRenderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    triggerAudioBeep(600, 0.05);
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    triggerAudioBeep(450, 0.1);
    saveAndRenderTasks();
};

window.inspectTaskMetadata = function(index) {
    const item = tasks[index];
    triggerAudioBeep(750, 0.06);
    
    modalDetailsBody.innerHTML = `
        <p style="margin-bottom:8px;"><strong>VECTOR ID:</strong> <span style="color:var(--neon-cyan);">${item.id}</span></p>
        <p style="margin-bottom:8px;"><strong>DISPATCH PARAMS:</strong> "${item.text}"</p>
        <p style="margin-bottom:8px;"><strong>REGISTRY TIMESTAMP:</strong> ${item.timestamp}</p>
        <p><strong>PIPELINE ENFORCEMENT:</strong> ${item.completed ? '<span style="color:#00ff66; text-shadow: 0 0 5px #00ff66;">COMPLETED</span>' : '<span style="color:var(--neon-pink);">STAGED_STANDBY</span>'}</p>
    `;
    modalOverlay.classList.remove('hidden');
};

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
        triggerAudioBeep(480, 0.05);
    });
}

// ==========================================
// 4. CONFIG MANAGERS & USER SELECTIONS
// ==========================================
let userConfig = JSON.parse(localStorage.getItem('hud_user_config')) || {
    theme: 'cyan',
    defaultCity: ''
};

function enforceSavedConfig() {
    document.documentElement.setAttribute('theme', userConfig.theme);
    if(settingTheme) settingTheme.value = userConfig.theme;
    if(settingCity) settingCity.value = userConfig.defaultCity;
}

if(saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        userConfig.theme = settingTheme.value;
        userConfig.defaultCity = settingCity.value.trim();
        localStorage.setItem('hud_user_config', JSON.stringify(userConfig));
        
        triggerAudioBeep(1000, 0.12);
        enforceSavedConfig();
        runAtmosphericFeedsEngine();
    });
}

// ==========================================
// 5. ASYNC SENSOR GEOLOCATION WEATHER LINK
// ==========================================
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
            fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(userConfig.defaultCity)}&appid=${API_KEY}&units=metric`;
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
            <h3 style="font-family:var(--font-display); font-size:1.1rem; color:var(--neon-cyan); text-transform:uppercase;">${data.name}</h3>
            <h1 style="font-family:var(--font-display); font-size:2.4rem; font-weight:900; margin:4px 0;">${Math.round(data.main.temp)}°C</h1>
            <p style="text-transform: uppercase; font-size: 0.8rem; color: var(--text-secondary-dim);">TELEMETRY: ${data.weather[0].description}</p>
            <p style="font-size: 0.75rem; color: #435c7e; margin-top: 2px;">HUMIDITY: ${data.main.humidity}% | WIND: ${data.wind.speed} m/s</p>
        `;

        document.querySelectorAll('.sync-temp-field').forEach(field => {
            field.innerText = `${Math.round(data.main.temp)}°C`;
        });

        syncTimeEl.innerText = `Last updated: ${new Date().toLocaleTimeString()}`;

    } catch (err) {
        weatherDisplay.innerHTML = `<p style="color: var(--neon-pink); font-size:0.85rem;">TRANSCEIVER TIMEOUT FAULT</p>`;
    }
}

// ==========================================
// 6. DRAGGABLE HUD DESKTOP GRID SYSTEMS
// ==========================================
function configureGridDragAndDrop() {
    const windows = document.querySelectorAll('.cyber-window-box');
    const columns = document.querySelectorAll('.hud-column-wrapper');
    
    windows.forEach(win => {
        win.addEventListener('dragstart', () => {
            win.classList.add('dragging');
            triggerAudioBeep(650, 0.04);
        });
        win.addEventListener('dragend', () => {
            win.classList.remove('dragging');
            triggerAudioBeep(850, 0.04);
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

// Single-Page View Panel Layout Swapping Toggles
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        triggerAudioBeep(780, 0.05);
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const targetPanelId = item.getAttribute('data-target');
        document.querySelectorAll('.dashboard-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const activePanel = document.getElementById(targetPanelId);
        if(activePanel) activePanel.classList.add('active');
    });
});

// App Clock Chronometer Engine Loop
function runSystemClock() {
    if(clockEl) clockEl.innerText = new Date().toLocaleTimeString();
}
setInterval(runSystemClock, 1000);
runSystemClock();

// Bootloader Initialization Routing Bridge
import('./config.js')
    .then(config => {
        API_KEY = config.WEATHER_API_KEY;
        runAtmosphericFeedsEngine();
        setInterval(runAtmosphericFeedsEngine, 600000);
    })
    .catch(() => {
        API_KEY = localStorage.getItem('weather_api_key');
        if (!API_KEY) {
            API_KEY = prompt("Enter OpenWeather Map Telemetry API Key:");
            if (API_KEY) localStorage.setItem('weather_api_key', API_KEY);
        }
        runAtmosphericFeedsEngine();
        setInterval(runAtmosphericFeedsEngine, 600000);
    });

// Execute initial interface composition cycles
enforceSavedConfig();
saveAndRenderTasks();
configureGridDragAndDrop();