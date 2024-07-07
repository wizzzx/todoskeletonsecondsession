
let currentColumnId = null;

document.addEventListener("DOMContentLoaded", () => {
  // код будет работать только после загрузки всего документа
  renderKanban();

  const addTaskButtons = document.querySelectorAll(".kanban__icon--add");
  const modal = document.querySelector(".modal");
  const closeModalButton = document.querySelector(".close-modal");
  const cancelButton = document.querySelector(".cancel-button");
  const form = document.querySelector(".modal form");

  // =========================================================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log(currentColumnId, 'columnId');
    console.log(event, 'Submit event')

    const title = document.getElementById("title-task").value;
    const description = document.getElementById("description-task").value;
    const dueDate = form.elements["date"].value;


    const newTask = {
      // generate new id
      id: 2,
      title: title,
      description:description,
      complexity: "high",
      dueDate: dueDate,
      columnId: currentColumnId
  }

    tasks.push(newTask);
    const currentColumn = columns.find(col => col.id == currentColumnId);
    currentColumn.tasks.push(newTask.id)

    modal.style.display = 'none';

    const currentColumnDomElement = document.querySelector(`.kanban__column--${currentColumnId}`);

    const kanbanListCurrentColumn = currentColumnDomElement.querySelector('.kanban__list')
    
    kanbanListCurrentColumn.appendChild(renderTaskElement(newTask))

    // Вставить код для создания задачи, тут ваще не пон, хуйня не гуглится (закомментированный код скорее всего неправильный)
    // const taskContainer = document.createElement("task-card");
    // const taskTask = taskCreate.querySelector(tasks);
    
  });
  // =========================================================================

  addTaskButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const columnId = e.target.dataset.columnId;
      currentColumnId = columnId;
      modal.style.display = "flex";
    });
  });

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
});


// =========================================================================
function renderTaskElement(task) {
  const element = document.createElement('div');
  element.className = `task-item_info task-item_info--${task.id}`;
  element.innerHTML = `
    <div class="task-item">
      <div class="task-item_title">${task.title}</div>
      <div class="task-item_description">${task.description}</div>
      <div class="task-item_client">${task.dueDate}</div>
    </div>
  `

  return element;
};
  // Вставить код рендера задачи
  // const taskContainer = document.querySelector(".task-item");

  // tasks.forEach((task) => {
  //   const taskCard = document.createElement("task");
  //   taskCard.className = `task-item_info task-item_info--${task.id}`;
  //   taskCard.innerHTML = `
      // <div class="task-item">
      //   <div class="task-item_title">${title}</div>
      //   <div class="task-item_description">${description}</div>
      //   <div class="task-item_client">${dueDate}</div>
      // </div>
  //   `;
// нужны ли тут эти строки?
  //   const listTask = taskCard.querySelector(".task-item");
  //   task.tasks.forEach((taskId) => {
  //     const task= tasks.find((task) => task.id === taskID);
  //     if (task) {
  //       listTask.appendChild(renderTaskElement(task));
  //     }
  //   return task;
  // });
// })};
// =========================================================================


function renderKanban() {
  const kanbanContainer = document.querySelector(".kanban");

  columns.forEach((column) => {
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
          <div class="kanban__list"></div>
        `;


    const listContainer = columnSection.querySelector(".kanban__list");


    // у колонки свойство tasks - это задачи колонки
    // проходит по этому массиву - а исходя из того что элемент массива в исходной задаче называется taskId 
    // должен был догадаться что свойство tasks - это ничто иное как массив айдишников

    // ITER 1
    // todo col -> tasks
    column.tasks.forEach((taskId) => {
      const task = tasks.find((task) => task.id === taskId);

      if (task) {
        listContainer.appendChild(renderTaskElement(task));
      }
    });

    kanbanContainer.appendChild(columnSection);
  });
};

