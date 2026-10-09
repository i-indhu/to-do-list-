document.addEventListener("DOMContentLoaded", function () {

    const monthLabel = document.getElementById("monthLabel");
    const calendarDays = document.getElementById("calendarDays");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const todayBtn = document.getElementById("todayBtn");
    const calendarFilterTabs = document.getElementById("calendarFilterTabs");

    const agendaTitle = document.getElementById("agendaTitle");
    const agendaList = document.getElementById("agendaList");

    const addButton = document.getElementById("addTaskButton");
    const modal = document.getElementById("taskModal");
    const closeButton = document.getElementById("closeModal");
    const cancelButton = document.getElementById("cancelTask");
    const taskForm = document.getElementById("taskForm");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const saveTaskBtn = document.getElementById("saveTaskBtn");

    let tasks = Storage.getTasks();
    let viewDate = new Date();
    let selectedDate = todayISO();
    let editingId = null;
    let calFilter = "all"; // "all", "personal", "holidays"

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // ==========================================
    // COMPREHENSIVE INDIAN & TAMIL NADU FESTIVALS & HOLIDAYS
    // ==========================================

    const INDIAN_FESTIVALS = [
        // JANUARY
        { month: 0, day: 1, name: "New Year's Day", type: "Public Holiday", icon: "fa-solid fa-champagne-glasses", description: "Global New Year celebration and public holiday across India." },
        { month: 0, day: 13, name: "Bogi / Bhogi Pandigai", type: "Tamil Nadu Harvest Eve", icon: "fa-solid fa-fire-burner", description: "First day of Pongal celebrating new beginnings and clearing the old." },
        { month: 0, day: 14, name: "Thai Pongal / Makar Sankranti", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-sun", description: "Major harvest festival worshipping the Sun God Surya with freshly cooked sweet Pongal." },
        { month: 0, day: 15, name: "Mattu Pongal & Thiruvalluvar Day", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-cow", description: "Honoring cattle, agricultural helpers, and remembering the legendary poet Thiruvalluvar." },
        { month: 0, day: 16, name: "Kaanum Pongal & Uzhavar Thirunal", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-people-roof", description: "Family reunion, sightseeing, and Farmers' Appreciation Day in Tamil Nadu." },
        { month: 0, day: 26, name: "Republic Day of India", type: "National Holiday", icon: "fa-solid fa-flag", description: "National holiday celebrating the Indian Constitution coming into effect in 1950." },
        { month: 0, day: 31, name: "Thaipusam", type: "Tamil Nadu Festival", icon: "fa-solid fa-gopuram", description: "Grand Tamil festival honoring Lord Murugan's victory with Kavadi and prayers." },

        // FEBRUARY
        { month: 1, day: 2, name: "Vasant Panchami / Saraswati Puja", type: "Indian Festival", icon: "fa-solid fa-book-open-reader", description: "Spring arrival festival worshipping Goddess Saraswati for knowledge and arts." },
        { month: 1, day: 14, name: "Valentine's Day", type: "Global Observance", icon: "fa-solid fa-heart", description: "Worldwide celebration of love, friendship, and affection." },
        { month: 1, day: 15, name: "Maha Shivaratri", type: "Major Religious Holiday", icon: "fa-solid fa-om", description: "Sacred night festival worshipping Lord Shiva with prayers, fasting, and vigils." },

        // MARCH
        { month: 2, day: 8, name: "International Women's Day", type: "Global Observance", icon: "fa-solid fa-venus", description: "Celebrating the social, economic, and cultural achievements of women." },
        { month: 2, day: 14, name: "Holika Dahan / Chhoti Holi", type: "Indian Festival", icon: "fa-solid fa-fire", description: "Ritual bonfire celebrating the victory of good over evil." },
        { month: 2, day: 15, name: "Holi (Festival of Colors)", type: "Major Indian Festival", icon: "fa-solid fa-palette", description: "Joyous festival of colors, spring, unity, and festive sweets." },
        { month: 2, day: 30, name: "Ugadi / Gudi Padwa", type: "Regional New Year", icon: "fa-solid fa-seedling", description: "New Year celebration in Andhra Pradesh, Telangana, Karnataka, and Maharashtra." },
        { month: 2, day: 31, name: "Ramzan Eid / Eid-ul-Fitr", type: "Public Holiday", icon: "fa-solid fa-moon", description: "Joyous Islamic festival concluding the holy month of Ramadan fasting." },

        // APRIL
        { month: 3, day: 6, name: "Sri Rama Navami", type: "Indian Festival", icon: "fa-solid fa-dharmachakra", description: "Celebrating the birth of Lord Rama with temple prayers and prasadam." },
        { month: 3, day: 11, name: "Mahavir Jayanti", type: "Public Holiday", icon: "fa-solid fa-spa", description: "Celebrating the birth anniversary of Lord Mahavira, founder of Jainism." },
        { month: 3, day: 14, name: "Tamil New Year (Puthandu) & Ambedkar Jayanti", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-gopuram", description: "Tamil Solar New Year, Dr. B.R. Ambedkar Jayanti, and Baisakhi celebrations." },
        { month: 3, day: 18, name: "Good Friday", type: "Public Holiday", icon: "fa-solid fa-cross", description: "Solemn Christian public holiday commemorating the crucifixion of Jesus Christ." },
        { month: 3, day: 20, name: "Easter Sunday", type: "Christian Observance", icon: "fa-solid fa-egg", description: "Celebrating the resurrection of Jesus Christ." },

        // MAY
        { month: 4, day: 1, name: "International Workers' Day / May Day", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-briefcase", description: "Honoring labor rights, worker dignity, and achievements." },
        { month: 4, day: 12, name: "Buddha Purnima", type: "Public Holiday", icon: "fa-solid fa-hands-praying", description: "Commemorating the birth, enlightenment, and Nirvana of Gautama Buddha." },
        { month: 4, day: 15, name: "Chithirai Thiruvizha (Meenakshi Kalyanam)", type: "Madurai Grand Festival", icon: "fa-solid fa-gopuram", description: "Grand 10-day celestial wedding festival of Goddess Meenakshi in Madurai." },

        // JUNE
        { month: 5, day: 5, name: "World Environment Day", type: "Global Observance", icon: "fa-solid fa-leaf", description: "Promoting environmental awareness and eco-action." },
        { month: 5, day: 7, name: "Bakrid / Eid al-Adha", type: "Public Holiday", icon: "fa-solid fa-mosque", description: "Feast of Sacrifice celebrated by Muslims worldwide." },
        { month: 5, day: 21, name: "International Yoga Day", type: "Global Observance", icon: "fa-solid fa-child-reaching", description: "Promoting physical, mental, and spiritual wellness through yoga." },
        { month: 5, day: 27, name: "Rath Yatra", type: "Grand Festival", icon: "fa-solid fa-dharmachakra", description: "Famous chariot procession festival of Lord Jagannath." },

        // JULY
        { month: 6, day: 6, name: "Muharram", type: "Public Holiday", icon: "fa-solid fa-kaaba", description: "First month of the Islamic calendar and day of Remembrance." },

        // AUGUST
        { month: 7, day: 3, name: "Aadi Perukku (Aadi 18)", type: "Tamil Nadu Water Festival", icon: "fa-solid fa-water", description: "Traditional Tamil festival honoring rivers, monsoon water, and nature's fertility." },
        { month: 7, day: 9, name: "Raksha Bandhan", type: "Indian Festival", icon: "fa-solid fa-ribbon", description: "Festive celebration of love and protection between brothers and sisters." },
        { month: 7, day: 15, name: "Independence Day of India", type: "National Holiday", icon: "fa-solid fa-shield-halved", description: "National holiday commemorating India's freedom from British rule in 1947." },
        { month: 7, day: 16, name: "Krishna Jayanthi / Gokulashtami", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-music", description: "Celebrating the birth of Lord Krishna with butter offerings, music, and Dahi Handi." },
        { month: 7, day: 27, name: "Vinayagar Chaturthi / Ganesh Chaturthi", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-mountain", description: "Grand festival honoring the birth of Lord Ganesha with clay idols and modaks." },

        // SEPTEMBER
        { month: 8, day: 5, name: "Teachers' Day", type: "National Observance", icon: "fa-solid fa-graduation-cap", description: "Honoring Dr. S. Radhakrishnan and educators across India." },
        { month: 8, day: 6, name: "Onam", type: "Harvest Festival", icon: "fa-solid fa-burst", description: "Grand harvest festival of Kerala celebrated with Pookkalam flower carpets and feast." },
        { month: 8, day: 15, name: "Milad-un-Nabi", type: "Public Holiday", icon: "fa-solid fa-moon-stars", description: "Commemorating the birth anniversary of Prophet Muhammad." },

        // OCTOBER
        { month: 9, day: 2, name: "Gandhi Jayanti", type: "National Holiday", icon: "fa-solid fa-dove", description: "Birthday of Mahatma Gandhi, observed as International Day of Non-Violence." },
        { month: 9, day: 11, name: "Ayudha Puja / Saraswathi Puja", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-wand-magic-sparkles", description: "Worshipping tools of trade, books, and Goddess Saraswathi across Tamil Nadu." },
        { month: 9, day: 12, name: "Vijayadasami / Dussehra", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-bolt", description: "Celebrating victory of good over evil and auspicious day for new learning." },
        { month: 9, day: 20, name: "Karwa Chauth", type: "Indian Festival", icon: "fa-solid fa-moon", description: "Traditional fasting ritual for marital harmony and prosperity." },
        { month: 9, day: 31, name: "Dhanteras & Diwali Eve", type: "Indian Festival", icon: "fa-solid fa-coins", description: "Auspicious day for purchasing gold, lights, and preparing for Deepavali." },

        // NOVEMBER
        { month: 10, day: 1, name: "Deepavali / Diwali (Festival of Lights)", type: "Tamil Nadu Public Holiday", icon: "fa-solid fa-lightbulb", description: "Premier festival of lights celebrating oil baths, new clothes, sweets, and joy." },
        { month: 10, day: 2, name: "Kanda Sashti / Soorasamharam", type: "Tamil Murugan Festival", icon: "fa-solid fa-flame", description: "Famous 6-day Tamil festival celebrating Lord Murugan's victory over demon Surapadman." },
        { month: 10, day: 3, name: "Bhai Dooj", type: "Indian Festival", icon: "fa-solid fa-hands-holding-child", description: "Celebrating sibling affection and familial bonds." },
        { month: 10, day: 7, name: "Chhath Puja", type: "Vedic Festival", icon: "fa-solid fa-sun-plant-whip", description: "Ancient Vedic festival worshipping Sun God Surya at riverbanks." },
        { month: 10, day: 14, name: "Children's Day", type: "National Observance", icon: "fa-solid fa-child", description: "Birth anniversary of Jawaharlal Nehru celebrating youth and education." },
        { month: 10, day: 15, name: "Guru Nanak Jayanti", type: "Public Holiday", icon: "fa-solid fa-synagogue", description: "Celebrating the birth anniversary of Guru Nanak Dev Ji, founder of Sikhism." },
        { month: 10, day: 26, name: "Karthigai Deepam", type: "Tamil Nadu Festival", icon: "fa-solid fa-fire-flame-curved", description: "Grand Tamil festival of lights featuring rows of clay lamps (agal vilakku) and Tiruvannamalai Deepam." },

        // DECEMBER
        { month: 11, day: 16, name: "Margazhi Season & Thiruvadhirai", type: "Tamil Cultural Season", icon: "fa-solid fa-music", description: "Sacred Tamil month of devotional music, Kolam art, and Lord Nataraja worship." },
        { month: 11, day: 23, name: "Vaikunta Ekadasi", type: "Grand Temple Festival", icon: "fa-solid fa-door-open", description: "Opening of the Paramapada Vasal heaven gate at Srirangam and Vishnu temples." },
        { month: 11, day: 25, name: "Christmas Day", type: "Public Holiday", icon: "fa-solid fa-gift", description: "Annual festive celebration commemorating the birth of Jesus Christ." },
        { month: 11, day: 31, name: "New Year's Eve", type: "Global Festival", icon: "fa-solid fa-sparkles", description: "Ringing in the upcoming new year with music, resolutions, and joy." }
    ];

    function getHolidaysForDate(dateStr) {
        if (!dateStr) return [];
        const parts = dateStr.split("-");
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        return INDIAN_FESTIVALS.filter(h => h.month === month && h.day === day);
    }

    // ==========================================
    // MODAL HANDLERS
    // ==========================================

    function openModalForAdd(prefillDate) {
        editingId = null;
        taskForm.reset();
        document.getElementById("taskPriority").value = "medium";
        document.getElementById("taskCategory").value = "personal";
        document.getElementById("taskDate").value = prefillDate || selectedDate;
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

    if (addButton) addButton.addEventListener("click", function () { openModalForAdd(); });
    if (closeButton) closeButton.addEventListener("click", closeModal);
    if (cancelButton) cancelButton.addEventListener("click", closeModal);

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeModal();
        });
    }

    if (taskForm) {
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
            selectedDate = taskDate || selectedDate;
            renderCalendar();
            renderAgenda();
            taskForm.reset();
            closeModal();
        });
    }

    // ==========================================
    // FILTER CONTROLS (ALL / PERSONAL / HOLIDAYS)
    // ==========================================

    if (calendarFilterTabs) {
        calendarFilterTabs.addEventListener("click", function (e) {
            const tab = e.target.closest(".filter-tab");
            if (!tab) return;
            calendarFilterTabs.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            calFilter = tab.dataset.calFilter || "all";
            renderCalendar();
            renderAgenda();
        });
    }

    // ==========================================
    // CALENDAR MONTH GRID RENDER
    // ==========================================

    function tasksOnDate(dateStr) {
        return tasks.filter(function (t) { return t.date === dateStr; });
    }

    function toISO(y, m, d) {
        const mm = String(m + 1).padStart(2, "0");
        const dd = String(d).padStart(2, "0");
        return y + "-" + mm + "-" + dd;
    }

    function renderCalendar() {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        monthLabel.textContent = MONTH_NAMES[month] + " " + year;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        calendarDays.innerHTML = "";

        // Leading days from previous month
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = daysInPrevMonth - i;
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            calendarDays.appendChild(buildDayCell(toISO(prevYear, prevMonth, dayNum), dayNum, true));
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            calendarDays.appendChild(buildDayCell(toISO(year, month, d), d, false));
        }

        // Trailing days
        const totalCells = firstDayIndex + daysInMonth;
        const trailing = (7 - (totalCells % 7)) % 7;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;

        for (let d = 1; d <= trailing; d++) {
            calendarDays.appendChild(buildDayCell(toISO(nextYear, nextMonth, d), d, true));
        }
    }

    function buildDayCell(dateStr, dayNum, otherMonth) {
        const cell = document.createElement("div");
        cell.className = "calendar-day" + (otherMonth ? " other-month" : "");

        if (dateStr === todayISO()) cell.classList.add("is-today");
        if (dateStr === selectedDate) cell.classList.add("is-selected");

        const dayTasks = calFilter === "holidays" ? [] : tasksOnDate(dateStr);
        const holidays = calFilter === "personal" ? [] : getHolidaysForDate(dateStr);

        if (dayTasks.length > 0 || holidays.length > 0) cell.classList.add("has-tasks");

        let pillsHTML = "";

        // Render Indian Festivals & Holidays pills with gold saffron styling
        holidays.forEach(function (h) {
            pillsHTML += `<div class="day-task-pill holiday-pill" title="${escapeHTML(h.name)}"><i class="${h.icon}"></i> ${escapeHTML(h.name)}</div>`;
        });

        // Render Personal User Tasks
        const maxTasksShown = holidays.length > 0 ? 1 : 2;
        dayTasks.slice(0, maxTasksShown).forEach(function (t) {
            pillsHTML += `<div class="day-task-pill priority-${t.priority}">${escapeHTML(t.name)}</div>`;
        });

        const totalItems = dayTasks.length + holidays.length;
        const shownItems = holidays.length + Math.min(dayTasks.length, maxTasksShown);
        if (totalItems > shownItems) {
            pillsHTML += `<div class="day-task-more">+${totalItems - shownItems} more</div>`;
        }

        cell.innerHTML = `<span class="day-number">${dayNum}</span>${pillsHTML}`;

        cell.addEventListener("click", function () {
            selectedDate = dateStr;

            if (otherMonth) {
                viewDate = new Date(dateStr + "T00:00:00");
                renderCalendar();
            } else {
                document.querySelectorAll(".calendar-day").forEach(function (c) {
                    c.classList.remove("is-selected");
                });
                cell.classList.add("is-selected");
            }

            renderAgenda();
        });

        return cell;
    }

    // ==========================================
    // AGENDA (SEPARATED HOLIDAYS & PERSONAL TASKS)
    // ==========================================

    function renderAgenda() {
        const dayTasks = tasksOnDate(selectedDate).sort(function (a, b) {
            return (a.time || "").localeCompare(b.time || "");
        });

        const holidays = getHolidaysForDate(selectedDate);
        const isToday = selectedDate === todayISO();

        agendaTitle.textContent = (isToday ? "Today · " : "") + formatDate(selectedDate);
        agendaList.innerHTML = "";

        const showHolidays = calFilter !== "personal" && holidays.length > 0;
        const showTasks = calFilter !== "holidays";

        // 1. INDIAN PUBLIC HOLIDAYS & FESTIVALS SECTION
        if (showHolidays) {
            const holSection = document.createElement("div");
            holSection.className = "agenda-section";
            holSection.innerHTML = `<h4 class="agenda-section-title"><i class="fa-solid fa-om" style="color:#d97706;"></i> Indian Public Holidays & Festivals</h4>`;
            
            holidays.forEach(function (h) {
                const holCard = document.createElement("div");
                holCard.className = "holiday-banner-card";
                holCard.innerHTML = `
                    <div class="holiday-banner-icon"><i class="${h.icon}"></i></div>
                    <div class="holiday-banner-info">
                        <span class="holiday-badge">${escapeHTML(h.type)}</span>
                        <h4>${escapeHTML(h.name)}</h4>
                        <p>${escapeHTML(h.description)}</p>
                    </div>
                `;
                holSection.appendChild(holCard);
            });

            agendaList.appendChild(holSection);
        }

        // 2. PERSONAL TASKS SECTION
        if (showTasks) {
            const taskSection = document.createElement("div");
            taskSection.className = "agenda-section";
            
            if (showHolidays && dayTasks.length > 0) {
                taskSection.innerHTML = `<h4 class="agenda-section-title" style="margin-top:20px;"><i class="fa-solid fa-list-check" style="color:var(--primary);"></i> Personal Tasks & Schedule</h4>`;
            }

            if (dayTasks.length === 0) {
                if (!showHolidays) {
                    taskSection.innerHTML += `
                        <div class="empty-tasks">
                            <i class="fa-regular fa-calendar-xmark"></i>
                            <h3>No personal tasks scheduled for this day</h3>
                            <p>Click "Add Task" to plan a new activity or reminder for this date.</p>
                        </div>
                    `;
                }
            } else {
                dayTasks.forEach(function (task) {
                    const item = document.createElement("div");
                    item.className = "todo-item" + (task.completed ? " completed-task" : "");

                    item.innerHTML = `
                        <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
                        <div class="todo-content">
                            <h3>${escapeHTML(task.name)}</h3>
                            ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ""}
                            <div class="todo-details">
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

                    taskSection.appendChild(item);
                });
            }

            agendaList.appendChild(taskSection);
        }

        if (calFilter === "holidays" && holidays.length === 0) {
            agendaList.innerHTML = `
                <div class="empty-tasks">
                    <i class="fa-solid fa-sun"></i>
                    <h3>No Indian public holidays or festivals on this day</h3>
                    <p>Select another date to view upcoming festive days.</p>
                </div>
            `;
        }
    }

    if (agendaList) {
        agendaList.addEventListener("change", function (event) {
            if (!event.target.classList.contains("task-checkbox")) return;
            const task = tasks.find(function (t) { return t.id === event.target.dataset.id; });
            if (!task) return;

            task.completed = event.target.checked;
            Storage.saveTasks(tasks);
            renderCalendar();
            renderAgenda();
        });

        agendaList.addEventListener("click", function (event) {
            const editBtn = event.target.closest(".edit-task");
            const deleteBtn = event.target.closest(".delete-task");

            if (editBtn) {
                const task = tasks.find(function (t) { return t.id === editBtn.dataset.id; });
                if (task) openModalForEdit(task);
                return;
            }

            if (deleteBtn) {
                const confirmed = confirm("Are you sure you want to delete this task?");
                if (!confirmed) return;

                tasks = tasks.filter(function (t) { return t.id !== deleteBtn.dataset.id; });
                Storage.saveTasks(tasks);
                renderCalendar();
                renderAgenda();
            }
        });
    }

    // ==========================================
    // NAVIGATION HANDLERS
    // ==========================================

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", function () {
            viewDate.setMonth(viewDate.getMonth() - 1);
            viewDate = new Date(viewDate);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", function () {
            viewDate.setMonth(viewDate.getMonth() + 1);
            viewDate = new Date(viewDate);
            renderCalendar();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener("click", function () {
            viewDate = new Date();
            selectedDate = todayISO();
            renderCalendar();
            renderAgenda();
        });
    }

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    renderCalendar();
    renderAgenda();

});
