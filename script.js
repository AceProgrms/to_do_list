// 1. Select the elements we need
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const taskList = document.getElementById('taskList');

// 2. Function to add a task
function addTask() {
    const taskValue = input.value;

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    // Create a new list item
    const li = document.createElement('li');
    li.textContent = taskValue;

    // Logic to "Tick Off" (Toggle CSS class)
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    // Logic to "Remove" (Right-click to delete)
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Stop the menu from popping up
        li.remove();
    });

    // Add the item to the list and clear input
    taskList.appendChild(li);
    input.value = "";
}

addBtn.addEventListener('click', addTask);

// Press Enter key
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

//removeBtn funtionality
removeBtn.addEventListener('click', () =>
{
    taskList.remove()
});