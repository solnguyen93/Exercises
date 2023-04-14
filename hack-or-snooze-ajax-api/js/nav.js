'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
    hidePageComponents();
    putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on('click', navLoginClick);

function navSubmit(e) {
    e.preventDefault();
    hidePageComponents();
    putStoriesOnPage();
    submitForm.style.display = 'flex';
}
const navSubmitLink = document.querySelector('#nav-link-submit');
navSubmitLink.addEventListener('click', navSubmit);

function navMyStories(e) {
    e.preventDefault();
    hidePageComponents();
    putMyStoriesOnPage();
    myStoriesList.style.display = 'block';
}
const navMyStoriesLink = document.querySelector('#nav-link-myStories');
navMyStoriesLink.addEventListener('click', navMyStories);

function navFav(e) {
    e.preventDefault();
    hidePageComponents();
    favoritesList.style.display = 'block';
}
const navFavLink = document.querySelector('#nav-link-favorites');
navFavLink.addEventListener('click', navFav);
/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
    navBarLinks.style.display = 'block';
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.username}`).show();
    putStoriesOnPage();
}
