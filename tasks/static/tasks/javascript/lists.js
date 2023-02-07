import { mobileBreakpoint, hideNavbar } from './main.js';
import { getTasks, renderTasks } from './tasks.js';

document.addEventListener('DOMContentLoaded' ,() => {
    // Load user lists
    getLists();

    // User submits new list
    document.querySelector('#add-list').addEventListener('click', (event) => {
        event.preventDefault();
        addList();
    });
});

function getLists() {
    // API GET request to fetch user lists
    fetch('lists/')
    .then(response => response.json())
    .then(data => {
        resetFormSelect(data);
        renderLists(data);
    })
    .catch(error => console.error(error));
}

export function getListTasks(list) {
    // API GET request to fetch tasks from specified list
    fetch(`tasks/${list.id}/`)
    .then(response => response.json())
    .then(data => {
        // Hide add task form if user on list page
        document.querySelector('.add-task-form').style.display = 'none';
        
        // Clear page title
        const pageTitle = document.querySelector('.page-title');
        pageTitle.innerHTML = '';
       
        // Update page title with list name
        const listTitle = document.createElement('h2');
        listTitle.innerText = list.list_name;
        
        // Create list checkbox
        const listCheckbox = document.createElement('button');
        listCheckbox.classList.add('list-checkbox');
        pageTitle.appendChild(listCheckbox);
        pageTitle.appendChild(listTitle);
        
        // Display 'X' within checkbox on mouseover
        listCheckbox.addEventListener('mouseover', () => {
            listCheckbox.innerText = 'X';
        });
        listCheckbox.addEventListener('mouseout', () => {
            listCheckbox.innerText = '';
        });

        // User clicks checkbox to complete/remove list
        listCheckbox.addEventListener('click', () => removeList(list));
        
        // Render list tasks
        renderTasks(data);

        // Hide mobile navbar
        if (window.innerWidth <= mobileBreakpoint) {
            hideNavbar();
        };
    })
    .catch(error => console.error(error));
} 

function resetFormSelect(lists) {
    const selectListMenu = document.querySelector('#id_list');
    // Add empty option
    selectListMenu.innerHTML = '<option value="" selected="">---------</option>';
    // Update select menu options with current user lists
    lists.forEach(list => {
        let option = document.createElement('option');
        option.value = list.id;
        option.innerText = list.list_name;
        selectListMenu.appendChild(option);
    });
}

function renderLists(lists) {
    const listsContainer = document.querySelector('.lists-container');
    // Clear user lists
    listsContainer.innerHTML = '';
    // Render each list object
    lists.forEach(list => {
        const listObj = document.createElement('li');
        listObj.innerText = list.list_name;
        listsContainer.appendChild(listObj);
    
        // User clicks on list name to view list page
        listObj.addEventListener('click', () => getListTasks(list));
    });
}

async function addList() {
    // API POST request to create new list
    const response = await fetch('lists/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            list_name: document.querySelector('#id_list_name').value,
        })
    });
    if (response.ok) {
        const data = await response.json();
        // Reset add-list-form
        document.querySelector('.add-list-form').reset();
        document.querySelector('#id_list_name').style.borderColor = 'white';
        // Reload user lists
        getLists();
    } else {
        const error = await response.json();
        // Highlight invalid input field with red border
        document.querySelector('#id_list_name').style.borderColor = '#D10000';
    };
}

async function removeList(list) {
    // API DELETE request to remove list
    await fetch(`list/${list.id}/`,  {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    });
    // Reload user lists
    getLists();
    // Reload 'all tasks'
    getTasks();
    document.querySelector('.add-task-form').style.display = 'flex';
}