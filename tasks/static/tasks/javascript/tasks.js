import { getListTasks } from "./lists.js";

document.addEventListener('DOMContentLoaded' ,() => {
    // Load user tasks
    getTasks()

    // User submits new task
    document.querySelector('#add-task').addEventListener('click', (event) => {
        event.preventDefault();
        addTask();
    });
});

export function getTasks() {
    // API GET request to fetch user tasks
    fetch('tasks/')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Update page title
        document.querySelector('.page-title').innerHTML = '<h2>All Tasks</h2>';
        renderTasks(data);
    })
    .catch(error => console.error(error));
}

export function renderTasks(tasks) {
    const tasksContainer = document.querySelector('.tasks-container');
    // Clear user tasks
    tasksContainer.innerHTML = '';
    // Render each task object
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-div');

        // Create task checkbox
        const taskCheckboxDiv = document.createElement('div');
        const taskCheckbox = document.createElement('button');
        taskCheckbox.classList.add('task-checkbox');
        
        // Create task details div
        const taskDetailsDiv = document.createElement('div');
        // Add task name
        const taskName = document.createElement('h4');
        taskName.classList.add('task-name');
        taskName.innerText = task.task_name;
        taskDetailsDiv.appendChild(taskName);
       
        // If not null, add task date
        if (task.date_due != null) {
            const taskDue = document.createElement('p');
            taskDue.classList.add('task-due');
            taskDue.style.color = 'grey';
            // Highlight overdue tasks (i.e. due date < current date)
            if (task.days_until_due < 0 ) {
                taskDue.innerText = 'Overdue';
                taskDue.style.color = '#D10000';
            // If task due in <= 10 days, display days until due
            } else if (task.days_until_due == 0) {
                taskDue.innerText = `Due today`;
            } else if (task.days_until_due == 1) {
                taskDue.innerText = `Due tomorrow`;
            } else if (task.days_until_due <= 10) {
                taskDue.innerText = `Due in ${task.days_until_due} days`;
            // else, display task date due in DD/MM/YYYY format
            } else {
                taskDue.innerText = `Due: ${reformatDateStr(task.date_due)}`;
            };
            taskDetailsDiv.appendChild(taskDue);
        }

        // If not null, add task list
        if (task.list != null) {
        const taskList = document.createElement('p');
        taskList.classList.add('task-list');
        // Given list.id, fetch list_name
        fetch(`list/${task.list}`)
        .then(response => response.json())
        .then(listData => {
            taskList.innerText = listData.list_name;
            // User clicks on task list to go to list page
            taskList.addEventListener('click', () => {
            getListTasks(listData);
            });
        })
        .catch(error => console.error(error));
        taskDetailsDiv.appendChild(taskList);
        };

        // Display task checkbox and details on page
        taskDiv.appendChild(taskCheckboxDiv);
        taskDiv.appendChild(taskDetailsDiv);
        tasksContainer.appendChild(taskDiv);

        // Display 'X' within checkbox on mouseover
        taskCheckbox.addEventListener('mouseover', () => {
            taskCheckbox.innerText = 'X';
        });
        taskCheckbox.addEventListener('mouseout', () => {
            taskCheckbox.innerText = '';
        });
        taskCheckboxDiv.appendChild(taskCheckbox);

        // User clicks task checkbox to complete/remove task
        taskCheckbox.addEventListener('click', () => removeTask(task));
    });
}
    
async function addTask() {
    // Read due date from add-task-form 
    let date_due = document.querySelector('#id_date_due').value;
    if (date_due == '') {
        date_due = null;
    } else {
        date_due = date_due;
    }

    // API POST request to create new task
    const response = await fetch('tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            task_name: document.querySelector('#id_task_name').value,
            date_due: date_due,
            list: document.querySelector('#id_list').value,
        })
    });
    // Apply light grey border to all add-task-form input fields
    document.querySelector('#id_task_name').style.borderColor = 'lightgrey';
    document.querySelector('#id_date_due').style.borderColor = 'lightgrey';
    document.querySelector('#id_list').style.borderColor = 'lightgrey';
    if (response.ok) {
        const data = await response.json();
        // Reset add-task-form
        document.querySelector('.add-task-form').reset();
        // Reload user tasks
        getTasks();
    } else {
        const error = await response.json();
        console.log(error);
        // Highlight invalid input field/s with red border
        for (const field in error) {
            document.querySelector(`#id_${field}`).style.borderColor = '#D10000';
        };
    };
}

async function removeTask(task) {
    const listId = task.list;
    // API DELETE request to remove task
    await fetch(`task/${task.id}/`,  {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    });
    if (document.querySelector('.add-task-form').style.display == 'none') {
        // If user on list page, reload that list
        fetch(`list/${listId}`)
        .then(response => response.json())
        .then(listData => {
            getListTasks(listData);
        })
        .catch(error => console.error(error));
    } else {
        // else, reload 'all tasks'
        getTasks();
    }
}

function reformatDateStr(dateStr) {
    // Convert YYYY-MM-DD date to DD/MM-YYYY date
    let dateArray = dateStr.split('-');
    let reformattedDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
    return reformattedDate;
}