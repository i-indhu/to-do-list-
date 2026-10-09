document.addEventListener("DOMContentLoaded", function () {

    const grid = document.getElementById("projectsGrid");
    const addButton = document.getElementById("addProjectButton");

    const modal = document.getElementById("projectModal");
    const closeButton = document.getElementById("closeModal");
    const cancelButton = document.getElementById("cancelProject");
    const form = document.getElementById("projectForm");
    const modalTitle = document.getElementById("modalTitle");
    const saveBtn = document.getElementById("saveProjectBtn");
    const colorPicker = document.getElementById("colorPicker");

    let projects = Storage.getProjects();
    let selectedColor = "#3157e1";
    let editingId = null;


    // ==========================================
    // COLOUR PICKER
    // ==========================================

    colorPicker.addEventListener("click", function (event) {

        const swatch = event.target.closest(".color-swatch");
        if (!swatch) return;

        colorPicker.querySelectorAll(".color-swatch").forEach(function (s) {
            s.classList.remove("selected");
        });

        swatch.classList.add("selected");
        selectedColor = swatch.dataset.color;

    });


    // ==========================================
    // MODAL
    // ==========================================

    function openModalForAdd() {
        editingId = null;
        form.reset();
        selectedColor = "#3157e1";
        colorPicker.querySelectorAll(".color-swatch").forEach(function (s, i) {
            s.classList.toggle("selected", i === 0);
        });
        modalTitle.textContent = "New Project";
        saveBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Create Project';
        modal.classList.add("show");
    }

    function openModalForEdit(project) {
        editingId = project.id;
        document.getElementById("projectName").value = project.name;
        document.getElementById("projectDescription").value = project.description || "";
        selectedColor = project.color;
        colorPicker.querySelectorAll(".color-swatch").forEach(function (s) {
            s.classList.toggle("selected", s.dataset.color === project.color);
        });
        modalTitle.textContent = "Edit Project";
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
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
        if (event.target === modal) closeModal();
    });

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("projectName").value.trim();
        const description = document.getElementById("projectDescription").value.trim();

        if (name === "") {
            alert("Please enter a project name.");
            return;
        }

        if (editingId) {

            const project = projects.find(function (p) { return p.id === editingId; });

            if (project) {
                project.name = name;
                project.description = description;
                project.color = selectedColor;
            }

        } else {

            projects.push({
                id: generateId(),
                name: name,
                description: description,
                color: selectedColor,
                subtasks: [],
                createdAt: todayISO()
            });

        }

        Storage.saveProjects(projects);
        render();
        form.reset();
        closeModal();

    });


    // ==========================================
    // RENDER
    // ==========================================

    function render() {

        grid.innerHTML = "";

        if (projects.length === 0) {

            grid.innerHTML = `
                <div class="empty-tasks" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-folder-open"></i>
                    <h3>No projects yet</h3>
                    <p>Click "New Project" to organise your bigger work.</p>
                </div>
            `;

            return;

        }

        projects.forEach(function (project) {

            const subtasks = project.subtasks || [];
            const doneCount = subtasks.filter(function (s) { return s.done; }).length;
            const progress = subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : 0;

            const card = document.createElement("div");
            card.className = "project-card";

            let subtasksHTML = "";

            subtasks.forEach(function (s) {
                subtasksHTML += `
                    <div class="project-subtask ${s.done ? "done" : ""}">
                        <input type="checkbox" class="subtask-check" data-project="${project.id}" data-subtask="${s.id}" ${s.done ? "checked" : ""}>
                        <span>${escapeHTML(s.text)}</span>
                        <button type="button" class="todo-menu delete-subtask" data-project="${project.id}" data-subtask="${s.id}" style="margin-left:auto;width:26px;height:26px;">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="project-card-top">
                    <div style="display:flex; align-items:flex-start; gap:10px;">
                        <div class="project-dot" style="background:${project.color}"></div>
                        <div>
                            <h3>${escapeHTML(project.name)}</h3>
                        </div>
                    </div>
                    <div class="project-card-menu">
                        <button type="button" class="todo-menu edit-project" data-id="${project.id}" title="Edit project">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="todo-menu delete-project" data-id="${project.id}" title="Delete project">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>

                ${project.description ? `<p>${escapeHTML(project.description)}</p>` : ""}

                <div class="project-progress-track">
                    <div class="project-progress-fill" style="width:${progress}%; background:${project.color}"></div>
                </div>

                <div class="project-meta">
                    <span>${doneCount}/${subtasks.length} done</span>
                    <span>${progress}%</span>
                </div>

                <div class="project-subtasks">
                    ${subtasksHTML}
                </div>

                <div class="add-subtask-row">
                    <input type="text" placeholder="Add a subtask..." class="new-subtask-input" data-project="${project.id}">
                    <button type="button" class="add-subtask-btn" data-project="${project.id}">Add</button>
                </div>
            `;

            grid.appendChild(card);

        });

    }


    // ==========================================
    // EVENTS (delegated)
    // ==========================================

    grid.addEventListener("click", function (event) {

        const editBtn = event.target.closest(".edit-project");
        const deleteBtn = event.target.closest(".delete-project");
        const deleteSubBtn = event.target.closest(".delete-subtask");
        const addSubBtn = event.target.closest(".add-subtask-btn");

        if (editBtn) {
            const project = projects.find(function (p) { return p.id === editBtn.dataset.id; });
            if (project) openModalForEdit(project);
            return;
        }

        if (deleteBtn) {
            const confirmed = confirm("Delete this project and all its subtasks?");
            if (!confirmed) return;
            projects = projects.filter(function (p) { return p.id !== deleteBtn.dataset.id; });
            Storage.saveProjects(projects);
            render();
            return;
        }

        if (deleteSubBtn) {
            const project = projects.find(function (p) { return p.id === deleteSubBtn.dataset.project; });
            if (!project) return;
            project.subtasks = project.subtasks.filter(function (s) { return s.id !== deleteSubBtn.dataset.subtask; });
            Storage.saveProjects(projects);
            render();
            return;
        }

        if (addSubBtn) {
            const input = grid.querySelector(`.new-subtask-input[data-project="${addSubBtn.dataset.project}"]`);
            addSubtask(addSubBtn.dataset.project, input);
        }

    });

    grid.addEventListener("keydown", function (event) {

        if (event.key === "Enter" && event.target.classList.contains("new-subtask-input")) {
            event.preventDefault();
            addSubtask(event.target.dataset.project, event.target);
        }

    });

    grid.addEventListener("change", function (event) {

        if (!event.target.classList.contains("subtask-check")) return;

        const project = projects.find(function (p) { return p.id === event.target.dataset.project; });
        if (!project) return;

        const subtask = project.subtasks.find(function (s) { return s.id === event.target.dataset.subtask; });
        if (!subtask) return;

        subtask.done = event.target.checked;
        Storage.saveProjects(projects);
        render();

    });

    function addSubtask(projectId, inputEl) {

        const text = inputEl.value.trim();
        if (text === "") return;

        const project = projects.find(function (p) { return p.id === projectId; });
        if (!project) return;

        project.subtasks = project.subtasks || [];
        project.subtasks.push({ id: generateId(), text: text, done: false });

        Storage.saveProjects(projects);
        render();

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    render();

});
