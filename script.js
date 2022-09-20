// Dealing with local storage:


// Get lists data from local storage || if none exists, then create new empty array.

const projectsContainer = document.querySelector('.projects-container');
const createProjectInput = document.querySelector('.create-project-input');
const projectItem = document.querySelector('.project-item');
const navbar = document.querySelector('.navbar');
const listTitle = document.querySelector('.list-title');
const closeBtn = document.querySelector('.close-btn');
const createProjectForm = document.querySelector('.create-project-form');



// Project items array:
const projectItemList = [];

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
        const spanCloseBtn = document.createElement('span');
        spanCloseBtn.classList.add('close-btn');
        spanCloseBtn.id = item.id;
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
        tasks: [], // Unique todo tasks for each object in the array (todo list).
    }
};

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};




//* EVENT LISTENERS:
createProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const getValue = createProjectInput.value;
    // If str is null or empty, don't return any data:
    if (getValue == null || getValue === '') return;
    const newProjectTitle = generateUniqueId(getValue);
    createProjectInput.value = null; // Reset the value once accepted.
    projectItemList.push(newProjectTitle); // Push valid new object to array.
    render();
})

navbar.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.id
        listTitle.innerText = e.target.innerText;
    }
});



// document.querySelector('.delete-btn').addEventListener('click', e => {
//     projectItemList = projectItemList.filter(item => item.id !== selectedListId) // Creates new list with filter.
//     selectedListId = null;
//     saveRender();
// });
