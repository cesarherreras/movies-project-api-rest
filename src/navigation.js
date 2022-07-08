let page = 1;
let maxPage;
let infiniteScroll;

//Activate buttons to navigate
searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
});
trendingBtn.addEventListener('click', () => location.hash = '#trends');

//Create a history entry with pushState
window.addEventListener('DOMContentLoaded', () => {
    navigationHash();
    history.pushState({
        urlState: window.location.href
    }, null, '');
}, false);

arrowBtn.addEventListener('click', () => {
    const stateLoad = history.state ? window.history.state.urlState : '';
    if (stateLoad.includes('#')){
        location.hash = '#home';
    } else {
        history.back()
    }
});

window.addEventListener('hashchange', navigationHash, false);
window.addEventListener('scroll', infiniteScroll, {passive: false});

function navigationHash() {
    if (infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#trends')){
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
        searchPage();
    } else if (location.hash.startsWith('#movie=')){
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')){
        categoriesPage();
    } else {
        homePage();
    }
    document.documentElement.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

function homePage(){

    //Header
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerCategoryTitle.classList.add('inactive')
    headerTitle.classList.remove('inactive');

    //Search form
    searchForm.classList.remove('inactive');

    //Trending preview section
    trendingPreviewSection.classList.remove('inactive');
    //Categories preview section
    categoriesPreviewSection.classList.remove('inactive');
    //Generic section
    genericSection.classList.add('inactive');
    //Movie detail section
    movieDetailSection.classList.add('inactive');
    //Liked movies section
    likedMoviesSection.classList.remove('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

function categoriesPage(){

    //Header
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerCategoryTitle.classList.remove('inactive')
    headerTitle.classList.add('inactive');

    //Search form
    searchForm.classList.add('inactive');

    //Trending preview section
    trendingPreviewSection.classList.add('inactive');
    //Categories preview section
    categoriesPreviewSection.classList.add('inactive');
    //Generic section
    genericSection.classList.remove('inactive');
    //Movie detail section
    movieDetailSection.classList.add('inactive');
    //Liked movies section
    likedMoviesSection.classList.add('inactive');

    const startId = location.hash.indexOf('=');
    const endId = location.hash.indexOf('-');
    const id = location.hash.substring(startId + 1, endId);
    getMoviesByCategory(id);

    const name = location.hash.substring(endId + 1, location.hash.length);
    const rename = (name.search('%20') !== -1) ? name.replace('%20', ' ') : name;
    headerCategoryTitle.innerText = rename;

    infiniteScroll = getPaginatedMoviesByCategory(id);
}

function movieDetailsPage(){

    //Header
    headerSection.classList.add('header-container--long');
    /*headerSection.style.background = '';*/
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white')
    headerCategoryTitle.classList.add('inactive')
    headerTitle.classList.add('inactive');

    //Search form
    searchForm.classList.add('inactive');

    //Trending preview section
    trendingPreviewSection.classList.add('inactive');
    //Categories preview section
    categoriesPreviewSection.classList.add('inactive');
    //Generic section
    genericSection.classList.add('inactive');
    //Movie detail section
    movieDetailSection.classList.remove('inactive');
    //Liked movies section
    likedMoviesSection.classList.add('inactive');

    //Get the movie id
    const startId = location.hash.indexOf('=');
    const id = location.hash.substring(startId + 1, location.hash.length);

    getMovieById(id);
}

function searchPage(){

    //Header
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerCategoryTitle.classList.add('inactive')
    headerTitle.classList.add('inactive');

    //Search form
    searchForm.classList.remove('inactive');

    //Trending preview section
    trendingPreviewSection.classList.add('inactive');
    //Categories preview section
    categoriesPreviewSection.classList.add('inactive');
    //Generic section
    genericSection.classList.remove('inactive');
    //Movie detail section
    movieDetailSection.classList.add('inactive');
    //Liked movies section
    likedMoviesSection.classList.add('inactive');

    const startId = location.hash.indexOf('=');
    const search = location.hash.substring(startId + 1, location.hash.length);
    const query = (search.search('%20') !== -1) ? search.replace('%20', ' ') : search;
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage(){

    //Header
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerCategoryTitle.classList.remove('inactive')
    headerTitle.classList.add('inactive');

    //Search form
    searchForm.classList.add('inactive');

    //Trending preview section
    trendingPreviewSection.classList.add('inactive');
    //Categories preview section
    categoriesPreviewSection.classList.add('inactive');
    //Generic section
    genericSection.classList.remove('inactive');
    //Movie detail section
    movieDetailSection.classList.add('inactive');
    //Liked movies section
    likedMoviesSection.classList.add('inactive');

    headerCategoryTitle.innerText = 'Tendencias';
    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}

