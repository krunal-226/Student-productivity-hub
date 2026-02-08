// ===============================
// GLOBAL VARIABLES (Pomodoro)
// ===============================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || 0;
let focusSessions = JSON.parse(localStorage.getItem("focusSessions")) || 0;
let totalFocusTime = JSON.parse(localStorage.getItem("totalFocusTime")) || 0;
let time = 25 * 60;        // 25 minutes in seconds
let timerInterval = null;  
let isFocus = true;        // true = focus, false = break


// ===============================
// POMODORO SESSION STORAGE
// ===============================

// Get today's date (used as key)
function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

// Load today's session data
function loadSessionData() {
    const data = JSON.parse(localStorage.getItem("pomodoroData")) || {};
    const today = getTodayKey();

    return data[today] || { sessions: 0, minutes: 0 };
}

// Save today's session data
function saveSessionData(sessionData) {
    const data = JSON.parse(localStorage.getItem("pomodoroData")) || {};
    const today = getTodayKey();

    data[today] = sessionData;
    localStorage.setItem("pomodoroData", JSON.stringify(data));
}

// Update UI display
function updateSessionDisplay() {
    const data = loadSessionData();
    document.getElementById("sessionCount").textContent = data.sessions;
    document.getElementById("focusTime").textContent = data.minutes;
}


// ===============================
// TASK MANAGEMENT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateSessionDisplay();
    updateTimerDisplay();
});

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") return;

    createTaskElement(taskText, false);
    saveTasks();
    input.value = "";
}

function createTaskElement(text, completed) {
    const li = document.createElement("li");
    li.textContent = text;

    if (completed) li.classList.add("completed");

    // Toggle complete
    li.onclick = function () {
        li.classList.toggle("completed");
        updateProgress();
        saveTasks();
    };

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = function (event) {
        event.stopPropagation();
        li.remove();
        saveTasks();
    };

    li.appendChild(delBtn);
    document.getElementById("taskList").appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgress();
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(task => createTaskElement(task.text, task.completed));
    updateProgress();
}


// ===============================
// DAILY PROGRESS COUNTER
// ===============================

function updateProgress() {
    const completed = document.querySelectorAll(".completed").length;
    document.getElementById("progressCount").textContent = completed;
}


// ===============================
// POMODORO TIMER
// ===============================

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        time--;
        updateTimerDisplay();

        if (time <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            // Save focus session
            if (isFocus) {
                let data = loadSessionData();
                data.sessions += 1;
                data.minutes += 25;
                saveSessionData(data);
                updateSessionDisplay();
                completeFocusSession();
            }

            // Switch mode
            isFocus = !isFocus;
            time = isFocus ? 25 * 60 : 5 * 60;

            alert(isFocus ? "Focus time! 📚" : "Break time! ☕");
            updateTimerDisplay();
        }

    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = 25 * 60;
    isFocus = true;
    updateTimerDisplay();
}


// ===============================
// TIMER DISPLAY
// ===============================

function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").textContent = minutes + ":" + seconds;
}
function updateProgress() {
  document.getElementById("completedCount").innerText = completedTasks;
  document.getElementById("remainingCount").innerText = tasks.length;
  document.getElementById("sessionCount").innerText = focusSessions;
  document.getElementById("totalTime").innerText = totalFocusTime;

  localStorage.setItem("completedTasks", completedTasks);
  localStorage.setItem("focusSessions", focusSessions);
  localStorage.setItem("totalFocusTime", totalFocusTime);
}
function completeFocusSession() {
    let completed = JSON.parse(localStorage.getItem("completedTasks")) || 0;
    completed += 1;
    localStorage.setItem("completedTasks", completed);

    document.getElementById("tasksCompleted").textContent = completed;
}document.addEventListener("DOMContentLoaded", () => {
    let completed = JSON.parse(localStorage.getItem("completedTasks")) || 0;
    document.getElementById("tasksCompleted").textContent = completed;

    updateSessionDisplay();
});