// Select the elements we need
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const taskList = document.getElementById('taskList');

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li span').forEach(span => {
        tasks.push(span.textContent);
    });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// Function to render a task
function renderTask(text) {
    const li = document.createElement('li');

    // Create a span for the text (so we can click it to toggle)
    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    // Create a delete button for THIS specific task
    const delBtn = document.createElement('button');
    delBtn.textContent = "X";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });

    // Put them both inside the <li>
    li.appendChild(taskText);
    li.appendChild(delBtn);

    taskList.appendChild(li);
}

// Load tasks from localStorage on page load
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('myTasks'));
    if (savedTasks) {
        savedTasks.forEach(taskText => {
            renderTask(taskText);
        });
    }
}

// Add task button click
addBtn.addEventListener('click', () => {
    if (input.value !== "") {
        renderTask(input.value);
        saveTasks();
        input.value = "";
    }
});

// Press Enter key
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value !== "") {
        renderTask(input.value);
        saveTasks();
        input.value = "";
    }
});

// Clear all tasks button
removeBtn.addEventListener('click', () => {
    taskList.innerHTML = "";
    localStorage.removeItem('myTasks');
});

// Load saved tasks on startup
loadTasks();