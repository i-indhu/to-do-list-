/* ==========================================
   MYTASK — SHARED STORAGE & UTILITIES
   Loaded before any page-specific script.
========================================== */

const Storage = (function () {

    const BASE_KEYS = {
        tasks: "myTasks",
        projects: "myProjects",
        notes: "myNotes"
    };

    // Auto-clear initial demo data on first load after upgrade
    (function clearDemoDataOnUpgrade() {
        const DEMO_CLEARED_KEY = "myTask_demo_data_cleared_v1";
        if (!localStorage.getItem(DEMO_CLEARED_KEY)) {
            // Remove legacy un-scoped and demo data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith("myTasks") || key.startsWith("myProjects") || key.startsWith("myNotes")) {
                    localStorage.removeItem(key);
                }
            });
            localStorage.setItem(DEMO_CLEARED_KEY, "true");
        }
    })();

    function getUserKey(baseKey) {
        try {
            const user = JSON.parse(localStorage.getItem('myTaskUser'));
            if (user && (user.uid || user.email)) {
                const id = (user.uid || user.email).replace(/[^a-zA-Z0-9]/g, '_');
                return baseKey + "_" + id;
            }
        } catch (e) {}
        return baseKey;
    }

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(getUserKey(key))) || [];
        } catch (e) {
            return [];
        }
    }

    function write(key, value) {
        localStorage.setItem(getUserKey(key), JSON.stringify(value));
    }

    return {

        // ---------- TASKS ----------
        getTasks: function () {
            return read(BASE_KEYS.tasks);
        },
        saveTasks: function (tasks) {
            write(BASE_KEYS.tasks, tasks);
        },

        // ---------- PROJECTS ----------
        getProjects: function () {
            return read(BASE_KEYS.projects);
        },
        saveProjects: function (projects) {
            write(BASE_KEYS.projects, projects);
        },

        // ---------- NOTES ----------
        getNotes: function () {
            return read(BASE_KEYS.notes);
        },
        saveNotes: function (notes) {
            write(BASE_KEYS.notes, notes);
        },

        // ---------- CLEAR ALL DATA ----------
        clearAllData: function () {
            write(BASE_KEYS.tasks, []);
            write(BASE_KEYS.projects, []);
            write(BASE_KEYS.notes, []);
        }

    };

})();


/* ==========================================
   ID GENERATOR
========================================== */

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}


/* ==========================================
   ESCAPE HTML (XSS protection)
========================================== */

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML;
}


/* ==========================================
   DATE HELPERS
========================================== */

function todayISO() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 10);
}

function formatDate(value) {
    if (!value) {
        return "No date";
    }
    const date = new Date(value + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatDateShort(value) {
    if (!value) {
        return "";
    }
    const date = new Date(value + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });
}

function formatTime(value) {
    if (!value) {
        return "";
    }
    const parts = value.split(":");
    const date = new Date();
    date.setHours(Number(parts[0]), Number(parts[1]));
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function isToday(value) {
    return value === todayISO();
}

function isThisWeek(value) {
    if (!value) return false;
    const today = new Date(todayISO() + "T00:00:00");
    const target = new Date(value + "T00:00:00");
    const day = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return target >= startOfWeek && target <= endOfWeek;
}

function isThisMonth(value) {
    if (!value) return false;
    const today = new Date(todayISO() + "T00:00:00");
    const target = new Date(value + "T00:00:00");
    return (
        target.getFullYear() === today.getFullYear() &&
        target.getMonth() === today.getMonth()
    );
}


/* ==========================================
   TEXT HELPERS
========================================== */

function capitalize(value) {
    if (!value) {
        return "";
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const CATEGORY_LABELS = {
    personal: "Personal",
    work: "Work",
    study: "Study",
    other: "Other"
};

function categoryLabel(value) {
    return CATEGORY_LABELS[value] || capitalize(value || "other");
}
