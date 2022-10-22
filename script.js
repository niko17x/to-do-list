// Todo: 1. Editing date from modal is causing the edit to take effect on all existing tasks => Should only edit the selected task. ///

// Dealing with local storage using KEYS:
const LOCAL_STORAGE_LIST_KEY = "task.projectItemList";
const LOCAL_STORAGE_SELECTED_LIST_ID = "task.selectedListId";
const LOCAL_STORAGE_TODAY_KEY = "task.todayItemList";

// Get lists data from local storage || if none exists, then create new empty array.
let projectItemList =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);
let todayItemList =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODAY_KEY)) || [];

// DOM selectors:
const projectsContainer = document.querySelector(".projects-container");
const createProjectInput = document.querySelector(".create-project-input");
const projectItem = document.querySelector(".project-item");
const navbar = document.querySelector(".navbar");
const listTitle = document.querySelector(".list-title");
const deleteBtn = document.querySelector(".delete-btn");
const createProjectForm = document.querySelector(".create-project-form");
const subtitleToday = document.querySelector(".subtitle-today");
const createNewTaskForm = document.querySelector(".create-new-task-form");
const addTaskInput = document.querySelector(".add-task-input");
const taskItemsContainer = document.querySelector(".task-items-container");
const taskItemInput = document.querySelector(".task-item-input");
const projectItemTitle = document.querySelectorAll(".project-item-title");
const template = document.querySelector("template");
const taskItems = document.querySelector(".task-items");
const taskCounter = document.querySelector(".task-counter");
const chevron = document.querySelector(".chevron");
const modal = document.querySelector(".modal-container");

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(projectItemList));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
  localStorage.setItem(LOCAL_STORAGE_TODAY_KEY, JSON.stringify(todayItemList));
}

function render() {
  if (selectedListId == null) {
    selectedListId = "1";
  } // Set default id if no projects exist.
  const selectedList = projectItemList.find(
    (item) => item.id === selectedListId
  );
  // Removes existing nodes so project items aren't duplicated for every loop being run:
  clearElement(projectsContainer);
  displayTodayTask(selectedList);
  renderProjectItem();
  validNavbarRender(selectedList);
  renderTaskCount(selectedList);
}

// Check if projectsContainer is not empty and selectedList is true && 'today' id is not currently selected, then run function:
function validNavbarRender(selectedList) {
  if (
    projectsContainer.hasChildNodes() &&
    selectedList &&
    selectedListId != "1"
  ) {
    renderTaskItem(selectedList.tasks);
  } else {
    renderTaskItem(todayItemList);
  }
}

// Display main title with 'Today' or project title:
function displayTodayTask(selectedList) {
  // Default to 'Today' if no project lists are present:
  if (projectItemList.length === 0 || selectedListId === "1") {
    listTitle.innerText = "Today";
  } else if (selectedList && selectedListId != "") {
    listTitle.innerText = selectedList.projectName;
  }
  save();
}

// Clear all element nodes if projectItemList is empty or selectedListId is null:
function checkCurrentDisplay() {
  if (projectItemList.length === 0 || selectedListId == null) {
    clearElement(taskItemsContainer);
  }
}

// Dynamically creating new projects:
function renderProjectItem() {
  projectItemList.forEach((item) => {
    const divProjectItem = document.createElement("div");
    divProjectItem.classList.add("project-item");
    // divProjectItem.id = item.id;
    const btnDeleteButton = document.createElement("button");
    btnDeleteButton.classList.add("delete-btn");
    btnDeleteButton.id = item.id;
    btnDeleteButton.innerHTML = "&#10005";
    const liProjectItemTitle = document.createElement("li");
    liProjectItemTitle.classList.add("project-item-title");
    liProjectItemTitle.id = item.id;
    liProjectItemTitle.innerText = item.projectName;

    if (item.id === selectedListId) {
      liProjectItemTitle.classList.add("active");
    }

    divProjectItem.append(btnDeleteButton, liProjectItemTitle);
    projectsContainer.append(divProjectItem);
  });
}

// Need object data to insert into 'projectItems' array and create unique id for each entry:
function generateUniqueId(title) {
  return {
    id: Date.now().toString(), // Generate unique id.
    projectName: title,
    tasks: [], // Unique todo tasks for each object in the array (todo list).
  };
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Generate an object for tasks inside projectListItem array:
function generateTask(title, date) {
  return {
    id: Date.now().toString(),
    task: title,
    complete: false,
    highPriority: false,
    dueDate: date,
  };
}

// Generate task items:
function renderTaskItem(selectedList) {
  clearElement(taskItemsContainer);
  selectedList.forEach((entry) => {
    // const taskElement = document.importNode(template.content, true);
    // taskItemsContainer.append(taskElement);

    const divTaskItems = document.createElement("div");
    divTaskItems.classList.add("task-items");
    divTaskItems.id = entry.id;
    const taskItemLabel = document.createElement("label");
    taskItemLabel.classList.add("task-item-label");
    taskItemLabel.setAttribute("for", "task-item");
    const taskItemSpan = document.createElement("span");
    taskItemSpan.classList.add("task-item-span");
    const taskItemInput = document.createElement("input");
    taskItemInput.id = entry.id;
    taskItemInput.checked = entry.complete;
    taskItemInput.classList.add("task-item-input");
    taskItemInput.setAttribute("type", "checkbox");
    taskItemInput.setAttribute("name", "task");
    taskItemInput.checked = entry.complete;

    const divTaskItemBox = document.createElement("div");
    divTaskItemBox.classList.add("task-item-box");
    divTaskItemBox.id = entry.id;

    const taskListItem = document.createElement("li");
    taskListItem.classList.add("task-list-item");
    taskListItem.id = entry.id;
    taskListItem.innerText = entry.task;

    const spanDueDate = document.createElement("span");
    spanDueDate.classList.add("span-due-date");
    spanDueDate.id = entry.id;
    spanDueDate.innerText = entry.dueDate;

    const editBtn = document.createElement("button");
    editBtn.id = entry.id;
    editBtn.classList.add("edit-btn");
    const editBtnImg = document.createElement("img");
    editBtnImg.setAttribute(
      "src",
      "http://127.0.0.1:5500/img/circle-edit-outline.svg"
    );
    editBtnImg.id = entry.id;
    editBtnImg.classList.add("edit-btn-img");

    const priorityBtn = document.createElement("button");
    // priorityBtn.setAttribute('type', 'submit');
    priorityBtn.id = entry.id;
    priorityBtn.classList.add("priority-btn");
    const priorityFlagImg = document.createElement("img");
    priorityFlagImg.setAttribute(
      "src",
      "http://127.0.0.1:5500/img/flag-triangle.svg"
    );
    priorityFlagImg.classList.add("priority-flag-img");
    priorityFlagImg.id = entry.id;
    const deleteBtnTask = document.createElement("button");
    deleteBtnTask.id = entry.id;
    deleteBtnTask.classList.add("delete-btn-task");
    deleteBtnTask.setAttribute("type", "submit");
    deleteBtnTask.innerHTML = "&#10005";

    toggleComplete(selectedList, divTaskItemBox);
    priorityFlagToggle(selectedList, divTaskItemBox);

    editBtn.append(editBtnImg);
    priorityBtn.append(priorityFlagImg);
    taskItemLabel.append(taskItemSpan, taskItemInput);

    divTaskItemBox.append(taskListItem, spanDueDate);

    divTaskItems.append(
      taskItemLabel,
      divTaskItemBox,
      editBtn,
      priorityBtn,
      deleteBtnTask
    );
    taskItemsContainer.append(divTaskItems);
  });
}

const datePicker = flatpickr(".due-date", {
  enableTime: true,
  // dateFormat: "Y-m-d H:i",
  altInput: true,
  altFormat: "F j, Y (h:i K)",
  allowInput: true,
  shorthandCurrentMonth: true,
  minuteIncrement: 1,
});

// flatpickr for modal date picker:
let datePickerModal = flatpickr(".modal-input-due-date", {
  enableTime: true,
  altInput: true,
  altFormat: "F j, Y (h:i K)",
});

flatpickr.setDefaults({
  disableMobile: true,
});

// Add .complete class to tasks where task.complete === true (line through):
function toggleComplete(selectedList, taskItemBox) {
  if (selectedListId > 1) {
    // Add 'complete' class to li elements match the same id as the id for each task with '.complete === true':
    const listStringConvert = taskItemBox.id.toString(); // Convert the ids from list element from number to string for comparison:
    const completedTasks = []; // Get selected list tasks id that where 'complete === true' and put all ids into an array:
    selectedList.filter((item) => {
      if (item.complete === true && selectedListId) {
        completedTasks.push(item.id);
      }
    });
    if (completedTasks.includes(listStringConvert)) {
      taskItemBox.classList.add("complete");
    }
  } else {
    const todayStringConvert = taskItemBox.id.toString();
    const completedTodayTask = [];
    todayItemList.filter((item) => {
      if (item.complete === true) {
        completedTodayTask.push(item.id);
      }
    });
    if (completedTodayTask.includes(todayStringConvert)) {
      taskItemBox.classList.add("complete");
    }
  }
}

// Deal with the task counter in the task container:
function renderTaskCount(selectedList) {
  if (selectedListId > 1) {
    const incompleteTaskCount = selectedList.tasks.filter(
      (item) => !item.complete
    ).length; // Get the length of 'complete: false' properties in tasks.
    const taskCounterText = incompleteTaskCount === 1 ? "task" : "tasks";
    taskCounter.innerText = `${incompleteTaskCount} ${taskCounterText} remaining`;
  } else if (selectedListId === "1") {
    const incompleteTodayTask = todayItemList.filter(
      (item) => !item.complete
    ).length;
    const taskCounterText = incompleteTodayTask === 1 ? "task" : "tasks";
    taskCounter.innerText = `${incompleteTodayTask} ${taskCounterText} remaining`;
  }
}

// const taskItemBox = document.querySelector('.task-item-box')
// Dealing with high priority flag on task items:
function priorityFlagToggle(selectedList, taskItemBox) {
  // Go through projectItemList.tasks.highPriority => if true, add class:
  const listStringConvert = taskItemBox.id.toString();
  const highPriorityTasks = []; // Holds all the tasks.highPriority = true ids.
  const highPriorityTodayTasks = [];

  if (selectedListId > 1) {
    selectedList.filter((item) => {
      if (item.highPriority === true && selectedListId) {
        highPriorityTasks.push(item.id);
      }
    });
    if (highPriorityTasks.includes(listStringConvert)) {
      taskItemBox.classList.toggle("high-priority");
    }
  } else {
    todayItemList.filter((item) => {
      if (item.highPriority === true) {
        highPriorityTodayTasks.push(item.id);
      }
    });
    if (highPriorityTodayTasks.includes(listStringConvert)) {
      taskItemBox.classList.add("high-priority");
    }
  }
}

// Message for user in Modal for input title/date updates:
function displayMessage(attribute) {
  const userMsg = document.querySelector(".user-message");
  const msgDiv = document.createElement("div");

  if (attribute === "title") {
    msgDiv.textContent = "Title successfully updated!";
  } else if (attribute === "date") {
    msgDiv.textContent = "Date successfully changed!";
  } else if (attribute === "noChange") {
    msgDiv.textContent = "No changes have been made.";
    msgDiv.style.color = "red";
  }
  userMsg.appendChild(msgDiv);

  // Remove user message after 3 seconds of display:
  setTimeout(() => {
    userMsg.removeChild(msgDiv);
  }, 3000);
}

// User clicks on priority flag and adds true/false to projectItemList:
taskItemsContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("priority-btn") ||
    e.target.classList.contains("priority-flag-img")
  ) {
    const selectedList = projectItemList.find(
      (item) => item.id === selectedListId
    );

    if (selectedListId > 1) {
      const selectedTaskItem = selectedList.tasks.find(
        (item) => item.id === e.target.id
      );
      if (!selectedTaskItem.highPriority) {
        selectedTaskItem.highPriority = true;
      } else {
        selectedTaskItem.highPriority = false;
      }
    } else {
      const selectedTodayItem = todayItemList.find(
        (item) => item.id === e.target.id
      );
      if (!selectedTodayItem.highPriority) {
        selectedTodayItem.highPriority = true;
      } else {
        selectedTodayItem.highPriority = false;
      }
    }
  }
});

// Creating new task item:
createNewTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const getValue = addTaskInput.value;
  const inputDueDate = document.querySelector(".due-date-input");
  const getDate = inputDueDate.value;
  if (selectedListId && getValue) {
    // getResult => get currently selected object:
    const getResult = projectItemList.find(
      (item) => item.id === selectedListId
    );
    let newResult;
    // Deal with date input values:
    if (getDate) {
      newResult = generateTask(getValue, getDate);
    } else {
      newResult = generateTask(getValue, null);
    }

    // Generating task input based on 'today' or project items:
    if (selectedListId > 1 && getResult) {
      getResult.tasks.push(newResult);
    } else {
      todayItemList.push(newResult);
      console.log(todayItemList);
    }
    addTaskInput.value = null;
    datePicker.clear(); // Clear flatpickr input field.
  }
  saveAndRender();
});

// Create and validate new project items through user input:
createProjectForm.addEventListener("submit", (e) => {
  // Using 'createProjectForm' as an event is a way around selecting the specific DOM element even though that element may have not yet rendered/generated on the page which causes an error in console.
  e.preventDefault();
  const getValue = createProjectInput.value;
  // If str is null or empty, don't return any data:
  if (getValue == null || getValue === "") return;
  if (projectsContainer.classList.contains("toggle")) {
    projectsContainer.classList.remove("toggle");
  }
  const newProjectTitle = generateUniqueId(getValue);
  createProjectInput.value = null; // Reset the value once accepted.
  projectItemList.push(newProjectTitle); // Push valid new object to array.
  saveAndRender();
});

// Assign SelectedListId based on user click event on navbar:
navbar.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.id;
  } else if (e.target.tagName.toLowerCase() === "h3") {
    selectedListId = e.target.id;
  }
  saveAndRender();
});

// Delete project with click event:
projectsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "button") {
    // Returns updated copy of project list => updates rendered project list on webpage:
    projectItemList = projectItemList.filter((item) => item.id != e.target.id);
    selectedListId = null; // Default set selectedListId to null if current project is deleted.
    checkCurrentDisplay();
  }
  saveAndRender();
});

// Toggle true/false for task input:
taskItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-item-input")) {
    if (selectedListId > 1) {
      // Get the selected object from object array:
      const selectedList = projectItemList.find(
        (property) => property.id === selectedListId
      );
      // Get the item of the clicked on target id and id of the specific task that matches:
      const selectedTaskItem = selectedList.tasks.find(
        (property) => property.id === e.target.id
      );
      selectedTaskItem.complete = e.target.checked; // Toggles 'true/false' to 'complete' property.
      // renderTaskItem(selectedList);
    } else {
      const selectedTodayItem = todayItemList.find(
        (property) => property.id === e.target.id
      );
      selectedTodayItem.complete = e.target.checked;
      // renderTaskItem(todayItemList);
    }
    validNavbarRender();
  }
});

// Deleting specific task items:
taskItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn-task")) {
    const selectedList = projectItemList.find(
      (item) => item.id === selectedListId
    );
    const taskItemsAll = document.querySelectorAll(".task-items");

    taskItemsAll.forEach((item) => {
      if (e.target.id === item.id) {
        if (selectedListId > 1) {
          // Iterate through each task and if matching id is found, delete that task.
          selectedList.tasks.forEach((element) => {
            if (element.id === item.id) {
              selectedList.tasks.splice(selectedList.tasks.indexOf(element), 1); // Select tasks of specific project and remove the matching element(task) from projectListItem array.
            }
          });
        } else {
          todayItemList.forEach((element) => {
            if (element.id === item.id) {
              todayItemList.splice(todayItemList.indexOf(element), 1);
            }
          });
        }
      }
    });
  }
  saveAndRender();
});

// Toggle projectsContainer and change chevron img when click event on chevron img:
chevron.addEventListener("click", (e) => {
  projectsContainer.classList.toggle("toggle");
  if (e.target.src === "http://127.0.0.1:5500/img/chevron-double-down.svg") {
    chevron.src = "http://127.0.0.1:5500/img/chevron-double-up.svg";
  } else {
    chevron.src = "http://127.0.0.1:5500/img/chevron-double-down.svg";
  }
});

// Open modal on click and update modal input values:
taskItemsContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("edit-btn") ||
    e.target.classList.contains("edit-btn-img")
  ) {
    modal.style.display = "block";
    // Reset all messages in modal every time modal is populated:
    clearElement(document.querySelector(".user-message"));

    const modalInputTaskTitle = document.querySelector(
      ".modal-input-task-title"
    );
    const modalInputDueDate = document.querySelector(".modal-input-due-date");
    const taskListItemAll = document.querySelectorAll(".task-list-item");
    const spanDueDateAll = document.querySelectorAll(".span-due-date");

    modalInputTaskTitle.value = "";
    datePickerModal.clear(); // Clear flatpickr.

    // ?: Unable to show current span date value within the modal date input value:
    // // Update Modal date input:
    // spanDueDateAll.forEach(item => {
    //     if (item.id === e.target.id) {
    //         modalInputDueDate.value = datePickerModal.currentYear;
    //         modalInputDueDate.innerText = datePickerModal.currentYear;
    //     }
    // });
    // // Update Modal title input:
    // taskListItemAll.forEach(item => {
    //     if (item.id === e.target.id) {
    //         modalInputTaskTitle.value = item.innerText; // Modal input value becomes task item value.
    //     }
    // });
  }
});

// Storing edit button id on click event:
taskItemsContainer.addEventListener("click", (e) => {
  const targetId = e.target.id;

  // Attaching new id for modal input:
  const modalInputTaskTitle = document.querySelector(".modal-input-task-title");
  modalInputTaskTitle.id = targetId;
});

// Todo: Issue when editing title in modal input and submitting => Empty modal title input is making the list item title empty as well. If the modal title input is empty, the function should just 'return' nothing.
// Updating modal title and date input if user changes values:
modal.addEventListener("submit", (e) => {
  e.preventDefault();
  const modalInputTaskTitle = document.querySelector(".modal-input-task-title");
  const modalInputDueDate = document.querySelector(".modal-input-due-date");

  const selectedList = projectItemList.find(
    (object) => object.id === selectedListId
  );

  const todayTask = todayItemList.find(
    (property) => property.id === modalInputTaskTitle.id
  );

  if (selectedListId === "1") {
    if (
      modalInputTaskTitle.value === todayTask.task ||
      modalInputTaskTitle.value === ""
    ) {
      null;
    } else {
      todayTask.task = modalInputTaskTitle.value;
      displayMessage("title");
    }
    if (
      modalInputDueDate.value === todayTask.dueDate ||
      modalInputDueDate.value === ""
    ) {
      null;
    } else {
      todayTask.dueDate = modalInputDueDate.value;
      displayMessage("date");
    }
  } else {
    const selectedTask = selectedList.tasks.find(
      (item) => item.id === modalInputTaskTitle.id
    );
    if (
      modalInputTaskTitle.value === selectedTask.task ||
      modalInputTaskTitle.value === ""
    ) {
      null;
    } else {
      selectedTask.task = modalInputTaskTitle.value;
      displayMessage("title");
    }
    if (
      modalInputDueDate.value === selectedTask.dueDate ||
      modalInputDueDate.value === ""
    ) {
      null;
    } else {
      selectedTask.dueDate = modalInputDueDate.value;
      displayMessage("date");
    }
  }

  // if (
  //   modalInputTaskTitle.value === todayTask.task ||
  //   modalInputTaskTitle.value === ""
  // ) {
  //   console.log("No title changes have been made.");
  //   console.log(modalInputTaskTitle.value);
  //   console.log(todayTask.task);
  //   return;
  // } else {
  //   if (selectedListId === "1") {
  //     todayTask.task = modalInputTaskTitle.value;
  //   } else if (selectedListId != "1") {
  //     const selectedTask = selectedList.tasks.find(
  //       (item) => item.id === modalInputTaskTitle.id
  //     );
  //     selectedTask.task = modalInputTaskTitle.value;
  //   }
  //   // displayMessage("title");
  // }

  // if (
  //   modalInputDueDate.value === todayTask.dueDate ||
  //   modalInputDueDate.value === ""
  // ) {
  //   console.log("No date changes have been made.");
  //   return; // No date changes made in modal.
  // } else {
  //   if (selectedListId === "1") {
  //     todayTask.dueDate = modalInputDueDate.value;
  //   } else {
  //     selectedTask.dueDate = modalInputDueDate.value;
  //   }
  //   // displayMessage("date");
  // // }

  render();
});

// Close modal if close btn pressed:
modal.addEventListener("click", (e) => {
  // When the user clicks on <span> (x), close the modal
  if (e.target.classList.contains("close-modal-btn")) {
    modal.style.display = "";
  }
});

// Close modal if window target is clicked:
window.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.style.display = "";
  }
});

function printWindow() {
  window.addEventListener("click", (e) => {
    console.log("window target", e.target);
  });
}
// printWindow();

render();
