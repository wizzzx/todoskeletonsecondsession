let currentColumnId = null;
let currentTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderKanban();

  const addTaskButtons = document.querySelectorAll(".kanban__icon--add");
  const taskModal = document.querySelector(".task-modal");
  const columnModal = document.querySelector(".column-modal");
  const closeModalButtons = document.querySelectorAll(".close-modal");
  const cancelButtons = document.querySelectorAll(".cancel-button");
  const taskForm = document.querySelector(".task-modal form");
  const columnForm = document.querySelector("#column-form");
  const addIcon = document.querySelector(".header__icon--add");

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title-task").value;
    const description = document.getElementById("description-task").value;
    const dueDate = document.getElementById("due-date").value;
    const taskId = document.getElementById("task-id").value;

    if (taskId) {
      const task = tasks.find(t => t.id == taskId);
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      renderKanban();
    } else {
      const newTask = {
        id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1, // генер уникальный айди, в инете подсмотрел
    
        title: title,
        description: description,
        complexity: "high",
        dueDate: dueDate,
        columnId: currentColumnId
      };
      tasks.push(newTask);
      const currentColumn = columns.find(col => col.id == currentColumnId);
      console.log(currentColumnId);
      console.log(columns);
      currentColumn.tasks.push(newTask.id);
      renderKanban();
    }

    taskModal.style.display = 'none';
  });

  columnForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("column-title").value;
    const newColumnId = String(columns.length + 1);
    const newColumn = {
      id: newColumnId,
      title: title,
      icon: "./src/assets/img/kanban/kanban__column--default.svg",
      tasks: []
    };
    columns.push(newColumn);
    const kanbanContainer = document.querySelector(".kanban");
    kanbanContainer.appendChild(renderColumn(newColumn));
    initAddTaskHandlers();
    columnModal.style.display = 'none';
  });

  function initAddTaskHandlers() {
    document.querySelectorAll(".kanban__icon--add").forEach((button) => {
      button.addEventListener("click", (e) => {
        const columnId = e.target.dataset.columnId;
        currentColumnId = columnId;
        document.getElementById("task-id").value = '';
        document.getElementById("title-task").value = '';
        document.getElementById("description-task").value = '';
        document.getElementById("due-date").value = '';
        taskModal.style.display = "flex";
      });
    });
  };
  
  initAddTaskHandlers();

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      taskModal.style.display = "none";
      columnModal.style.display = "none";
    });
  });

  cancelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      taskModal.style.display = "none";
      columnModal.style.display = "none";
    });
  });

  addIcon.addEventListener("click", () => {
    columnModal.style.display = "flex";
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-button")) {
      const taskId = e.target.dataset.taskId;
      currentTaskId = taskId;
      const task = tasks.find(t => t.id == taskId);
      document.getElementById("task-id").value = task.id;
      document.getElementById("title-task").value = task.title;
      document.getElementById("description-task").value = task.description;
      document.getElementById("due-date").value = task.dueDate;
      taskModal.style.display = "flex";
    }
  });
});

function renderTaskElement(task) {
  const element = document.createElement('div');
  element.className = `task-item_info--${task.id}`;
  element.innerHTML = `
    <div class="task-item">
      <div class="task-item__title">${task.title}</div>
      <div class="task-item__description">${task.description}</div>
      <div class="task-item__client">${task.dueDate}</div>
      <div class="complexity__dot"></div>
      <button class="edit-button" data-task-id="${task.id}">Редактировать</button>
    </div>`;
  return element;
};

function renderColumn(column) {
  const columnSection = document.createElement("section");
    columnSection.className = `kanban__column kanban__column--${column.id}`;
    columnSection.innerHTML = `
      <div class="kanban__header">
        <div class="kanban__header-content">
          <img src="${column.icon}" alt="Колонка ${column.title}" class="kanban__icon kanban__icon--column">
          <h2 class="kanban__title">${column.title}</h2>
        </div>
        <img data-column-id="${column.id}" src="./src/assets/img/kanban/plus.svg" alt="Добавить задачу" class="kanban__icon kanban__icon--add">
      </div>
      <div class="kanban__list"></div>`;
      return columnSection;
};

function renderKanban() {
  const kanbanContainer = document.querySelector(".kanban");
  kanbanContainer.innerHTML = '';
  columns.forEach((column) => {
    const columnSection = renderColumn(column);
    const listContainer = columnSection.querySelector(".kanban__list");
    column.tasks.forEach((taskId) => {
      const task = tasks.find((task) => task.id === taskId);
      if (task) {
        const taskElement = renderTaskElement(task);
        listContainer.appendChild(taskElement);
      }
    });
    kanbanContainer.appendChild(columnSection);
  });
};