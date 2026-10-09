document.addEventListener("DOMContentLoaded", function () {

    const historyList = document.getElementById("historyList");
    const clearBtn = document.getElementById("clearHistoryBtn");
    const statCompleted = document.getElementById("statCompleted");
    const statRate = document.getElementById("statRate");

    let tasks = Storage.getTasks();

    function render() {

        const completed = tasks
            .filter(function (t) { return t.completed; })
            .sort(function (a, b) {
                return (b.date || "").localeCompare(a.date || "");
            });

        statCompleted.textContent = completed.length;
        const rate = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;
        statRate.textContent = rate + "%";

        historyList.innerHTML = "";

        if (completed.length === 0) {

            historyList.innerHTML = `
                <div class="empty-tasks">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <h3>No completed tasks yet</h3>
                    <p>Tasks you tick off in your Task List will show up here.</p>
                </div>
            `;

            return;

        }

        completed.forEach(function (task) {

            const item = document.createElement("div");
            item.className = "history-item";

            item.innerHTML = `
                <div class="history-check"><i class="fa-solid fa-check"></i></div>
                <div class="history-content">
                    <h3>${escapeHTML(task.name)}</h3>
                    <span>${formatDate(task.date)} · ${categoryLabel(task.category)}</span>
                </div>
            `;

            historyList.appendChild(item);

        });

    }

    clearBtn.addEventListener("click", function () {

        const completedCount = tasks.filter(function (t) { return t.completed; }).length;

        if (completedCount === 0) return;

        const confirmed = confirm("Remove all " + completedCount + " completed tasks from your history? This can't be undone.");
        if (!confirmed) return;

        tasks = tasks.filter(function (t) { return !t.completed; });
        Storage.saveTasks(tasks);
        render();

    });

    render();

});
