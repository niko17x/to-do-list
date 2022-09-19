# to-do-list


<!-- TODO: -->
1. User 'Enter Project Name' value is filled.
2. User clicks and submits 'Create New Project' button.
3. validateProjectInput() is run to make sure the value of the 'Enter Project Name' input is not null or empty.
4. Once validated, generateUniqueId(title) function is run to create a new ID and 'title' parameter becomes the 'Enter Project Name' value. All this becomes a new object with a new ID and projectName.
5. The new object created is now pushed to the array object => 'projectItems'.
6. renderProjectItem() function is now invoked which will firstly invoke the clearElement(element) function to remove any existing nodes within the DOM (specifically, nodes from '.projects-container') from previous execution of renderProjectItem(). This prevents any duplication from the .forEach loop. In essence, wiping the slate clean to prevent duplicates...
7. Finally, the project name will be rendered to the webpage.