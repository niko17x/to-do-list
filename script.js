// Dealing with local storage using KEYS:
const LOCAL_STORAGE_LIST_KEY = 'task.projectItemList';
const LOCAL_STORAGE_SELECTED_LIST_ID = 'task.selectedListId'

// Get lists data from local storage || if none exists, then create new empty array.
let projectItemList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);


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
};

function render() {
    const selectedList = projectItemList.find(item => item.id === selectedListId);
    // Removes existing nodes so project items aren't duplicated for every loop being run:
    clearElement(projectsContainer);
    renderProjectItem();

    // Check if projectsContainer is not empty and selectedList is true, then run function:
    if (projectsContainer.hasChildNodes() && selectedList) {
        renderTaskItem(selectedList)
        renderTaskCount(selectedList)
    };
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
    selectedList.tasks.forEach((entry) => {
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

        // //! Test Start:
        // // Todo: 
        // // Convert the ids from list element from number to string for comparison:
        // const listStringConvert = taskListItem.id.toString();
        // // Get selected list tasks id that where 'complete === true' and put all ids into an array:
        // const foo = [];
        // const completedTasks = selectedList.tasks.filter(item => {
        //     if (item.complete === true) {
        //         foo.push(item.id);
        //     }
        // })

        // console.log(foo)



        // //! Test End.

        taskItemLabel.append(taskItemSpan, taskItemInput);
        divTaskItems.append(taskItemLabel, taskListItem);
        taskItemsContainer.append(divTaskItems);
    })
};


// function foo() {
//     const selectedList = projectItemList.find(item => item.id === selectedListId);
//     // Gets all tasks with .complete = true;
//     // const completedTasks = selectedList.tasks.filter(item => item.complete === true);
//     // const completedTasks = selectedList.tasks.filter(item => item.complete === true).map((item) => item.id);
//     const completedTasks = selectedList.tasks.filter(item => item.complete === true).map((item) => item.id);
// };



// Deal with the task counter in the task container:
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(item => !item.complete).length // Get the length of 'complete: false' properties in tasks.
    const taskCounterText = incompleteTaskCount === 1 ? "task" : "tasks";
    taskCounter.innerText = `${incompleteTaskCount} ${taskCounterText} remaining`
};

// Returns each task item from the selectedListId specific object: => this func currently being used inside renderTaskItem() but not this function specifically;
// function getTaskItem() {
//     const selectedList = projectItemList.find(item => item.id === selectedListId);
//     selectedList.tasks.forEach(function(entry) {
//         generateTask(entry.task);
//     })
// };



//! TESTING END.

//* EVENT LISTENERS:
// Submit form once user creates value in 'Enter New Task' input:

createNewTaskForm.addEventListener('submit', e => {
    const getValue = addTaskInput.value;
    e.preventDefault();
    if (selectedListId && getValue != null || getValue === '') {
        // getResult => get currently selected object:
        const getResult = projectItemList.find(item => item.id === selectedListId);
        const newResult = generateTask(getValue); 
        addTaskInput.value = null;
        getResult.tasks.push(newResult);
        console.log(getResult);
    } else {
        return;
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

navbar.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.id
        listTitle.innerText = e.target.innerText;
        saveAndRender();
    }
});

// Obtain the id of the element => Return a new project list with that id filtered out.
projectsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') {
        // Returns updated copy of project list => updates rendered project list on webpage:
        projectItemList = projectItemList.filter(item => item.id != e.target.id);
    }
    console.log(projectItemList);
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
    };
    save();
});

function printWindow() {
    window.addEventListener('click', e => {
        console.log('window target', e.target);
    });
};
// printWindow();
    

render();
