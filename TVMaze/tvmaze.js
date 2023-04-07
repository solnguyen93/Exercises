'use strict';

const $showsList = $('#shows-list');
const $episodesArea = $('#episodes-area');
const $searchForm = $('#search-form');
const $episodesList = $('#episodes-list');
//
//
/**send GET request to get list of shows based on user's search term */
async function getShowsByTerm(searchTerm) {
    const response = await axios.get('https://api.tvmaze.com/search/shows?q=<search query>', {
        params: { q: `'${searchTerm}'` },
    });
    let shows = response.data.map((result) => {
        return {
            id: result.show.id,
            name: result.show.name,
            summary: result.show.summary,
            image: result.show.image ? result.show.image.original : 'https://tinyurl.com/tv-missing',
        };
    });
    return shows;
}
//
//
/** Given list of shows, create markup for each and add to page with button to show 'hidden' episodes*/
function populateShows(shows) {
    $showsList.empty();
    for (let show of shows) {
        const $show = $(
            `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
        );
        $showsList.append($show);
    }
}
//
//
/*send GET request to get list of episode using show id*/
async function getEpisodesOfShow(id) {
    const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
    let episodes = response.data.map((result) => {
        return {
            name: result.name,
            season: result.season,
            episode: result.number,
            url: result.url,
        };
    });
    return episodes;
}
//
//
/** Given list of episodes, create markup for each, add, and set display to show in the HTML*/
function populateEpisodes(episodes) {
    for (let ep of episodes) {
        const $eps = $(
            `<a href='${ep.url}' class="episodes">
              <div><small>Season: ${ep.season} | Episode: ${ep.episode} | ${ep.name}</small></div>
            </div>`
        );
        $episodesList.append($eps);
    }
    $episodesArea.show();
}
//
//
/* Event Lisnter on submit => request for show (func)-> add shows to page/DOM (func) */
$searchForm.on('submit', async function (evt) {
    evt.preventDefault(); // no refresh page!
    const searchTerm = $('input[id="search-query"]').val(); //get user's search term
    const shows = await getShowsByTerm(searchTerm); //get request list of shows
    populateShows(shows); //add shows to page
});
//
//
/* Event Lisnter on click => request for eps (func) -> add and un-hide eps on page (func) */
$showsList.on('click', '.Show-getEpisodes', async function (e) {
    const id = $(e.target).closest('.Show').data('show-id'); //get show id
    const episodes = await getEpisodesOfShow(id); // get show eps using show id
    populateEpisodes(episodes); //add and un-hide eps
});

$('.clear').on('click', function () {
    $showsList.children().remove();
    $episodesList.children().remove();
    $episodesArea.hide();
});
