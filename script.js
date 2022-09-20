// Dealing with local storage using KEYS:
const LOCAL_STORAGE_LIST_KEY = 'task.projectItemList';
const LOCAL_STORAGE_SELECTED_LIST_ID = 'task.selectedListId'

// Project items array:
let projectItemList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);



// Get lists data from local storage || if none exists, then create new empty array.

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
        tasks: [], // Unique todo tasks for each object in the array (todo list).
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
        task: title,
        complete: false,
    }
};

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
})



//* EVENT LISTENERS:

createProjectForm.addEventListener('submit', e => {
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

// 
// Obtain the id of the element => Return a new project list with that id filtered out.
projectsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') {
        // Returns updated copy of project list => updates rendered project list on webpage:
        projectItemList = projectItemList.filter(item => item.id != e.target.id);
    }
    console.log(projectItemList);
    saveAndRender();
})







render();

//? THOROUGHLY THINK THROUGH THE GOAL OF THE FUNCTION => WRITE DOWN THE STEPS AND FOLLOW THROUGH EACH STEP LIKE YOU DID.