// TODO: 1. Deleting individual tasks within projects - DONE /// 2. Clicking on 'Today' on the navbar displays 'Today task items' and not the project task items /// 3. Insert 'filler task items' when new project is created and user has not created a task yet /// 4. Updating dynamic title to correspond correctly with selected project, null or 'today'.


// Dealing with local storage using KEYS:
const LOCAL_STORAGE_LIST_KEY = 'task.projectItemList';
const LOCAL_STORAGE_SELECTED_LIST_ID = 'task.selectedListId'

//! Testing:
const LOCAL_STORAGE_TODAY_KEY = 'task.todayItemList';

// Get lists data from local storage || if none exists, then create new empty array.
let projectItemList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);

//! Testing:
let todayItemList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODAY_KEY)) || [];

// DOM selectors:
const projectsContainer = document.querySelector('.projects-container');
const createProjectInput = document.querySelector('.create-project-input');
const projectItem = document.querySelector('.project-item');
const navbar = document.querySelector('.navbar');
const listTitle = document.querySelector('.list-title');
const deleteBtn = document.querySelector('.delete-btn');
const createProjectForm = document.querySelector('.create-project-form');
const subtitleToday = document.querySelector('.subtitle-today');
const createNewTaskForm = document.querySelector('.create-new-task-form');
const addTaskInput = document.querySelector('.add-task-input');
const taskItemsContainer = document.querySelector('.task-items-container');
const taskItemInput = document.querySelector('.task-item-input');
const projectItemTitle = document.querySelectorAll('.project-item-title');
const template = document.querySelector('template');
const taskItems = document.querySelector('.task-items');
const taskCounter = document.querySelector('.task-counter');



function saveAndRender() {
    save()
    render()
};

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(projectItemList));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
    localStorage.setItem(LOCAL_STORAGE_TODAY_KEY, JSON.stringify(todayItemList));
};

function render() {
    const selectedList = projectItemList.find(item => item.id === selectedListId);
    // Removes existing nodes so project items aren't duplicated for every loop being run:
    clearElement(projectsContainer);
    displayTodayTask(selectedList);
    renderProjectItem();
    validNavbarRender(selectedList);
};

// Check if projectsContainer is not empty and selectedList is true && 'today' id is not currently selected, then run function:
function validNavbarRender(selectedList) {
    if (projectsContainer.hasChildNodes() && selectedList && selectedListId != '1') {
        renderTaskItem(selectedList.tasks)
        renderTaskCount(selectedList)
    } else {
        renderTaskItem(todayItemList);
    }
};

// Display main title with 'Today' or project title:
function displayTodayTask(selectedList) {
    // Default to 'Today' if no project lists are present:
    if (selectedListId === '1' || projectItemList.length === 0) {
        listTitle.innerText = 'Today';
    } else if (selectedListId) {
        listTitle.innerText = selectedList.projectName;
    }
    save();
};

// Clear all element nodes if projectItemList is empty or selectedListId is null:
function checkCurrentDisplay() {
    if (projectItemList.length === 0 || selectedListId == null) {
        clearElement(taskItemsContainer)
    }
};

// Dynamically creating new projects:
function renderProjectItem() {
    projectItemList.forEach(item => {
        const divProjectItem = document.createElement('div');
        divProjectItem.classList.add('project-item');
        // divProjectItem.id = item.id;
        const btnDeleteButton = document.createElement('button');
        btnDeleteButton.classList.add('delete-btn');
        btnDeleteButton.id = item.id;
        btnDeleteButton.innerHTML = '&#10005';
        const liProjectItemTitle = document.createElement('li');
        liProjectItemTitle.classList.add('project-item-title');
        liProjectItemTitle.id = item.id;
        liProjectItemTitle.innerText = item.projectName;

        if (item.id === selectedListId) {
            liProjectItemTitle.classList.add('active');
        }
    
        divProjectItem.append(btnDeleteButton, liProjectItemTitle);
        projectsContainer.append(divProjectItem);
    })
};

// Need object data to insert into 'projectItems' array and create unique id for each entry:
function generateUniqueId(title) {
    return {
        id: Date.now().toString(), // Generate unique id.
        projectName: title,
        tasks: [] // Unique todo tasks for each object in the array (todo list).
    }
};

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

// Generate an object for tasks inside projectListItem array:
function generateTask(title) {
    return {
        id: Date.now().toString(),
        task: title,
        complete: false,
    }
};

// Generate task items:
function renderTaskItem(selectedList) {
    clearElement(taskItemsContainer)
    selectedList.forEach((entry) => {
        // const taskElement = document.importNode(template.content, true);
        // taskItemsContainer.append(taskElement);

        const divTaskItems = document.createElement('div');
        divTaskItems.classList.add('task-items');
        divTaskItems.id = entry.id;
        const taskItemLabel = document.createElement('label');
        taskItemLabel.classList.add('task-item-label');
        taskItemLabel.setAttribute('for', 'task-item');
        const taskItemSpan = document.createElement('span');
        taskItemSpan.classList.add('task-item-span');
        const taskItemInput = document.createElement('input');
        taskItemInput.id = entry.id;
        taskItemInput.checked = entry.complete;
        taskItemInput.classList.add('task-item-input');
        taskItemInput.setAttribute('type', 'checkbox');
        taskItemInput.setAttribute('name', 'task');
        taskItemInput.checked = entry.complete;
        const taskListItem = document.createElement('li');
        taskListItem.classList.add('task-list-item');
        taskListItem.id = entry.id;
        taskListItem.innerText = entry.task;
        const deleteBtnTask = document.createElement('button');
        deleteBtnTask.id = entry.id;
        deleteBtnTask.classList.add('delete-btn-task');
        deleteBtnTask.setAttribute('type', 'submit');
        deleteBtnTask.innerHTML = '&#10005'


        // Add 'complete' class to li elements match the same id as the id for each task with '.complete === true':
        const listStringConvert = taskListItem.id.toString(); // Convert the ids from list element from number to string for comparison:
        const completedTasks = []; // Get selected list tasks id that where 'complete === true' and put all ids into an array:
        selectedList.filter(item => {
            if (item.complete === true && selectedListId) { completedTasks.push(item.id) }
        })
        if (completedTasks.includes(listStringConvert)) { taskListItem.classList.add('complete') }

        taskItemLabel.append(taskItemSpan, taskItemInput);
        divTaskItems.append(taskItemLabel, taskListItem, deleteBtnTask);
        taskItemsContainer.append(divTaskItems);
    })
};

// Deal with the task counter in the task container:
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(item => !item.complete).length // Get the length of 'complete: false' properties in tasks.
    const taskCounterText = incompleteTaskCount === 1 ? "task" : "tasks";
    taskCounter.innerText = `${incompleteTaskCount} ${taskCounterText} remaining`
};

// Creating new task item:
createNewTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const getValue = addTaskInput.value;
    if (selectedListId && getValue) {
        // getResult => get currently selected object:
        const getResult = projectItemList.find(item => item.id === selectedListId);
        const newResult = generateTask(getValue); 
        addTaskInput.value = null;

        // Generating task input based on 'today' or project items:
        if (selectedListId != 1 && getResult) {
            getResult.tasks.push(newResult);
        } else {
            todayItemList.push(newResult);
            console.log(todayItemList)
        }
    }
    saveAndRender();
});

// Validate user project name value input from user and if valid, push the newly created object using 'generateUniqueId(getValue) and render to page:
createProjectForm.addEventListener('submit', e => { // Using 'createProjectForm' as an event is a way around selecting the specific DOM element even though that element may have not yet rendered/generated on the page which causes an error in console.
    e.preventDefault();
    const getValue = createProjectInput.value;
    // If str is null or empty, don't return any data:
    if (getValue == null || getValue === '') return;
    const newProjectTitle = generateUniqueId(getValue);
    createProjectInput.value = null; // Reset the value once accepted.
    projectItemList.push(newProjectTitle); // Push valid new object to array.
    saveAndRender();
});

// Assign SelectedListId based on user click event on navbar:
navbar.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.id
    } else if (e.target.tagName.toLowerCase() === 'h3') {
        selectedListId = e.target.id
    }
    saveAndRender();
});

// Delete project with click event:
projectsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') {
        // Returns updated copy of project list => updates rendered project list on webpage:
        projectItemList = projectItemList.filter(item => item.id != e.target.id);
        selectedListId = null; // Default set selectedListId to null if current project is deleted.
        checkCurrentDisplay();
    }
    saveAndRender();
});

// Toggle true/false for task input:
taskItemsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        // Get the selected object from object array:
        const selectedList = projectItemList.find(property => property.id === selectedListId);
        // Get the item of the clicked on target id and id of the specific task that matches:
        const selectedTaskItem = selectedList.tasks.find(property => property.id === e.target.id);
        selectedTaskItem.complete = e.target.checked; // Toggles 'true/false' to 'complete' property.
        renderTaskItem(selectedList);
    };
    save();
});

// Deleting specific task items:
taskItemsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') {
        const selectedList = projectItemList.find(item => item.id === selectedListId);
        const taskItemsAll = document.querySelectorAll('.task-items');
        
        taskItemsAll.forEach(item => {
            if (e.target.id === item.id) {
                // Iterate through each task and if matching id is found, delete that task.
                selectedList.tasks.forEach(element => {
                    if (element.id === item.id) {
                        selectedList.tasks.splice(selectedList.tasks.indexOf(element), 1); // Select tasks of specific project and remove the matching element(task) from projectListItem array.
                    }
                });
            }
        })
    }
    saveAndRender();
});

function printWindow() {
    window.addEventListener('click', e => {
        console.log('window target', e.target);
    });
};
// printWindow();
    

render();
