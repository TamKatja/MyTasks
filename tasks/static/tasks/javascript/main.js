export const mobileBreakpoint = 600;
const pageContent = document.querySelector('main');
const navbar = document.querySelector('.navbar');
const toggleNavbar = document.querySelector('#toggle-nav');
const toggleLists = document.querySelector('#toggle-lists');
const listsContainer = document.querySelector('.lists-container');

document.addEventListener('DOMContentLoaded' ,() => {

    // Hide navbar by default on mobile screens
    if (window.innerWidth <= mobileBreakpoint) {
        hideNavbar();
    }

    // User clicks to hide or show navbar
    toggleNavbar.addEventListener('click', () => {
        navbar.classList.toggle('hidden') 
        if (navbar.classList.contains('hidden')) {
            hideNavbar();
        } else {
            showNavbar();
        }
    });

    // User clicks to collapse or expand lists
    document.querySelector('.my-lists-title').addEventListener('click', () => {
        listsContainer.classList.toggle('collapsed') 
        if (listsContainer.classList.contains('collapsed')) {
            collapseLists();
        } else {
            expandLists();
        }
    });
});

export function hideNavbar() {
    navbar.classList.add('hidden');
    navbar.style.transition = 'all 0.2s ease';
    navbar.style.transform = 'translateX(-100%)';
    pageContent.style.marginLeft = '0';
    toggleNavbar.style.transform = 'rotate(180deg)';
}
    
function showNavbar() {
    let navbarWidth = '200px';
    navbar.style.transition = 'all 0.2s ease';
    navbar.style.transform = 'translateX(0)';
    toggleNavbar.style.transform = 'rotate(0deg)';

    // Show mobile navbar if screen <= 600px
    if (window.innerWidth <= mobileBreakpoint) {
        navbar.style.width = '100vw';
        pageContent.style.marginLeft = '0';
    } else {
        navbar.style.width = navbarWidth;
        pageContent.style.marginLeft = navbarWidth;
    }
}

function collapseLists() {
    toggleLists.style.transform = 'rotate(180deg)';
    listsContainer.style.display = 'none';
}

function expandLists() {
    toggleLists.style.transform = 'rotate(0deg)';
    listsContainer.style.display = 'flex';
}