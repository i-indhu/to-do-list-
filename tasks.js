document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const addButton = document.getElementById("addTaskButton");
    const modal = document.getElementById("taskModal");
    const closeButton = document.getElementById("closeModal");
    const cancelButton = document.getElementById("cancelTask");

    const taskForm = document.getElementById("taskForm");
    const taskListContainer = document.getElementById("taskListContainer");

    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const saveTaskBtn = document.getElementById("saveTaskBtn");

    const searchInput = document.getElementById("taskSearch");
    const filterTabs = document.getElementById("filterTabs");

    let tasks = Storage.getTasks();
    let activeFilter = "all";
    let searchTerm = "";
    let editingId = null;


    // ==========================================
    // OPEN / CLOSE MODAL
    // ==========================================

    function openModalForAdd() {
        editingId = null;
        taskForm.reset();
        document.getElementById("taskPriority").value = "medium";
        document.getElementById("taskCategory").value = "personal";
        modalTitle.textContent = "Add New Task";
        modalSubtitle.textContent = "Plan your next task and keep your day organized.";
        saveTaskBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
        modal.classList.add("show");
    }

    function openModalForEdit(task) {
        editingId = task.id;
        document.getElementById("taskName").value = task.name;
        document.getElementById("taskDescription").value = task.description || "";
        document.getElementById("taskDate").value = task.date || "";
        document.getElementById("taskTime").value = task.time || "";
        document.getElementById("taskPriority").value = task.priority || "medium";
        document.getElementById("taskCategory").value = task.category || "personal";
        modalTitle.textContent = "Edit Task";
        modalSubtitle.textContent = "Update the details of this task.";
        saveTaskBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
        modal.classList.add("show");
    }

    function closeModal() {
        modal.classList.remove("show");
        editingId = null;
    }

    addButton.addEventListener("click", openModalForAdd);
    closeButton.addEventListener("click", closeModal);
    cancelButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });


    // ==========================================
    // ADD / SAVE TASK
    // ==========================================

    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const taskName = document.getElementById("taskName").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const taskDate = document.getElementById("taskDate").value;
        const taskTime = document.getElementById("taskTime").value;
        const priority = document.getElementById("taskPriority").value;
        const category = document.getElementById("taskCategory").value;

        if (taskName === "") {
            alert("Please enter a task name.");
            return;
        }

        if (editingId) {

            const task = tasks.find(function (t) { return t.id === editingId; });

            if (task) {
                task.name = taskName;
                task.description = description;
                task.date = taskDate;
                task.time = taskTime;
                task.priority = priority;
                task.category = category;
            }

        } else {

            tasks.push({
                id: generateId(),
                name: taskName,
                description: description,
                date: taskDate,
                time: taskTime,
                priority: priority,
                category: category,
                completed: false
            });

        }

        Storage.saveTasks(tasks);
        renderTasks();
        taskForm.reset();
        closeModal();

    });


    // ==========================================
    // RENDER TASKS
    // ==========================================

    function matchesFilter(task) {

        if (activeFilter === "today") return isToday(task.date);
        if (activeFilter === "week") return isThisWeek(task.date);
        if (activeFilter === "month") return isThisMonth(task.date);
        return true;

    }

    function matchesSearch(task) {

        if (!searchTerm) return true;

        const haystack = (task.name + " " + (task.description || "")).toLowerCase();
        return haystack.includes(searchTerm);

    }

    function renderTasks() {

        const visible = tasks
            .filter(matchesFilter)
            .filter(matchesSearch)
            .sort(function (a, b) {
                return (a.date || "9999").localeCompare(b.date || "9999");
            });

        taskListContainer.innerHTML = "";

        if (visible.length === 0) {

            taskListContainer.innerHTML = `
                <div class="empty-tasks">
                    <i class="fa-solid fa-list-check"></i>
                    <h3>No tasks found</h3>
                    <p>${tasks.length === 0 ? 'Click "Add Task" to create your first task.' : "Try a different filter or search term."}</p>
                </div>
            `;

            updateCounters();
            return;

        }

        visible.forEach(function (task) {

            const taskElement = document.createElement("div");
            taskElement.className = "todo-item" + (task.completed ? " completed-task" : "");

            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>

                <div class="todo-content">
                    <h3>${escapeHTML(task.name)}</h3>

                    ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ""}

                    <div class="todo-details">
                        <span><i class="fa-regular fa-calendar"></i> ${formatDate(task.date)}</span>
                        ${task.time ? `<span><i class="fa-regular fa-clock"></i> ${formatTime(task.time)}</span>` : ""}
                        <span class="priority-${task.priority}">${capitalize(task.priority)}</span>
                        <span class="category-tag">${categoryLabel(task.category)}</span>
                    </div>
                </div>

                <div class="todo-actions">
                    <button type="button" class="todo-menu edit-task" data-id="${task.id}" title="Edit task">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" class="todo-menu delete-task" data-id="${task.id}" title="Delete task">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            taskListContainer.appendChild(taskElement);

        });

        updateCounters();

    }


    // ==========================================
    // COMPLETE / EDIT / DELETE (event delegation)
    // ==========================================

    taskListContainer.addEventListener("change", function (event) {

        if (!event.target.classList.contains("task-checkbox")) return;

        const id = event.target.dataset.id;
        const task = tasks.find(function (t) { return t.id === id; });

        if (!task) return;

        task.completed = event.target.checked;
        Storage.saveTasks(tasks);
        renderTasks();

    });

    taskListContainer.addEventListener("click", function (event) {

        const editBtn = event.target.closest(".edit-task");
        const deleteBtn = event.target.closest(".delete-task");

        if (editBtn) {
            const task = tasks.find(function (t) { return t.id === editBtn.dataset.id; });
            if (task) openModalForEdit(task);
            return;
        }

        if (deleteBtn) {

            const shouldDelete = confirm("Are you sure you want to delete this task?");
            if (!shouldDelete) return;

            tasks = tasks.filter(function (t) { return t.id !== deleteBtn.dataset.id; });
            Storage.saveTasks(tasks);
            renderTasks();

        }

    });


    // ==========================================
    // FILTERS + SEARCH
    // ==========================================

    filterTabs.addEventListener("click", function (event) {

        const tab = event.target.closest(".filter-tab");
        if (!tab) return;

        filterTabs.querySelectorAll(".filter-tab").forEach(function (t) {
            t.classList.remove("active");
        });

        tab.classList.add("active");
        activeFilter = tab.dataset.filter;
        renderTasks();

    });

    searchInput.addEventListener("input", function () {
        searchTerm = searchInput.value.trim().toLowerCase();
        renderTasks();
    });


    // ==========================================
    // COUNTERS
    // ==========================================

    function updateCounters() {

        const total = tasks.length;
        const completed = tasks.filter(function (t) { return t.completed; }).length;
        const inProgress = total - completed;

        document.getElementById("statTotal").textContent = total;
        document.getElementById("statProgress").textContent = inProgress;
        document.getElementById("statCompleted").textContent = completed;

    }


    // ==========================================
    // DEEP LINK — #today opens Today filter
    // ==========================================

    if (window.location.hash === "#today") {

        filterTabs.querySelectorAll(".filter-tab").forEach(function (t) {
            t.classList.toggle("active", t.dataset.filter === "today");
        });

        activeFilter = "today";

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    renderTasks();

});
