document.addEventListener("DOMContentLoaded", function () {

    const grid = document.getElementById("notesGrid");

    const modal = document.getElementById("noteModal");
    const closeButton = document.getElementById("closeModal");
    const cancelButton = document.getElementById("cancelNote");
    const form = document.getElementById("noteForm");
    const modalTitle = document.getElementById("modalTitle");
    const saveBtn = document.getElementById("saveNoteBtn");
    const colorPicker = document.getElementById("colorPicker");
    const noteText = document.getElementById("noteText");

    let notes = Storage.getNotes();
    let selectedColor = "#fff8d7";
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
        selectedColor = "#fff8d7";
        colorPicker.querySelectorAll(".color-swatch").forEach(function (s, i) {
            s.classList.toggle("selected", i === 0);
        });
        modalTitle.textContent = "New Note";
        saveBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Note';
        modal.classList.add("show");
        setTimeout(function () { noteText.focus(); }, 50);
    }

    function openModalForEdit(note) {
        editingId = note.id;
        noteText.value = note.text;
        selectedColor = note.color;
        colorPicker.querySelectorAll(".color-swatch").forEach(function (s) {
            s.classList.toggle("selected", s.dataset.color === note.color);
        });
        modalTitle.textContent = "Edit Note";
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
        modal.classList.add("show");
    }

    function closeModal() {
        modal.classList.remove("show");
        editingId = null;
    }

    closeButton.addEventListener("click", closeModal);
    cancelButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModal();
    });

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = noteText.value.trim();

        if (text === "") {
            alert("Please write something for the note.");
            return;
        }

        if (editingId) {

            const note = notes.find(function (n) { return n.id === editingId; });

            if (note) {
                note.text = text;
                note.color = selectedColor;
            }

        } else {

            notes.unshift({
                id: generateId(),
                text: text,
                color: selectedColor,
                createdAt: todayISO()
            });

        }

        Storage.saveNotes(notes);
        render();
        form.reset();
        closeModal();

    });


    // ==========================================
    // RENDER
    // ==========================================

    function render() {

        grid.innerHTML = "";

        const addCard = document.createElement("button");
        addCard.type = "button";
        addCard.className = "add-note-card";
        addCard.innerHTML = `<i class="fa-solid fa-plus"></i><span>Add a note</span>`;
        addCard.addEventListener("click", openModalForAdd);
        grid.appendChild(addCard);

        notes.forEach(function (note) {

            const card = document.createElement("div");
            card.className = "sticky-note";
            card.style.background = note.color;

            card.innerHTML = `
                <div class="sticky-note-text">${escapeHTML(note.text)}</div>
                <div class="sticky-note-footer">
                    <span class="sticky-note-date">${formatDateShort(note.createdAt)}</span>
                    <div class="sticky-note-actions">
                        <button type="button" class="edit-note" data-id="${note.id}" title="Edit note">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="delete-note" data-id="${note.id}" title="Delete note">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            grid.appendChild(card);

        });

    }

    grid.addEventListener("click", function (event) {

        const editBtn = event.target.closest(".edit-note");
        const deleteBtn = event.target.closest(".delete-note");

        if (editBtn) {
            const note = notes.find(function (n) { return n.id === editBtn.dataset.id; });
            if (note) openModalForEdit(note);
            return;
        }

        if (deleteBtn) {
            const confirmed = confirm("Delete this note?");
            if (!confirmed) return;
            notes = notes.filter(function (n) { return n.id !== deleteBtn.dataset.id; });
            Storage.saveNotes(notes);
            render();
        }

    });


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    render();

});
