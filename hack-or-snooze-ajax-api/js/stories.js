'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();

    putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, alsoMyStories) {
    const hostName = story.getHostName();
    let favHtml = '';
    let trashHtml = '';
    const isFav = currentUser.isFavorite(story);
    if (isFav && alsoMyStories) {
        favHtml = 'fas fa-star';
        trashHtml = 'fas fa-trash-alt';
    } else if (isFav && !alsoMyStories) {
        favHtml = 'fas fa-star';
        trashHtml = '';
    } else if (!isFav && alsoMyStories) {
        favHtml = 'far fa-star';
        trashHtml = 'fas fa-trash-alt';
    } else {
        favHtml = 'far fa-star';
        trashHtml = 'fas fa-trash-alt';
    }

    return $(`
      <li id="${story.storyId}">
        <small class="star">
          <i class="${favHtml}" ></i>
        </small>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <small style="display: block" class="trash-can">
          <i class="${trashHtml}"></i>
        </small>
      </li>
    `);
}

function generateStoryloggedOut(story) {
    const hostName = story.getHostName();
    return $(`
  <li id="${story.storyId}">
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
    if (!currentUser) {
        for (let story of storyList.stories) {
            const $story = generateStoryloggedOut(story);
            $allStoriesList.append($story);
        }
    } else {
        console.debug('putStoriesOnPage');

        $allStoriesList.empty();
        // loop through all of our stories and generate HTML for them
        for (let story of storyList.stories) {
            const $story = generateStoryMarkup(story);
            $allStoriesList.append($story);
        }
        const trashCan = document.querySelectorAll('.trash-can');
        for (let i = 0; i < trashCan.length; i++) {
            trashCan[i].style.display = 'none';
        }
        $allStoriesList.show();
    }
}

async function putMyStoriesOnPage() {
    console.debug('putMyStoriesOnPage');
    $myStoriesList.empty();
    let alsoMyStories = true;
    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.ownStories) {
        const $story = generateStoryMarkup(story, alsoMyStories);
        $myStoriesList.append($story);
    }
}

async function putFavoritesOnPage() {
    console.debug('putFavoritesOnPage');
    $favoritesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.favorites) {
        const $story = generateStoryMarkup(story);
        $favoritesList.append($story);
    }
}
const FavoritesLink = document.querySelector('#nav-link-favorites');
FavoritesLink.addEventListener('click', putFavoritesOnPage);

async function submitStory(e) {
    e.preventDefault();
    const submitStoryTitle = document.querySelector('#submit-story-title').value;
    const submitStoryAuthor = document.querySelector('#submit-story-author').value;
    const submitStoryUrl = document.querySelector('#submit-story-url').value;
    document.querySelector('#submit-story-form').style.display = 'none';
    await storyList.addStory(currentUser, submitStoryTitle, submitStoryAuthor, submitStoryUrl);
    putStoriesOnPage();
}
const submitFormBtn = document.querySelector('#submit-story-btn');
submitFormBtn.addEventListener('click', submitStory);

async function removeStory(e) {
    const li = e.target.closest('li');
    let storyId = li.id;
    await storyList.deleteStory(currentUser, storyId);
    putMyStoriesOnPage();
}
// $myStoriesList.on('click', '.trash-can', removeStory);

async function clickFav(e) {
    const star = e.target.closest('i');
    const trash = e.target.closest('small').getAttribute('class');

    if (trash === 'trash-can') {
        await removeStory(e);
    }

    star.className === 'far fa-star' ? (star.className = 'fas fa-star') : (star.className = 'far fa-star');
    const starStatus = star.className;
    const storyId = e.target.closest('li').id;
    await addAndRemoveFav(starStatus, currentUser, storyId);
    putFavoritesOnPage();
}
allOl.addEventListener('click', clickFav);

async function addAndRemoveFav(starStatus, currentUser, storyId) {
    const response = await axios({
        url: `${BASE_URL}/stories/${storyId}`,
        method: 'GET',
        data: {
            token: currentUser.loginToken,
        },
    });
    const res = response.data.story;
    const story = new Story(res);
    if (starStatus === 'fas fa-star') {
        currentUser.favorites.unshift(story);
        await axios({
            url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
            method: 'POST',
            data: {
                token: currentUser.loginToken,
            },
        });
    } else {
        currentUser.favorites = currentUser.favorites.filter((s) => s.storyId !== storyId);
        await axios({
            url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
            method: 'DELETE',
            data: {
                token: currentUser.loginToken,
            },
        });
    }

    return story;
}
