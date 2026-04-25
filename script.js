// Select the elements we need
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const taskList = document.getElementById('taskList');

//  Function to add a task
function addTask() {
    const taskValue = input.value;

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }
    const li = document.createElement('li');

    // 1. Create a span for the text (so we can click it to toggle)
    const taskText = document.createElement('span');
    taskText.textContent = taskValue;
    taskText.addEventListener('click', () => li.classList.toggle('completed'));

   // 2. Create a delete button for THIS specific task
    const delBtn = document.createElement('button');
    delBtn.textContent = "X";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener('click', () => li.remove());

    // 3. Put them both inside the <li>
    li.appendChild(taskText);
    li.appendChild(delBtn);

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
    taskList.innerHTML = "";
});