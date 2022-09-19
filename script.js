// Dealing with local storage:
const LOCAL_STORAGE_LIST_KEY = 'task.projectItemList';
// const LOCAL_STORAGE_LIST_ID_KEY = 'task.selectedListId';

let projectItemList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []; // Get lists data from local storage || if none exists, then create new empty array.
// let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY);

const projectsContainer = document.querySelector('.projects-container');
const createProjectInput = document.querySelector('.create-project-input');
const createProjectBtn = document.querySelector('.create-project-btn');
const projectItem = document.querySelector('.project-item');
const navbar = document.querySelector('.navbar');
const listTitle = document.querySelector('.list-title');

// Local storage:
function save() {
    console.log(projectItemList.length)
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(projectItemList));
    // localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId);
};

function saveRender() {
    save();
    render();
};

// Project items array:
// const projectItems = [];

function render() {
    // Removes existing nodes so project items aren't duplicated for every loop being run:
    clearElement(projectsContainer);
    renderProjectItem();
    saveRender();
};

// Dynamically creating new projects:
function renderProjectItem() {
    projectItemList.forEach(item => {
        const divProjectItem = document.createElement('div');
        divProjectItem.classList.add('project-item');
        // divProjectItem.id = item.id;
        const spanCloseBtn = document.createElement('span');
        spanCloseBtn.classList.add('close-btn');
        spanCloseBtn.innerHTML = '&#10005';
        const liProjectItemTitle = document.createElement('li');
        liProjectItemTitle.classList.add('project-item-title');
        liProjectItemTitle.id = item.id;
        liProjectItemTitle.innerText = item.projectName;

        // if (item.id === selectedListId) {
        //     liProjectItemTitle.classList.add('active');
        // }
    
        divProjectItem.append(spanCloseBtn, liProjectItemTitle);
        projectsContainer.append(divProjectItem);
    })
};


// Need object data to insert into 'projectItems' array and create unique id for each entry:
function generateUniqueId(title) {
    return {
        id: Date.now().toString(), // Generate unique id.
        projectName: title,
    }
};

// Validate the project name input value and push valid value into 'projectItems' array:
function validateProjectInput() {
    const getValue = createProjectInput.value;
    // If str is null or empty, don't return any data:
    if (getValue == null || getValue === '') return;
    const newProjectTitle = generateUniqueId(getValue);
    createProjectInput.value = null; // Reset the value once accepted.
    projectItems.push(newProjectTitle); // Push valid new object to array.
};

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}



//* EVENT LISTENERS:
createProjectBtn.addEventListener('click', e => {
    e.preventDefault();
    validateProjectInput();
    saveRender();
})

// navbar.addEventListener('click', e => {
//     if (e.target.tagName.toLowerCase() === 'li') {
//         selectedListId = e.target.id
//         listTitle.innerText = e.target.innerText;
//         saveRender();
//     }
// });


// TODO: FIGURE OUT WHY THE LOCAL STORAGE ISN'T WORKING AS IT SHOULD.