//Data source
definedLanguage = navigator.language;

//Axios instance
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type':'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': definedLanguage
    }
});   

function likedMoviesList(){
    const item = localStorage.getItem('liked_movies');
    let movies;

    if (item){
        movies = JSON.parse(item);
    } else {
        movies = {};
    }
    return movies; 
}

//Local storage
function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if (likedMovies[movie.id]){
        delete likedMovies[movie.id];       
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

    //Update the favorite images list
    if (location.hash == '#home'){
        homePage();
    }
}

//Utils

//Intersection observer --Lazy loading
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const url = entry.target.getAttribute('data-img');
        if (entry.isIntersecting) {
            entry.target.setAttribute('src', url);
        }
    });
});

function createMovies(movies, container, { clean = true } = {}) {
    if (clean){
        container.innerHTML = '';
    }

    movies.forEach(element => {
        //Div container
        const movieContainer = document.createElement('div');
        movieContainer.classList.add("movie-container");

        //Image
        const movieImg = document.createElement('img');
        movieImg.classList.add("movie-img");
        movieImg.setAttribute('alt', element.original_title);
        movieImg.setAttribute('data-img', 
        "https://image.tmdb.org/t/p/w300" + element.poster_path);
        if (element.poster_path === null){
            movieContainer.style.display = "none";
        }

        movieImg.addEventListener('click', () => {
            location.hash = `#movie=${element.id}`;
        });

        //like button
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');

        likedMoviesList()[element.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(element);
        });

        //Call the observer
        observer.observe(movieImg);

        //The div element is asign as father 
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    })
}

function createCategories(categories, container) { 
    container.innerHTML = "";
    
    categories.forEach(element => {
        //Div container
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add("category-container");

        //h3
        const categoryH3 = document.createElement('h3');
        categoryH3.classList.add("category-title");
        categoryH3.setAttribute('id', `id${element.id}`);
        categoryH3.addEventListener('click', () => {
            location.hash = `#category=${element.id}-${element.name}`;
        });
        const categoryName = document.createTextNode(element.name); 
        //The div element is asign as father 
        categoryH3.appendChild(categoryName);
        categoryContainer.appendChild(categoryH3);
        container.appendChild(categoryContainer);
    });
}

//API requests
//Trending movies preview --Homepage
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList);
}

//Categories preview --Homepage
async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');    
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

//List movies by category --Category page
async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        }
    });
    const categoryMovies = data.results;
    maxPage = data.total_pages;
    createMovies(categoryMovies, genericSection);
}

//Application of infinite scrolling using closures
function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;   
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax){
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page
                }
            });
            const movies = data.results;
            createMovies(movies, genericSection, {clean: false});
        }
    }
}

//List movies by search --Search page
async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query
        }
    });
    const queryMovies = data.results;
    maxPage = data.total_pages;
    createMovies(queryMovies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;   
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax){
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page
                }
            });
            const movies = data.results;
            createMovies(movies, genericSection, {clean: false});
        }
    }
}

//Categories preview --Trends page
async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies, genericSection);
}

async function getPaginatedTrendingMovies() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;   
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax){
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, {clean: false});
    }
}

async function getMovieById(id) {
    const { data } = await api(`movie/${id}`);
    console.log(data);
    movieDetailTitle.innerText = data.original_title;
    movieDetailDescription.innerText = data.overview;
    movieDetailScore.innerText = data.vote_average;
    //Categories list
    createCategories(data.genres, movieDetailCategoriesList);
    //Background image
    headerSection.style.background = `url(https://image.tmdb.org/t/p/w500${data.poster_path})`;
    headerSection.style.background =  `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(https://image.tmdb.org/t/p/w500${data.poster_path})`;

    getRelatedMovie(id);
}

async function getRelatedMovie(id) {
    const { data } = await api(`movie/${id}/similar`);
    createMovies(data.results, relatedMoviesContainer);     
}

//Consuming local storage
function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);
    createMovies(moviesArray, likedMoviesListArticle, { clean: true});
}

