# CS50W Capstone - MyTasks

My [CS50W](https://cs50.harvard.edu/web/2020/) capstone project, entitled *MyTasks*, is a task management web-application that helps users manage their tasks online. Once registered, MyTask users can easily add and remove personal tasks, set optional task due dates and organise their tasks into separate lists. Repsonsive design ensures MyTasks will adapt to different devices.
<br>

▶️ See [video preview]().
<br>

📝 See [project specifications](https://cs50.harvard.edu/web/2020/projects/final/capstone/).
<br>

The **backend** of this application is built using Django. User data is stored in a postgres database and accessed via an API built using the Django REST framework. 
<br>

### Django Models:
- `User` - Utilises Django's `AbstractUser` model.
- `List` - Stores all user created lists. A foreign key links each list to an individual user.
- `Task` - Stores all user created tasks, including user generated names, the date each task was created and optionally the date each task is due to be completed. A foreign key links each task to an individual user. Additionally, a second foreign key optionally links each task a list in which it is included. Tasks are primarily ordered by their due date, although if this is not provided, a user's most recently added tasks are disaplyed first.
<br>

### Django Routes:
- **Login** `login/` - Users are redirected to the index page if a valid username and password are provided via the login form.
- **Register** `register/` - A new user object is created if a valid username, password and password confirmation are provided via the registration form. If successful, users are redirected to the index page.
- **Logout** `logout/` - When the logout icon is clicked, users are logged out and redirected back to the login page.
- **Index** `/` - Instantiates an empty *add-list-form* and *add-task-form* to render on the application's main page.
#### API Endpoints:
- `lists/` - Retrieves all user lists via a GET request. Creates a new user list via a POST request when the *add-list-form* is submitted.
- `list/<list_id>` - Retrieves a single user list via a GET request. Removes a completed user list via a DELETE request when the *list-checkbox* is clicked.
- `tasks/` - Retrieves all user tasks via a GET request. Creates a new user task via a POST request when the *add-task-form* is submitted.
- `tasks/<list_id>` - Utilises the optional *list_id* parameter in the *api_tasks* view to retrieve all user tasks within a single list via a GET request.
- `task/<task_id>` - Retrieves a single user task via a GET request. Removes a completed user task via a DELETE request when the *task-checkbox* is clicked.
<br>

The **frontend** of this application is built using HTML, CSS/Sass and Vanilla JavaScript. Inspired by the popularity of single-page applications (SPAs) this project only contains 3 HTML pages (including `layout.html`, `index.html` and `login.html`) and instead relies on JavaScript/AJAX (including `main.js`, `lists.js` and `tasks.js`) to dynamically update sections of the page as required. This means when a user adds or removes a task the page is automatically updated without the need to refresh or load a new page. This improves user experience (UX) and application performance. Additionally, the use of Sass, a CSS pre-processer, improves stylesheet readability and enables code modularisation.

<br>

## Distinctiveness and Complexity:
This project is disctinct from previous course projects. It is neither an e-commerce site nor a social network as produced in projects 2 and 4 respectively. As per the course requirements, this project is built using Django on the back-end, including 2 custom models (as per above), and JavaScript on the front-end. Additionally, this project utilizes CSS layout models, media queries and JavaScript event handlers to ensure mobile-responsiveness.

<br>

## Directory and File Contents:
    - planner/  <-- Project directory.
        - __init__.py  <-- Auto-generated by Django. 
        - agsi.py  <-- Auto-generated by Django. 
        - settings.py  <-- Project configuration.
        - urls.py  <-- Define project routes.
        - wsgi.py  <-- Auto-generated by Django. 
    - tasks/  <-- Application directory.
        - migrations  <-- Contain migration files.
        - static/tasks  <-- Contain app static files.
            - css  <-- Contain stylesheets.
                - scss  <-- Contain Sass (.scss) files.
                    - scss_parials  <-- Contain Sass (.scss) partials.
                    - main.scss  <-- Main Sass source file.
                - styles.css  <-- Main compiled CSS file.
                - styles.css.map  <-- Auto-generated by Sass.
            - images/icons  <-- Contain .svg icons
            - javascript  <-- Contain JavaScript files.
                - lists.js  <-- Script which uses fetch API to GET, POST and DELETE user lists.
                - main.js  <-- Script which constrols navbar interactivity.
                - tasks.js  <-- Script which uses fetch API to GET, POST and DELETE user tasks.
        - templaces/tasks  <-- Contain app HTML templates.
            - index.html <-- Extends layout.html, displays index page content.
            - layout.html  <-- Base template.
            - login.html  <-- Renders login and registration forms.
        - __init__.py  <-- Auto-generated by Django. 
        - admin.py  <-- Define models accessed in Django admin interface.
        - apps.py  <-- Auto-generated by Django. 
        - forms.py  <-- Define application model forms.
        - models.py  <-- Define application models.
        - serializers.py  <-- Contain serializers to convert complex data to JSON.
        - test.py  <-- Auto-generated by Django.
        - urls.py  <-- Define application routes.
        - views.py  <-- Contain application views.
    - .gitignore  <--- Specify untracked files.
    - Procfile  <-- Specify app startup commands for deployment on Heroku.
    - manage.py  <-- Command-line utility auto-generated by Django.
    - requirements.txt  <-- List of project dependencies.
    - runtime.txt  <-- Specify Python version for deployment on Heroku.

<br>

## Installation:

1. Clone this repository.
2. 
3. Run `python manage.py runserver` to start the web server.
4. 

<br>

## Screenshots:
