// DOM Elements
const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const weatherContainer = document.getElementById('weather-container');

// 1. REAL-TIME CLOCK & GREETING
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    
    // Format time to HH:MM:SS
    clockEl.innerText = now.toLocaleTimeString();

    // Dynamic Greeting based on time
    if (hours < 12) greetingEl.innerText = "Good Morning!";
    else if (hours < 18) greetingEl.innerText = "Good Afternoon!";
    else greetingEl.innerText = "Good Evening!";
}
setInterval(updateClock, 1000);
updateClock(); // Initial call


// 2. TO-DO LIST (WITH COMPLETION STATE)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveAndRenderTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Check if the task is completed to apply the CSS class
        const completedClass = task.completed ? 'class="completed-task"' : '';
        
        li.innerHTML = `
            <span ${completedClass} onclick="toggleTask(${index})" style="cursor: pointer; flex: 1;">
                ${task.text}
            </span>
            <button onclick="deleteTask(${index})">X</button>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText) {
        // Push an object instead of just a string
        tasks.push({ text: taskText, completed: false });
        todoInput.value = '';
        saveAndRenderTasks();
    }
});

// Toggle the completion status
window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRenderTasks();
};

// Initial render
saveAndRenderTasks();


// 3. DYNAMIC WEATHER API FETCH
let API_KEY = '';

// Try to load the key from a local config file if it exists
import('./config.js')
  .then(config => {
      API_KEY = config.WEATHER_API_KEY;
      fetchWeather(); // Run weather once the key is loaded
  })
  .catch(() => {
      console.log("No config.js found. Falling back to manual entry or prompt.");
      // Fallback: If no config file is found (like on GitHub Pages), 
      // you can check localStorage or prompt the user once.
      API_KEY = localStorage.getItem('weather_api_key');
      if (!API_KEY) {
          API_KEY = prompt("Please enter your OpenWeatherMap API Key to view weather data:");
          if (API_KEY) localStorage.setItem('weather_api_key', API_KEY);
      }
      if (API_KEY) fetchWeather();
  });

  