var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap']);

myApp.config(function($stateProvider) {
  // An array of state definitions
  var states = [{
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
          templateUrl: 'templates/actoresFavoritos.html'
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
      url: '/movie/:fichaId',
      views: {
        'container@': {
          templateUrl: 'templates/fichas/pelicula.html'
        }
      }
    },

    {
      name: 'fichaPersona',
      url: '/person/:fichaId',
      views: {
        'container@': {
          templateUrl: 'templates/fichas/persona.html'
        }
      }
    },
{
  name: 'rankingActoresFavoritos',
    url: '/ranking',
  views: {
  'container@': {
    templateUrl: 'templates/admin/rankingActoresFavoritos.html'
  }
}
}

  ]

  // Loop over the state definitions and register them
  states.forEach(function(state) {
    $stateProvider.state(state);
  });

});

var settings = {
  apiUrl: '/api/'
}

myApp.controller('navbar', function($scope) {
  $scope.isNavCollapsed = true;
  $scope.isCollapsed = false;
  $scope.isCollapsedHorizontal = false;
  $scope.search={
    query: "",
    options: ["Movies","People","Anything"],
    by: "Movies"
  }

});

/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function ($scope, BusquedasService, Usuario, ListService) {

    var movies = {
        name: "Movies",
        titleLabel: "Titulo",
        url: "movie/",
        agregarLista: true

    };

    var people = {
        name: "People",
        titleLabel: "Nombre",
        url: "person/",
        agregarFavorito: true
    };

    var anything = {
        name: "Anything",
        titleLabel: "Titulo/Nombre",
        url: "",
        mostrarTipo: true
    };

    var ultimaBusquedaPor = movies;

    $scope.search = {
        query: "",
        options: [movies, people, anything],
        by: movies
    };

    function llenarGrillaDeResultados(buscarPor, textoABuscar) {
        BusquedasService.buscar(buscarPor.url, textoABuscar, $scope.numeroDePagina)
            .then(function (response) {
                if (response.data.results <= 0) {
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
                    $scope.resultados = [];
                } else {
                    $scope.resultados = response.data.results;
                    $scope.cantidadDeResultados = response.data.total_results;
                }
                $scope.ultimaBusquedaPor = buscarPor;
            })
    }

    $scope.buscar = function (buscarPor, textoABuscar) {
        if (!textoABuscar)
            return;

        if (buscarPor.agregarLista)
            Usuario.getListas()
                .then(function (response) {
                    $scope.listas = response.data;
                });

        $scope.numeroDePagina = 1;

        llenarGrillaDeResultados(buscarPor, textoABuscar);
    };

    $scope.agregarComoFavorito = function (actor) {

        if ((actor.media_type == 'person') || ($scope.ultimaBusquedaPor == people)) {
            Usuario.marcarActorFavorito(actor)
                .then(function () {
                    alert('Actor agregado.');
                });
        } else {
            alert('Lo que seleccionó no es un actor');
            return;
        }
    };

    $scope.agregarALista = function (pelicula, lista) {
        if (lista)
            ListService.agregarALista(pelicula, lista)
                .then(function () {
                    alert('Pelicula agregada correctamente.');
                });
    }

    $scope.obtenerPagina = function () {
        llenarGrillaDeResultados($scope.search.by, $scope.search.query);
    }

    $scope.numeroDePagina = 1;

});

'use strict';

myApp.controller('MainController', function($rootScope,$scope,$state) {

    $rootScope.usuarioLogueado = false;
    $rootScope.esAdmin = false;

    if($rootScope.usuarioLogueado){
        $state.go('home');
    }else{
        $state.go('login');
    }

});
myApp.controller('adminController', function ($rootScope, $scope, $state, Admin) {
    var self = this;
    self.users = [];
    self.usersSelec = [];
    self.selectedUser = "";
    self.visibleData = false;
    self.sesion = $rootScope.sesionActual;


    self.importUsers = function () {
        Admin.getUsers($rootScope.sesionActual,
            function (response) {
                self.users = response.data
            })
    }

    self.importUsers();

    self.cleanSelected = function () {
        self.visibleData = false;
        self.users.map(function (us) {
            us.selected = false;
        })
    }

    self.compareSelected = function () {
        self.usersSelec = self.users.filter(function (user) {
            return user.selected
        })
        if (self.usersSelec.length != 2) {
            self.errorMessage = "Seleccione sólo dos usuarios"
        }
        else if (self.usersSelec.some(function (e) {
                return e.lists.length === 0
            })) {
            self.errorMessage = "Uno de los usuarios no posee listas"
        }
        else {
            self.visibleData = false;
            $state.go('users.lists', {usersSel: self.usersSelec})
        }

    }


    self.dateFormat = function (date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '/' + month + '/' + year;
    };

    self.showUsers = function () {
        return self.users;
    };

    self.esAdmin = function () {
        return $rootScope.esAdmin;
    };

    self.getUsername = function () {
        try {
            if (self.selectedUser.username === null) {
                return "Sin Username"
            }
            else {
                return self.selectedUser.username;
            }
        }
        catch (e) {

        }


    };

    self.getLastAccess = function () {
        try {
            if (self.selectedUser.lastAccess === null) {
                return "No inició sesión"
            }
            else {
                var d = new Date(self.selectedUser.lastAccess);
                return self.dateFormat(d);
            }
        }
        catch (e) {

        }

    };

    self.numList = function () {
        try {
            if (self.selectedUser.lists === null) {
                return "No hay información"
            }
            else {
                return self.selectedUser.lists.length
            }
        }
        catch (e) {

        }
    }

    self.getMovies = function () {
        try {
            if (self.selectedUser.lists === null) {
                return "No hay información"
            }
            else {
                return self.selectedUser.lists
            }
        }
        catch (e) {

        }
    }

    self.numFavAct = function () {
        try {
            if (self.selectedUser.favoriteActors === null) {
                return "No hay información"
            }
            else {
                return self.selectedUser.favoriteActors.length
            }
        }
        catch (e) {

        }


    }

    self.hide = function () {
        self.visibleData = false;
    }

    self.getInfo = function (id) {
        Admin.getData($rootScope.sesionActual, id,
            function (response) {
                self.selectedUser = response.data;
                self.visibleData = true;

            })
    }

});
/**
 * Created by Rodrigo on 08/05/2017.
 */
myApp.controller('adminRankingController', function ($rootScope, $scope, Usuario) {

    function getRanking() {
        Usuario.getRankingActoresFavoritos()
            .then(function (response) {
                $scope.ranking = response.data
            });
    }

    getRanking();

});
myApp.controller('fichaController', function($scope, $http, $stateParams) {

  $scope.traerFicha = function(tipo) {
    $http.get(settings.apiUrl + tipo + '/' + $stateParams.fichaId, {
      headers: {
        "Token": '12345'
      }
    }).then(function(response) {
      $scope.item = response.data;
    })
  }
});

myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

    var self = this;

    $scope.actoresFavoritos = [];
    self.recMovies = undefined;
    self.visible = false;

    $scope.searchRecMovies = function () {
        Usuario.getRecMovies($rootScope.sesionActual,
            function (response) {
                self.recMovies = response.data;
                self.visible = true;
            })
    };

    this.actoresFavoritos = function () {
        Usuario.actoresFavoritos()
            .then(function (actores) {
                $scope.actoresFavoritos = actores.data;
            });
    };

    $scope.sacarDeFavorito = function (actor) {
        $scope.actoresFavoritos.splice($scope.actoresFavoritos.indexOf(actor), 1);
        Usuario.desmarcarActorFavorito(actor)
    }

    this.actoresFavoritos();

});


myApp.controller('fichaPeliculaController', function($scope, $http, $stateParams) {

  $http.get(settings.apiUrl+'movie/' + $stateParams.movieId, {
    headers: {
      "Token": '12345'
    }
  }).then(function(response) {
    $scope.movie = response.data;
  })
});

/**
 * Created by Rodrigo on 02/05/2017.
 */
myApp.controller('headerController', function($rootScope,$scope,$state,Sesion) {

    $scope.logout = function () {

        Sesion.logout()
            .then(function(response) {
                $rootScope.usuarioLogueado = false;
                $rootScope.sesionActual = undefined;
                $state.go('login');
            })
            .catch(function(error) {
                alert(error.data.message);
            })

    };

});
myApp.controller('listCompController', function ($rootScope, $scope,$state, $stateParams, ListService) {
    var self = this;
    self.user1 = $stateParams.usersSel[0]
    self.user1List = ""
    self.user2 = $stateParams.usersSel[1]
    self.user2List = ""
    self.intersection = null
    self.sesion = $rootScope.sesionActual;

    self.compare = function () {
        ListService.intersectionOf(self.user1List, self.user2List, self.sesion,
            function (response) {
                self.intersection = response.data;
            })
    }

  self.esAdmin = function () {
    return $rootScope.esAdmin;
  };
});

myApp.controller('listController', function ($rootScope, $scope, $state, $stateParams, ListService, Usuario) {

    var self = this;
    $scope.listas = [];

    $scope.create = function (nombre) {
        ListService.createList(nombre)
            .then(function (response) {
                $scope.movieList = response.data;
                $scope.listas.push(response.data);
                alert('Lista creada con exito.')
                $scope.nombre = undefined;
            })
    }

    self.getListas = function () {
        Usuario.getListas()
            .then(function (response) {
                $scope.listas = response.data;
            });
    }

    self.cleanSelected = function () {
        self.intersection = undefined;
        $scope.listas.map(function (l) {
            l.selected = false;
        })
    }
    
    self.getActores = function (id) {
        ListService.getAct($rootScope.sesionActual, id,
            function (response) {
                self.actores = response.data;
            })
    }

    self.compareSelected = function () {
        self.listasSelec = $scope.listas.filter(function (list) {
            return list.selected
        })
        if (self.listasSelec.length != 2) {
            self.errorMessage = "Seleccione sólo dos listas"
        }
        else if (self.listasSelec.some(function (e) {
                return e.movies.length === 0
            })) {
            self.errorMessage = "Una de las listas no posee películas"
        }
        else {
            ListService.intersectionOf(self.listasSelec[0], self.listasSelec[1], $rootScope.sesionActual,
                function (response) {
                    self.intersection = response.data;
                })
        }
    }

    $scope.quitarDeLista = function (peliculaAQuitar,list) {
        ListService.quitarDeLista(peliculaAQuitar,list).then(function () {
          alert('Pelicula quitada correctamente.');
          var movies = $scope.listas.filter(lista => lista.id === list.id)[0].movies;

          movies.splice(movies.indexOf(peliculaAQuitar),1);

        });
    };


    self.getListas();

});
myApp.controller('loginController', function ($rootScope, $scope, $state, Sesion) {

    $scope.userName = "";
    $scope.password = "";

    $scope.autenticarse = function () {

    Sesion.login({username: $scope.userName, password: $scope.password})
      .then(function (response) {
        $rootScope.sesionActual = response.data;
        $rootScope.usuarioLogueado = true;
        $rootScope.esAdmin = response.data.esAdmin;

        $state.go('home');
      })
      .catch(function (error) {
        alert(error.data.message);
      })

    };

});


'use strict';

myApp
  .controller('registerController', function ($scope, $state, Usuario) {

    $scope.userName = "";
    $scope.password1 = "";
    $scope.password2 = "";
    $scope.email = "";

    $scope.registerNewUser = function () {
      if ($scope.password1 === $scope.password2) {
        Usuario.register({username: $scope.userName, password: $scope.password1}).then(function (response) {
          alert("Usuario creado correctamente!");
          $state.go('login');
        })
          .catch(function (error) {
            alert(error.data.message);
          });
      } else {
        alert("Las passwords no coinciden", "Por favor revisalas antes de enviar el formulario", "error");
      }
    };

    $scope.returnToMain = function () {
      return $state.go('login');
    };

    $scope.contraseniasDistintas = function () {
      return $scope.password1 !== $scope.password2;
    }

  });
/**
 * Created by aye on 06/05/17.
 */
'use strict';

myApp.service('Admin', function ($http) {

  var self = this;

  self.getUsers = function (sesionActual, callback) {
    return $http.get(settings.apiUrl+'admin/user/list', {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

  self.getData = function (sesionActual, id, callback) {
    return $http.get(settings.apiUrl+'admin/user/' + id, {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

});

/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.service('BusquedasService', function ($http, $rootScope) {

    var self = this;

    self.buscar = function (url, textoDeBusqueda, numeroDePagina) {
        // return $http.get(settings.apiUrl+'search/' + url + textoDeBusqueda.split(' ').join('-') + '?page=' + numeroDePagina, {
          return $http.get(settings.apiUrl+'search/' + url + textoDeBusqueda.split(' ').join('-'),{
            headers: {
                "Token": $rootScope.sesionActual.idSesion
            }
        });
    };

});

myApp.service('ListService', function ($http, $rootScope) {

    var self = this;

    self.intersectionOf = function (lista1, lista2, sesionActual, callback) {
        return $http.get(settings.apiUrl+'admin/user/' + lista1.id + '/' + lista2.id + '/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.getAct = function (sesionActual, lista, callback) {
        return $http.get(settings.apiUrl+'user/ranking/' + lista, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };



    self.intersection = function (lista1, lista2, sesionActual, callback) {
        return $http.get(settings.apiUrl+'list/' + lista1.id + '/' + lista2.id, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.createList = function (nombre) {
        return $http.post(settings.apiUrl+'list/', nombre, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        })
    };

    self.agregarALista = function (pelicula, lista) {
        return $http.post(settings.apiUrl+'list/' + lista.id + '/', pelicula, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        });
    };

    self.quitarDeLista = function (pelicula, lista) {
        // return $http({
        //     method: 'DELETE',
        //     url: 'http://localhost:8080/list/' + lista.id + '/',
        //     data: {
        //         movie: pelicula
        //     },
        //     headers: {
        //         'token': $rootScope.sesionActual.idSesion
        //     }
        // });
        return $http.delete(settings.apiUrl+'list/' + lista.id + '/'+ pelicula.id,{
            headers: {'token': $rootScope.sesionActual.idSesion}
        });


    };

});

'use strict';

myApp.service('Sesion', function ($http, $rootScope) {

    var self = this;

    self.login = function (credentials) {
        return $http.post(settings.apiUrl+'authentication/login', credentials);
    };

    self.logout = function () {
        return $http.put(settings.apiUrl+'authentication/logout',undefined,{headers: {"token": $rootScope.sesionActual.idSesion}})
    };

});

/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

    var self = this;

    self.register = function (credentials) {
        return $http.post(settings.apiUrl+'user/', credentials);
    };

    self.getRecMovies = function (sesion,callback) {
        return $http.get(settings.apiUrl+'user/favoriteactor/movies', {
            headers: {'token': sesion.idSesion}
        }).then(callback);
    }

    self.actoresFavoritos = function (credentials) {
        return $http.get(settings.apiUrl+'user/favoriteactor/',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.marcarActorFavorito = function (actor) {
      return $http.put(settings.apiUrl+'user/favoriteactor/', actor,
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
  self.desmarcarActorFavorito = function (actor_id) {
    return $http.put(settings.apiUrl+'user/favoriteactor/' + actor_id,null,
      {
        headers: {
          'token': $rootScope.sesionActual.idSesion
        }
      }
    );
  }

    self.getListas = function (credentials) {
        return $http.get(settings.apiUrl+'user/movieLists', {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
    self.getRankingActoresFavoritos = function () {
        return $http.get(settings.apiUrl+'user/favoriteactor/ranking',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }



})
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInNldHRpbmdzLmpzIiwiY29tbW9ucy9ib290c3RyYXAuanMiLCJjb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYWRtaW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYWRtaW5SYW5raW5nQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2J1c2Nhck1vdmllc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mYXZvcml0b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmljaGFzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2hlYWRlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9saXN0Q29tcENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9saXN0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL0FkbWluLmpzIiwic2VydmljZXMvQnVzcXVlZGFzU2VydmljZS5qcyIsInNlcnZpY2VzL0xpc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvU2VzaW9uLmpzIiwic2VydmljZXMvVXN1YXJpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCddKTtcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xuICB2YXIgc3RhdGVzID0gW3tcbiAgICAgIG5hbWU6ICdob21lJyxcbiAgICAgIHVybDogJy8nLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbG9naW4nLFxuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcbiAgICAgIHVybDogJy9yZWdpc3RlcicsXG4gICAgICBjb250cm9sbGVyOiAncmVnaXN0ZXJDb250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlZ2lzdGVyLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdhY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgIHVybDogJy9hY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FjdG9yZXNGYXZvcml0b3MuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnbGlzdGFzJyxcbiAgICAgIHVybDogJy9saXN0YXMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcbiAgICAgIHVybDogJy9idXNjYXIvcGVsaWN1bGEvJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdidXNjYXJNb3ZpZXNDb250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2J1c2Nhci9tb3ZpZXMuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAndXNlcnMnLFxuICAgICAgdXJsOiAnL3VzZXJzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3VzZXJzLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ3VzZXJzLmxpc3RzJyxcbiAgICAgIHVybDogJy9saXN0cycsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdXNlcnNTZWw6IG51bGxcbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9saXN0Q29tcGFyaXNvbi5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdmaWNoYVBlbGljdWxhJyxcbiAgICAgIHVybDogJy9tb3ZpZS86ZmljaGFJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9maWNoYXMvcGVsaWN1bGEuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnZmljaGFQZXJzb25hJyxcbiAgICAgIHVybDogJy9wZXJzb24vOmZpY2hhSWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlcnNvbmEuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG57XG4gIG5hbWU6ICdyYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcycsXG4gICAgdXJsOiAnL3JhbmtpbmcnLFxuICB2aWV3czoge1xuICAnY29udGFpbmVyQCc6IHtcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9yYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xuICB9XG59XG59XG5cbiAgXVxuXG4gIC8vIExvb3Agb3ZlciB0aGUgc3RhdGUgZGVmaW5pdGlvbnMgYW5kIHJlZ2lzdGVyIHRoZW1cbiAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XG4gIH0pO1xuXG59KTtcbiIsInZhciBzZXR0aW5ncyA9IHtcbiAgYXBpVXJsOiAnL2FwaS8nXG59XG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcbiAgJHNjb3BlLnNlYXJjaD17XG4gICAgcXVlcnk6IFwiXCIsXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxuICAgIGJ5OiBcIk1vdmllc1wiXG4gIH1cblxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEJ1c3F1ZWRhc1NlcnZpY2UsIFVzdWFyaW8sIExpc3RTZXJ2aWNlKSB7XG5cbiAgICB2YXIgbW92aWVzID0ge1xuICAgICAgICBuYW1lOiBcIk1vdmllc1wiLFxuICAgICAgICB0aXRsZUxhYmVsOiBcIlRpdHVsb1wiLFxuICAgICAgICB1cmw6IFwibW92aWUvXCIsXG4gICAgICAgIGFncmVnYXJMaXN0YTogdHJ1ZVxuXG4gICAgfTtcblxuICAgIHZhciBwZW9wbGUgPSB7XG4gICAgICAgIG5hbWU6IFwiUGVvcGxlXCIsXG4gICAgICAgIHRpdGxlTGFiZWw6IFwiTm9tYnJlXCIsXG4gICAgICAgIHVybDogXCJwZXJzb24vXCIsXG4gICAgICAgIGFncmVnYXJGYXZvcml0bzogdHJ1ZVxuICAgIH07XG5cbiAgICB2YXIgYW55dGhpbmcgPSB7XG4gICAgICAgIG5hbWU6IFwiQW55dGhpbmdcIixcbiAgICAgICAgdGl0bGVMYWJlbDogXCJUaXR1bG8vTm9tYnJlXCIsXG4gICAgICAgIHVybDogXCJcIixcbiAgICAgICAgbW9zdHJhclRpcG86IHRydWVcbiAgICB9O1xuXG4gICAgdmFyIHVsdGltYUJ1c3F1ZWRhUG9yID0gbW92aWVzO1xuXG4gICAgJHNjb3BlLnNlYXJjaCA9IHtcbiAgICAgICAgcXVlcnk6IFwiXCIsXG4gICAgICAgIG9wdGlvbnM6IFttb3ZpZXMsIHBlb3BsZSwgYW55dGhpbmddLFxuICAgICAgICBieTogbW92aWVzXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxsZW5hckdyaWxsYURlUmVzdWx0YWRvcyhidXNjYXJQb3IsIHRleHRvQUJ1c2Nhcikge1xuICAgICAgICBCdXNxdWVkYXNTZXJ2aWNlLmJ1c2NhcihidXNjYXJQb3IudXJsLCB0ZXh0b0FCdXNjYXIsICRzY29wZS5udW1lcm9EZVBhZ2luYSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnJlc3VsdHMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkxvIHNlbnRpbW9zLCBubyBzZSBlbmNvbnRyYXJvbiByZXN1bHRhZG9zIHBhcmEgXFxcIlwiICsgdGV4dG9BQnVzY2FyICsgXCJcXFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gcmVzcG9uc2UuZGF0YS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2FudGlkYWREZVJlc3VsdGFkb3MgPSByZXNwb25zZS5kYXRhLnRvdGFsX3Jlc3VsdHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9IGJ1c2NhclBvcjtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmJ1c2NhciA9IGZ1bmN0aW9uIChidXNjYXJQb3IsIHRleHRvQUJ1c2Nhcikge1xuICAgICAgICBpZiAoIXRleHRvQUJ1c2NhcilcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoYnVzY2FyUG9yLmFncmVnYXJMaXN0YSlcbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdGFzKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RhcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm51bWVyb0RlUGFnaW5hID0gMTtcblxuICAgICAgICBsbGVuYXJHcmlsbGFEZVJlc3VsdGFkb3MoYnVzY2FyUG9yLCB0ZXh0b0FCdXNjYXIpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuYWdyZWdhckNvbW9GYXZvcml0byA9IGZ1bmN0aW9uIChhY3Rvcikge1xuXG4gICAgICAgIGlmICgoYWN0b3IubWVkaWFfdHlwZSA9PSAncGVyc29uJykgfHwgKCRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9PSBwZW9wbGUpKSB7XG4gICAgICAgICAgICBVc3VhcmlvLm1hcmNhckFjdG9yRmF2b3JpdG8oYWN0b3IpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQWN0b3IgYWdyZWdhZG8uJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnTG8gcXVlIHNlbGVjY2lvbsOzIG5vIGVzIHVuIGFjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmFncmVnYXJBTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XG4gICAgICAgIGlmIChsaXN0YSlcbiAgICAgICAgICAgIExpc3RTZXJ2aWNlLmFncmVnYXJBTGlzdGEocGVsaWN1bGEsIGxpc3RhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1BlbGljdWxhIGFncmVnYWRhIGNvcnJlY3RhbWVudGUuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm9idGVuZXJQYWdpbmEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxsZW5hckdyaWxsYURlUmVzdWx0YWRvcygkc2NvcGUuc2VhcmNoLmJ5LCAkc2NvcGUuc2VhcmNoLnF1ZXJ5KTtcbiAgICB9XG5cbiAgICAkc2NvcGUubnVtZXJvRGVQYWdpbmEgPSAxO1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUpIHtcblxuICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XG4gICAgJHJvb3RTY29wZS5lc0FkbWluID0gZmFsc2U7XG5cbiAgICBpZigkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyl7XG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgIH1lbHNle1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfVxuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdhZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIEFkbWluKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudXNlcnMgPSBbXTtcbiAgICBzZWxmLnVzZXJzU2VsZWMgPSBbXTtcbiAgICBzZWxmLnNlbGVjdGVkVXNlciA9IFwiXCI7XG4gICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgIHNlbGYuc2VzaW9uID0gJHJvb3RTY29wZS5zZXNpb25BY3R1YWw7XG5cblxuICAgIHNlbGYuaW1wb3J0VXNlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEFkbWluLmdldFVzZXJzKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51c2VycyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5pbXBvcnRVc2VycygpO1xuXG4gICAgc2VsZi5jbGVhblNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgICAgIHNlbGYudXNlcnMubWFwKGZ1bmN0aW9uICh1cykge1xuICAgICAgICAgICAgdXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmNvbXBhcmVTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi51c2Vyc1NlbGVjID0gc2VsZi51c2Vycy5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnNlbGVjdGVkXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChzZWxmLnVzZXJzU2VsZWMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJTZWxlY2Npb25lIHPDs2xvIGRvcyB1c3Vhcmlvc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZi51c2Vyc1NlbGVjLnNvbWUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5saXN0cy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5vIGRlIGxvcyB1c3VhcmlvcyBubyBwb3NlZSBsaXN0YXNcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd1c2Vycy5saXN0cycsIHt1c2Vyc1NlbDogc2VsZi51c2Vyc1NlbGVjfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBzZWxmLmRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIG1vbnRoID0gKDEgKyBkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCk7XG4gICAgICAgIG1vbnRoID0gbW9udGgubGVuZ3RoID4gMSA/IG1vbnRoIDogJzAnICsgbW9udGg7XG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xuICAgICAgICBkYXkgPSBkYXkubGVuZ3RoID4gMSA/IGRheSA6ICcwJyArIGRheTtcbiAgICAgICAgcmV0dXJuIGRheSArICcvJyArIG1vbnRoICsgJy8nICsgeWVhcjtcbiAgICB9O1xuXG4gICAgc2VsZi5zaG93VXNlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnVzZXJzO1xuICAgIH07XG5cbiAgICBzZWxmLmVzQWRtaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW47XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0VXNlcm5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIudXNlcm5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTaW4gVXNlcm5hbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLnVzZXJuYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9O1xuXG4gICAgc2VsZi5nZXRMYXN0QWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxhc3RBY2Nlc3MgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBpbmljacOzIHNlc2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kYXRlRm9ybWF0KGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHNlbGYubnVtTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYuZ2V0TW92aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIubGlzdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLm51bUZhdkFjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmZhdm9yaXRlQWN0b3JzLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICBzZWxmLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzZWxmLmdldEluZm8gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgQWRtaW4uZ2V0RGF0YSgkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCwgaWQsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IHRydWU7XG5cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwOC8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdhZG1pblJhbmtpbmdDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xuXG4gICAgZnVuY3Rpb24gZ2V0UmFua2luZygpIHtcbiAgICAgICAgVXN1YXJpby5nZXRSYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmFua2luZyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFJhbmtpbmcoKTtcblxufSk7IiwibXlBcHAuY29udHJvbGxlcignZmljaGFDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSB7XG5cbiAgJHNjb3BlLnRyYWVyRmljaGEgPSBmdW5jdGlvbih0aXBvKSB7XG4gICAgJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCArIHRpcG8gKyAnLycgKyAkc3RhdGVQYXJhbXMuZmljaGFJZCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIlRva2VuXCI6ICcxMjM0NSdcbiAgICAgIH1cbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuaXRlbSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSlcbiAgfVxufSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCdmYXZvcml0b3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3MgPSBbXTtcbiAgICBzZWxmLnJlY01vdmllcyA9IHVuZGVmaW5lZDtcbiAgICBzZWxmLnZpc2libGUgPSBmYWxzZTtcblxuICAgICRzY29wZS5zZWFyY2hSZWNNb3ZpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVzdWFyaW8uZ2V0UmVjTW92aWVzKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZWNNb3ZpZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIHNlbGYudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KVxuICAgIH07XG5cbiAgICB0aGlzLmFjdG9yZXNGYXZvcml0b3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVzdWFyaW8uYWN0b3Jlc0Zhdm9yaXRvcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYWN0b3Jlcykge1xuICAgICAgICAgICAgICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zID0gYWN0b3Jlcy5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zYWNhckRlRmF2b3JpdG8gPSBmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3Muc3BsaWNlKCRzY29wZS5hY3RvcmVzRmF2b3JpdG9zLmluZGV4T2YoYWN0b3IpLCAxKTtcbiAgICAgICAgVXN1YXJpby5kZXNtYXJjYXJBY3RvckZhdm9yaXRvKGFjdG9yKVxuICAgIH1cblxuICAgIHRoaXMuYWN0b3Jlc0Zhdm9yaXRvcygpO1xuXG59KTtcblxuIiwibXlBcHAuY29udHJvbGxlcignZmljaGFQZWxpY3VsYUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIHtcblxuICAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydtb3ZpZS8nICsgJHN0YXRlUGFyYW1zLm1vdmllSWQsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIlRva2VuXCI6ICcxMjM0NSdcbiAgICB9XG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAkc2NvcGUubW92aWUgPSByZXNwb25zZS5kYXRhO1xuICB9KVxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMi8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdoZWFkZXJDb250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlLFNlc2lvbikge1xuXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBTZXNpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICB9O1xuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsaXN0Q29tcENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBMaXN0U2VydmljZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnVzZXIxID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzBdXG4gICAgc2VsZi51c2VyMUxpc3QgPSBcIlwiXG4gICAgc2VsZi51c2VyMiA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFsxXVxuICAgIHNlbGYudXNlcjJMaXN0ID0gXCJcIlxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gbnVsbFxuICAgIHNlbGYuc2VzaW9uID0gJHJvb3RTY29wZS5zZXNpb25BY3R1YWw7XG5cbiAgICBzZWxmLmNvbXBhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmludGVyc2VjdGlvbk9mKHNlbGYudXNlcjFMaXN0LCBzZWxmLnVzZXIyTGlzdCwgc2VsZi5zZXNpb24sXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICBzZWxmLmVzQWRtaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbjtcbiAgfTtcbn0pO1xuIiwibXlBcHAuY29udHJvbGxlcignbGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTGlzdFNlcnZpY2UsIFVzdWFyaW8pIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAkc2NvcGUubGlzdGFzID0gW107XG5cbiAgICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24gKG5vbWJyZSkge1xuICAgICAgICBMaXN0U2VydmljZS5jcmVhdGVMaXN0KG5vbWJyZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5tb3ZpZUxpc3QgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMucHVzaChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBhbGVydCgnTGlzdGEgY3JlYWRhIGNvbiBleGl0by4nKVxuICAgICAgICAgICAgICAgICRzY29wZS5ub21icmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuZ2V0TGlzdGFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBVc3VhcmlvLmdldExpc3RhcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdGFzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICRzY29wZS5saXN0YXMubWFwKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgICAgICBsLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIHNlbGYuZ2V0QWN0b3JlcyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBMaXN0U2VydmljZS5nZXRBY3QoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsIGlkLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RvcmVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5jb21wYXJlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYubGlzdGFzU2VsZWMgPSAkc2NvcGUubGlzdGFzLmZpbHRlcihmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Quc2VsZWN0ZWRcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHNlbGYubGlzdGFzU2VsZWMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJTZWxlY2Npb25lIHPDs2xvIGRvcyBsaXN0YXNcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlbGYubGlzdGFzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLm1vdmllcy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5hIGRlIGxhcyBsaXN0YXMgbm8gcG9zZWUgcGVsw61jdWxhc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLmxpc3Rhc1NlbGVjWzBdLCBzZWxmLmxpc3Rhc1NlbGVjWzFdLCAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucXVpdGFyRGVMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYUFRdWl0YXIsbGlzdCkge1xuICAgICAgICBMaXN0U2VydmljZS5xdWl0YXJEZUxpc3RhKHBlbGljdWxhQVF1aXRhcixsaXN0KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhbGVydCgnUGVsaWN1bGEgcXVpdGFkYSBjb3JyZWN0YW1lbnRlLicpO1xuICAgICAgICAgIHZhciBtb3ZpZXMgPSAkc2NvcGUubGlzdGFzLmZpbHRlcihsaXN0YSA9PiBsaXN0YS5pZCA9PT0gbGlzdC5pZClbMF0ubW92aWVzO1xuXG4gICAgICAgICAgbW92aWVzLnNwbGljZShtb3ZpZXMuaW5kZXhPZihwZWxpY3VsYUFRdWl0YXIpLDEpO1xuXG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIHNlbGYuZ2V0TGlzdGFzKCk7XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgU2VzaW9uKSB7XG5cbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XG5cbiAgICAkc2NvcGUuYXV0ZW50aWNhcnNlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgU2VzaW9uLmxvZ2luKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gdHJ1ZTtcbiAgICAgICAgJHJvb3RTY29wZS5lc0FkbWluID0gcmVzcG9uc2UuZGF0YS5lc0FkbWluO1xuXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgIH0pXG5cbiAgICB9O1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcFxuICAuY29udHJvbGxlcigncmVnaXN0ZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBVc3VhcmlvKSB7XG5cbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZDEgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZDIgPSBcIlwiO1xuICAgICRzY29wZS5lbWFpbCA9IFwiXCI7XG5cbiAgICAkc2NvcGUucmVnaXN0ZXJOZXdVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5wYXNzd29yZDEgPT09ICRzY29wZS5wYXNzd29yZDIpIHtcbiAgICAgICAgVXN1YXJpby5yZWdpc3Rlcih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZDF9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGFsZXJ0KFwiVXN1YXJpbyBjcmVhZG8gY29ycmVjdGFtZW50ZSFcIik7XG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkxhcyBwYXNzd29yZHMgbm8gY29pbmNpZGVuXCIsIFwiUG9yIGZhdm9yIHJldmlzYWxhcyBhbnRlcyBkZSBlbnZpYXIgZWwgZm9ybXVsYXJpb1wiLCBcImVycm9yXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmV0dXJuVG9NYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnRyYXNlbmlhc0Rpc3RpbnRhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkc2NvcGUucGFzc3dvcmQxICE9PSAkc2NvcGUucGFzc3dvcmQyO1xuICAgIH1cblxuICB9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDA2LzA1LzE3LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ0FkbWluJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuZ2V0VXNlcnMgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydhZG1pbi91c2VyL2xpc3QnLCB7XG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbiAgc2VsZi5nZXREYXRhID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgaWQsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ2FkbWluL3VzZXIvJyArIGlkLCB7XG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cbiAqL1xubXlBcHAuc2VydmljZSgnQnVzcXVlZGFzU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5idXNjYXIgPSBmdW5jdGlvbiAodXJsLCB0ZXh0b0RlQnVzcXVlZGEsIG51bWVyb0RlUGFnaW5hKSB7XG4gICAgICAgIC8vIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydzZWFyY2gvJyArIHVybCArIHRleHRvRGVCdXNxdWVkYS5zcGxpdCgnICcpLmpvaW4oJy0nKSArICc/cGFnZT0nICsgbnVtZXJvRGVQYWdpbmEsIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsnc2VhcmNoLycgKyB1cmwgKyB0ZXh0b0RlQnVzcXVlZGEuc3BsaXQoJyAnKS5qb2luKCctJykse1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiVG9rZW5cIjogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxufSk7XG4iLCJteUFwcC5zZXJ2aWNlKCdMaXN0U2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbnRlcnNlY3Rpb25PZiA9IGZ1bmN0aW9uIChsaXN0YTEsIGxpc3RhMiwgc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsnYWRtaW4vdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkICsgJy8nLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgc2VsZi5nZXRBY3QgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBsaXN0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvcmFua2luZy8nICsgbGlzdGEsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH07XG5cblxuXG4gICAgc2VsZi5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsIHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ2xpc3QvJyArIGxpc3RhMS5pZCArICcvJyArIGxpc3RhMi5pZCwge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHNlbGYuY3JlYXRlTGlzdCA9IGZ1bmN0aW9uIChub21icmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qoc2V0dGluZ3MuYXBpVXJsKydsaXN0LycsIG5vbWJyZSwge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KVxuICAgIH07XG5cbiAgICBzZWxmLmFncmVnYXJBTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCsnbGlzdC8nICsgbGlzdGEuaWQgKyAnLycsIHBlbGljdWxhLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZWxmLnF1aXRhckRlTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XG4gICAgICAgIC8vIHJldHVybiAkaHR0cCh7XG4gICAgICAgIC8vICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAvLyAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLFxuICAgICAgICAvLyAgICAgZGF0YToge1xuICAgICAgICAvLyAgICAgICAgIG1vdmllOiBwZWxpY3VsYVxuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShzZXR0aW5ncy5hcGlVcmwrJ2xpc3QvJyArIGxpc3RhLmlkICsgJy8nKyBwZWxpY3VsYS5pZCx7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pO1xuXG5cbiAgICB9O1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuc2VydmljZSgnU2VzaW9uJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCsnYXV0aGVudGljYXRpb24vbG9naW4nLCBjcmVkZW50aWFscyk7XG4gICAgfTtcblxuICAgIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KHNldHRpbmdzLmFwaVVybCsnYXV0aGVudGljYXRpb24vbG9nb3V0Jyx1bmRlZmluZWQse2hlYWRlcnM6IHtcInRva2VuXCI6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufX0pXG4gICAgfTtcblxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDAxLzA1LzE3LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1VzdWFyaW8nLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qoc2V0dGluZ3MuYXBpVXJsKyd1c2VyLycsIGNyZWRlbnRpYWxzKTtcbiAgICB9O1xuXG4gICAgc2VsZi5nZXRSZWNNb3ZpZXMgPSBmdW5jdGlvbiAoc2VzaW9uLGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvbW92aWVzJywge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbi5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgc2VsZi5hY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNlbGYubWFyY2FyQWN0b3JGYXZvcml0byA9IGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgcmV0dXJuICRodHRwLnB1dChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvZmF2b3JpdGVhY3Rvci8nLCBhY3RvcixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG4gIHNlbGYuZGVzbWFyY2FyQWN0b3JGYXZvcml0byA9IGZ1bmN0aW9uIChhY3Rvcl9pZCkge1xuICAgIHJldHVybiAkaHR0cC5wdXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvJyArIGFjdG9yX2lkLG51bGwsXG4gICAgICB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gICAgc2VsZi5nZXRMaXN0YXMgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvbW92aWVMaXN0cycsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG4gICAgc2VsZi5nZXRSYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvZmF2b3JpdGVhY3Rvci9yYW5raW5nJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuXG5cbn0pXG47XG4iXX0=
