# movies-project-api-rest

# Movie DB Project Platzi

It's a website to interact with The movie DB API to make requests about trend movies, specific information of a movie and movies by category. All was developed during the Platzi course called "Curso Práctico de Consumo de API REST con JavaScript".

## Getting Started

- Clone this repository by typing: `https://github.com/cesarherreras/movies-project-api-rest.git`

### Prerequisites

- Open the html file in your browser or use Live Server extension of VS Code.
- Get the API Key from The movie DB API site. It's necessary to configure Axios settings.

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

This is enough to get you started.
You only need a browser.