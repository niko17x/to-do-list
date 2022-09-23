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


function saveAndRender() {
    save()
    render()
};

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(projectItemList));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
};

function render() {
    // Removes existing nodes so project items aren't duplicated for every loop being run:
    clearElement(projectsContainer);
    renderProjectItem();

    const selectedList = projectItemList.find(item => item.id === selectedListId);
    // Check if projectsContainer is not empty and selectedList is true, then run function:
    if (projectsContainer.hasChildNodes() && selectedList) { renderTaskItem(selectedList) };
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



//! TESTING START:

const testing1 = [
    {
        id: 1,
        projectName: 'Project 1',
        tasks: [
            {
                id: 1,
                task: 'Do dishes',
                complete: true,
            }
        ]
    },
    {
        id: 2,
        projectName: 'Project 2',
        tasks: [
            {
                id: 2,
                task: 'Do groceries',
                complete: true,
            },
            {
                id: 2,
                task: 'Do groceries again',
                complete: true,
            },

        ]
    }
];

// testing1.forEach(function(obj) {
//     const res = obj.tasks.map(function(o) {
//         return o.task;
//     })
// });

// getObjectOfSelectedListId().forEach(function(entry) {
//     entry.tasks.forEach(function(task) {
//         console.log(task.task);
//     })
// });

// getObjectOfSelectedListId().tasks.forEach(function(entry) {
//     console.log(entry.task)
// })

const taskItemInput = document.querySelector('.task-item-input');
const projectItemTitle = document.querySelectorAll('.project-item-title');
const template = document.querySelector('template');
const taskItems = document.querySelector('.task-items');

// Generate task items:
function renderTaskItem(selectedList) {
    clearElement(taskItemsContainer)
    selectedList.tasks.forEach((entry) => {
        // const taskElement = document.importNode(template.content, true);
        // taskItemsContainer.append(taskElement);

        const divTaskItems = document.createElement('div');
        divTaskItems.classList.add('task-items');
        const taskItemLabel = document.createElement('label');
        taskItemLabel.classList.add('task-item-label');
        taskItemLabel.setAttribute('for', 'task-item');
        const taskItemSpan = document.createElement('span');
        taskItemSpan.classList.add('task-item-span');
        const taskItemInput = document.createElement('input');
        taskItemInput.classList.add('task-item-input');
        taskItemInput.setAttribute('type', 'checkbox');
        taskItemInput.setAttribute('name', 'task');
        taskItemInput.setAttribute('id', 'task');
        // taskItemInput.setAttribute('checked', '');
        const taskListItem = document.createElement('li');
        taskListItem.classList.add('task-list-item');
        taskListItem.innerText = entry.task;

        taskItemLabel.append(taskItemSpan, taskItemInput);
        divTaskItems.append(taskItemLabel, taskListItem);

        taskItemsContainer.append(divTaskItems);
    })
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
})

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

taskItemsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = projectItemList.find(item => item.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save()
        // renderTaskCount();
    }
})

render();

//? THOROUGHLY THINK THROUGH THE GOAL OF THE FUNCTION => WRITE DOWN THE STEPS AND FOLLOW THROUGH EACH STEP LIKE YOU DID.