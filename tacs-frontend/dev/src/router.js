myApp.config(function ($stateProvider) {
    // An array of state definitions
    var states = [
        {
            name: 'home',
            url: '/',
            views: {
                'container@': {
                    templateUrl: 'templates/home.html'
                }
            }
        },
        {
            name: 'login',
            url: '/login',
            controller: 'loginController',
            views: {
                'container@': {
                    templateUrl: 'templates/login.html'
                }
            }
        },
        {
            name: 'register',
            url: '/register',
            controller: 'registerController',
            views: {
                'container@': {
                    templateUrl: 'templates/register.html'
                }
            }
        },
        {
            name: 'actoresFavoritos',
            url: '/actoresFavoritos',
            views: {
                'container@': {
                    templateUrl: 'templates/actFav/actoresFavoritos.html'
                }
            }
        },

        {
            name: 'listas',
            url: '/listas',
            views: {
                'container@': {
                    templateUrl: 'templates/listas/list.html'
                }
            }
        },

        {
            name: 'buscarMovies',
            url: '/buscar/pelicula/',
            controller: 'buscarMoviesController',
            views: {
                'container@': {
                    templateUrl: 'templates/buscar/movies.html'
                }
            }
        },

        {
            name: 'users',
            url: '/users',
            views: {
                'container@': {
                    templateUrl: 'templates/admin/users.html'
                }
            }
        },

        {
            name: 'users.lists',
            url: '/lists',
            params: {
                usersSel: null
            },
            views: {
                'container@': {
                    templateUrl: 'templates/admin/listComparison.html'
                }
            }
        },

        {
            name: 'fichaPelicula',
            url: '/movie/:movieId',
            templateUrl: 'templates/fichas/pelicula.html'
        }

    ]

    // Loop over the state definitions and register them
    states.forEach(function (state) {
        $stateProvider.state(state);
    });

});
