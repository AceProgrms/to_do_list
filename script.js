
  /* ────────────────────────────────────────────
     State
  ──────────────────────────────────────────── */
  let tasks = [];
  let activeFilter = 'all';

  /* ────────────────────────────────────────────
     Persistence
  ──────────────────────────────────────────── */
  function saveTasks() {
    localStorage.setItem('taskboard-tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const raw = localStorage.getItem('taskboard-tasks');
    tasks = raw ? JSON.parse(raw) : [];
  }

  /* ────────────────────────────────────────────
     Helpers
  ──────────────────────────────────────────── */
  function formatDate(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function getFiltered() {
    if (activeFilter === 'active')    return tasks.filter(t => !t.completed);
    if (activeFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }

  /* ────────────────────────────────────────────
     Render a single task → <li>
  ──────────────────────────────────────────── */
  function renderTask(taskObj) {
    const li = document.createElement('li');
    li.className = 'task-item' + (taskObj.completed ? ' completed' : '');
    li.setAttribute('role', 'listitem');
    li.dataset.id = taskObj.id;

    li.innerHTML = `
      <div class="check-wrap" aria-hidden="true">
        <svg class="check-icon" viewBox="0 0 12 10">
          <polyline points="1.5,5.5 4.5,8.5 10.5,1.5"/>
        </svg>
      </div>

      <div class="task-body">
        <div class="task-text">${escapeHTML(taskObj.text)}</div>
        <div class="task-date">${formatDate(taskObj.date)}</div>
      </div>

      <button class="delete-btn" aria-label="Delete task" title="Delete">
        <svg viewBox="0 0 14 14">
          <line x1="2" y1="2" x2="12" y2="12"/>
          <line x1="12" y1="2" x2="2" y2="12"/>
        </svg>
      </button>
    `;

    /* Toggle completed */
    li.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn')) return;
      toggleTask(taskObj.id);
    });

    /* Delete */
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(taskObj.id);
    });

    return li;
  }

  /* ────────────────────────────────────────────
     Full render pass
  ──────────────────────────────────────────── */
  function renderAll() {
    const list  = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');
    const filtered = getFiltered();

    list.innerHTML = '';

    if (filtered.length === 0) {
      empty.classList.add('visible');
    } else {
      empty.classList.remove('visible');
      filtered.forEach(t => list.appendChild(renderTask(t)));
    }

    updateMeta();
  }

  function updateMeta() {
    const total     = tasks.length;
    const done      = tasks.filter(t => t.completed).length;
    const remaining = total - done;

    document.getElementById('task-count').textContent =
      total === 1 ? '1 task' : `${total} tasks`;

    document.getElementById('footer-info').textContent =
      total === 0 ? '' : `${remaining} remaining`;

    const clearBtn = document.getElementById('clear-btn');
    clearBtn.disabled = done === 0;
  }

  /* ────────────────────────────────────────────
     Actions
  ──────────────────────────────────────────── */
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const task = {
      id:        crypto.randomUUID(),
      text:      trimmed,
      date:      Date.now(),
      completed: false
    };

    tasks.unshift(task);
    saveTasks();
    renderAll();
  }

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    renderAll();
  }

  function deleteTask(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.style.transition = 'opacity 0.15s, transform 0.15s';
      li.style.opacity = '0';
      li.style.transform = 'translateX(8px)';
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderAll();
      }, 150);
    }
  }

  function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderAll();
  }

  /* ────────────────────────────────────────────
     Utility
  ──────────────────────────────────────────── */
  function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ────────────────────────────────────────────
     Event Listeners
  ──────────────────────────────────────────── */
  document.getElementById('add-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  document.getElementById('task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask(e.target.value);
      e.target.value = '';
    }
  });

  document.getElementById('clear-btn').addEventListener('click', clearCompleted);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderAll();
    });
  });

  /* ────────────────────────────────────────────
     Boot
  ──────────────────────────────────────────── */
  loadTasks();
  renderAll();
