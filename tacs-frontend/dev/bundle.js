var myApp = angular.module('myApp', ['ui.router','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

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

// myApp.controller('TemplateController', ['$scope', function($scope) {
//   $scope.templates =
//     [{ name: 'header', url: 'templates/header.html'},
//      { name: 'footer', url: 'templates/footer.html'}];
// }]);

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

    $scope.buscar = function (buscarPor, textoABuscar) {
        if (!textoABuscar)
            return;

        if(buscarPor.agregarLista)
            Usuario.getListas()
                .then(function (response) {
                    $scope.listas = response.data;
                });

        BusquedasService.buscar(buscarPor.url, textoABuscar)
            .then(function (response) {
                if (response.data.results <= 0) {
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
                    $scope.resultados = [];
                } else
                    $scope.resultados = response.data.results;
                $scope.ultimaBusquedaPor = buscarPor;
            })
    };

    $scope.agregarComoFavorito = function (actor) {

        if ((actor.media_type == 'person') || ($scope.ultimaBusquedaPor == people)) {
            Usuario.marcarActorFavorito(actor.id)
                .then(function () {
                    alert('Actor agregado.');
                });
        } else {
            alert('Lo que selecciono no es un actor');
            return;
        }
    };
    
    $scope.agregarALista = function (pelicula, lista) {
        ListService.agregarALista(pelicula,lista);
    }


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
            if (self.selectedUser.credencial === null) {
                return "Sin Username"
            }
            else {
                return self.selectedUser.credencial.username;
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
    $http.get('http://localhost:8080/' + tipo + '/' + $stateParams.fichaId, {
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
        $scope.actoresFavoritos.splice($scope.actoresFavoritos.indexOf(actor), 1)
        Usuario.marcarActorFavorito(actor.id)
    }

    this.actoresFavoritos();

});


myApp.controller('fichaPeliculaController', function($scope, $http, $stateParams) {

  $http.get('http://localhost:8080/movie/' + $stateParams.movieId, {
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
        //list.remove(list.indexOf(peliculaAQuitar));
        ListService.quitarDeLista(peliculaAQuitar,list);
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
    return $http.get('http://localhost:8080/admin/user/list', {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

  self.getData = function (sesionActual, id, callback) {
    return $http.get('http://localhost:8080/admin/user/' + id, {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

});
/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.service('BusquedasService', function($http) {

  var self = this;

  self.buscar = function(url, textoDeBusqueda) {
    return $http.get('http://localhost:8080/search/' + url + textoDeBusqueda.split(' ').join('-'), {
      headers: {
        "Token": '12345'
      }
    });
  };

});

myApp.service('ListService', function ($http, $rootScope) {

    var self = this;

    self.intersectionOf = function (lista1, lista2, sesionActual, callback) {
        return $http.get('http://localhost:8080/admin/user/' + lista1.id + '/' + lista2.id + '/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.getAct = function (sesionActual, lista, callback) {
        return $http.get('http://localhost:8080/user/ranking/' + lista, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };



    self.intersection = function (lista1, lista2, sesionActual, callback) {
        return $http.get('http://localhost:8080/list/' + lista1.id + '/' + lista2.id, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.createList = function (nombre) {
        return $http.post('http://localhost:8080/list/', nombre, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        })
    };

    self.agregarALista = function (pelicula, lista) {
        return $http.post('http://localhost:8080/list/' + lista.id + '/', pelicula, {
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
        return $http.delete('http://localhost:8080/list/' + lista.id + '/',{
            data: {movie: pelicula},
            headers: {'token': $rootScope.sesionActual.idSesion}
        });


    };

});
'use strict';

myApp.service('Sesion', function ($http, $rootScope) {

    var self = this;

    self.login = function (credentials) {
        return $http.post('http://localhost:8080/authentication/login', credentials);
    };

    self.logout = function () {
        return $http.put('http://localhost:8080/authentication/logout',undefined,{headers: {"token": $rootScope.sesionActual.idSesion}})
    };

});
/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

    var self = this;

    self.register = function (credentials) {
        return $http.post('http://localhost:8080/user/', credentials);
    };

    self.getRecMovies = function (sesion,callback) {
        return $http.get('http://localhost:8080/user/favoriteactor/movies', {
            headers: {'token': sesion.idSesion}
        }).then(callback);
    }

    self.actoresFavoritos = function (credentials) {
        return $http.get('http://localhost:8080/user/favoriteactor/',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.marcarActorFavorito = function (idActor) {
        return $http.put('http://localhost:8080/user/favoriteactor/' + idActor + '/', undefined,
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.getListas = function (credentials) {
        return $http.get('http://localhost:8080/user/movieLists', {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
    self.getRankingActoresFavoritos = function () {
        return $http.get('http://localhost:8080/user/favoriteactor/ranking',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }



})
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluUmFua2luZ0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9idXNjYXJNb3ZpZXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2ZpY2hhc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9oZWFkZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbXBDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9yZWdpc3RlckNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9BZG1pbi5qcyIsInNlcnZpY2VzL0J1c3F1ZWRhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9MaXN0U2VydmljZS5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyIsInNlcnZpY2VzL1VzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJ10pO1xuIiwibXlBcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gIC8vIEFuIGFycmF5IG9mIHN0YXRlIGRlZmluaXRpb25zXG4gIHZhciBzdGF0ZXMgPSBbe1xuICAgICAgbmFtZTogJ2hvbWUnLFxuICAgICAgdXJsOiAnLycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9ob21lLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsb2dpbicsXG4gICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAncmVnaXN0ZXInLFxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdyZWdpc3RlckNvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVnaXN0ZXIuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxuICAgICAgdXJsOiAnL2FjdG9yZXNGYXZvcml0b3MnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdsaXN0YXMnLFxuICAgICAgdXJsOiAnL2xpc3RhcycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9saXN0YXMvbGlzdC5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdidXNjYXJNb3ZpZXMnLFxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxuICAgICAgY29udHJvbGxlcjogJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnVzY2FyL21vdmllcy5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICd1c2VycycsXG4gICAgICB1cmw6ICcvdXNlcnMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWRtaW4vdXNlcnMuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAndXNlcnMubGlzdHMnLFxuICAgICAgdXJsOiAnL2xpc3RzJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICB1c2Vyc1NlbDogbnVsbFxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL2xpc3RDb21wYXJpc29uLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ2ZpY2hhUGVsaWN1bGEnLFxuICAgICAgdXJsOiAnL21vdmllLzpmaWNoYUlkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2ZpY2hhcy9wZWxpY3VsYS5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdmaWNoYVBlcnNvbmEnLFxuICAgICAgdXJsOiAnL3BlcnNvbi86ZmljaGFJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9maWNoYXMvcGVyc29uYS5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbntcbiAgbmFtZTogJ3JhbmtpbmdBY3RvcmVzRmF2b3JpdG9zJyxcbiAgICB1cmw6ICcvcmFua2luZycsXG4gIHZpZXdzOiB7XG4gICdjb250YWluZXJAJzoge1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3JhbmtpbmdBY3RvcmVzRmF2b3JpdG9zLmh0bWwnXG4gIH1cbn1cbn1cblxuICBdXG5cbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxuICBzdGF0ZXMuZm9yRWFjaChmdW5jdGlvbihzdGF0ZSkge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlKTtcbiAgfSk7XG5cbn0pO1xuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcbi8vICAgJHNjb3BlLnRlbXBsYXRlcyA9XG4vLyAgICAgW3sgbmFtZTogJ2hlYWRlcicsIHVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCd9LFxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XG4vLyB9XSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcbiAgJHNjb3BlLnNlYXJjaD17XG4gICAgcXVlcnk6IFwiXCIsXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxuICAgIGJ5OiBcIk1vdmllc1wiXG4gIH1cblxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEJ1c3F1ZWRhc1NlcnZpY2UsIFVzdWFyaW8sIExpc3RTZXJ2aWNlKSB7XG5cbiAgICB2YXIgbW92aWVzID0ge1xuICAgICAgICBuYW1lOiBcIk1vdmllc1wiLFxuICAgICAgICB0aXRsZUxhYmVsOiBcIlRpdHVsb1wiLFxuICAgICAgICB1cmw6IFwibW92aWUvXCIsXG4gICAgICAgIGFncmVnYXJMaXN0YTogdHJ1ZVxuXG4gICAgfTtcblxuICAgIHZhciBwZW9wbGUgPSB7XG4gICAgICAgIG5hbWU6IFwiUGVvcGxlXCIsXG4gICAgICAgIHRpdGxlTGFiZWw6IFwiTm9tYnJlXCIsXG4gICAgICAgIHVybDogXCJwZXJzb24vXCIsXG4gICAgICAgIGFncmVnYXJGYXZvcml0bzogdHJ1ZVxuICAgIH07XG5cbiAgICB2YXIgYW55dGhpbmcgPSB7XG4gICAgICAgIG5hbWU6IFwiQW55dGhpbmdcIixcbiAgICAgICAgdGl0bGVMYWJlbDogXCJUaXR1bG8vTm9tYnJlXCIsXG4gICAgICAgIHVybDogXCJcIixcbiAgICAgICAgbW9zdHJhclRpcG86IHRydWVcbiAgICB9O1xuXG4gICAgdmFyIHVsdGltYUJ1c3F1ZWRhUG9yID0gbW92aWVzO1xuXG4gICAgJHNjb3BlLnNlYXJjaCA9IHtcbiAgICAgICAgcXVlcnk6IFwiXCIsXG4gICAgICAgIG9wdGlvbnM6IFttb3ZpZXMsIHBlb3BsZSwgYW55dGhpbmddLFxuICAgICAgICBieTogbW92aWVzXG4gICAgfTtcblxuICAgICRzY29wZS5idXNjYXIgPSBmdW5jdGlvbiAoYnVzY2FyUG9yLCB0ZXh0b0FCdXNjYXIpIHtcbiAgICAgICAgaWYgKCF0ZXh0b0FCdXNjYXIpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYoYnVzY2FyUG9yLmFncmVnYXJMaXN0YSlcbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdGFzKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RhcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgQnVzcXVlZGFzU2VydmljZS5idXNjYXIoYnVzY2FyUG9yLnVybCwgdGV4dG9BQnVzY2FyKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEucmVzdWx0cyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiTG8gc2VudGltb3MsIG5vIHNlIGVuY29udHJhcm9uIHJlc3VsdGFkb3MgcGFyYSBcXFwiXCIgKyB0ZXh0b0FCdXNjYXIgKyBcIlxcXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gW107XG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gcmVzcG9uc2UuZGF0YS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgICRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9IGJ1c2NhclBvcjtcbiAgICAgICAgICAgIH0pXG4gICAgfTtcblxuICAgICRzY29wZS5hZ3JlZ2FyQ29tb0Zhdm9yaXRvID0gZnVuY3Rpb24gKGFjdG9yKSB7XG5cbiAgICAgICAgaWYgKChhY3Rvci5tZWRpYV90eXBlID09ICdwZXJzb24nKSB8fCAoJHNjb3BlLnVsdGltYUJ1c3F1ZWRhUG9yID09IHBlb3BsZSkpIHtcbiAgICAgICAgICAgIFVzdWFyaW8ubWFyY2FyQWN0b3JGYXZvcml0byhhY3Rvci5pZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBY3RvciBhZ3JlZ2Fkby4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdMbyBxdWUgc2VsZWNjaW9ubyBubyBlcyB1biBhY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAkc2NvcGUuYWdyZWdhckFMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYSwgbGlzdGEpIHtcbiAgICAgICAgTGlzdFNlcnZpY2UuYWdyZWdhckFMaXN0YShwZWxpY3VsYSxsaXN0YSk7XG4gICAgfVxuXG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSkge1xuXG4gICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSBmYWxzZTtcbiAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSBmYWxzZTtcblxuICAgIGlmKCRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvKXtcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgfWVsc2V7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgQWRtaW4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi51c2VycyA9IFtdO1xuICAgIHNlbGYudXNlcnNTZWxlYyA9IFtdO1xuICAgIHNlbGYuc2VsZWN0ZWRVc2VyID0gXCJcIjtcbiAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgc2VsZi5zZXNpb24gPSAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbDtcblxuXG4gICAgc2VsZi5pbXBvcnRVc2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQWRtaW4uZ2V0VXNlcnMoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXJzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmltcG9ydFVzZXJzKCk7XG5cbiAgICBzZWxmLmNsZWFuU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICAgICAgc2VsZi51c2Vycy5tYXAoZnVuY3Rpb24gKHVzKSB7XG4gICAgICAgICAgICB1cy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuY29tcGFyZVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnVzZXJzU2VsZWMgPSBzZWxmLnVzZXJzLmZpbHRlcihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc2VsZWN0ZWRcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHNlbGYudXNlcnNTZWxlYy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIHVzdWFyaW9zXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxmLnVzZXJzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmxpc3RzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJVbm8gZGUgbG9zIHVzdWFyaW9zIG5vIHBvc2VlIGxpc3Rhc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3VzZXJzLmxpc3RzJywge3VzZXJzU2VsOiBzZWxmLnVzZXJzU2VsZWN9KVxuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIHNlbGYuZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB2YXIgbW9udGggPSAoMSArIGRhdGUuZ2V0TW9udGgoKSkudG9TdHJpbmcoKTtcbiAgICAgICAgbW9udGggPSBtb250aC5sZW5ndGggPiAxID8gbW9udGggOiAnMCcgKyBtb250aDtcbiAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCk7XG4gICAgICAgIGRheSA9IGRheS5sZW5ndGggPiAxID8gZGF5IDogJzAnICsgZGF5O1xuICAgICAgICByZXR1cm4gZGF5ICsgJy8nICsgbW9udGggKyAnLycgKyB5ZWFyO1xuICAgIH07XG5cbiAgICBzZWxmLnNob3dVc2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYudXNlcnM7XG4gICAgfTtcblxuICAgIHNlbGYuZXNBZG1pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbjtcbiAgICB9O1xuXG4gICAgc2VsZi5nZXRVc2VybmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5jcmVkZW5jaWFsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU2luIFVzZXJuYW1lXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5jcmVkZW5jaWFsLnVzZXJuYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9O1xuXG4gICAgc2VsZi5nZXRMYXN0QWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxhc3RBY2Nlc3MgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBpbmljacOzIHNlc2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kYXRlRm9ybWF0KGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHNlbGYubnVtTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYuZ2V0TW92aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIubGlzdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLm51bUZhdkFjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmZhdm9yaXRlQWN0b3JzLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICBzZWxmLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzZWxmLmdldEluZm8gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgQWRtaW4uZ2V0RGF0YSgkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCwgaWQsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IHRydWU7XG5cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwOC8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdhZG1pblJhbmtpbmdDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xuXG4gICAgZnVuY3Rpb24gZ2V0UmFua2luZygpIHtcbiAgICAgICAgVXN1YXJpby5nZXRSYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmFua2luZyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFJhbmtpbmcoKTtcblxufSk7IiwibXlBcHAuY29udHJvbGxlcignZmljaGFDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSB7XG5cbiAgJHNjb3BlLnRyYWVyRmljaGEgPSBmdW5jdGlvbih0aXBvKSB7XG4gICAgJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvJyArIHRpcG8gKyAnLycgKyAkc3RhdGVQYXJhbXMuZmljaGFJZCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIlRva2VuXCI6ICcxMjM0NSdcbiAgICAgIH1cbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuaXRlbSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSlcbiAgfVxufSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCdmYXZvcml0b3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3MgPSBbXTtcbiAgICBzZWxmLnJlY01vdmllcyA9IHVuZGVmaW5lZDtcbiAgICBzZWxmLnZpc2libGUgPSBmYWxzZTtcblxuICAgICRzY29wZS5zZWFyY2hSZWNNb3ZpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVzdWFyaW8uZ2V0UmVjTW92aWVzKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZWNNb3ZpZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIHNlbGYudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KVxuICAgIH07XG5cbiAgICB0aGlzLmFjdG9yZXNGYXZvcml0b3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVzdWFyaW8uYWN0b3Jlc0Zhdm9yaXRvcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYWN0b3Jlcykge1xuICAgICAgICAgICAgICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zID0gYWN0b3Jlcy5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zYWNhckRlRmF2b3JpdG8gPSBmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3Muc3BsaWNlKCRzY29wZS5hY3RvcmVzRmF2b3JpdG9zLmluZGV4T2YoYWN0b3IpLCAxKVxuICAgICAgICBVc3VhcmlvLm1hcmNhckFjdG9yRmF2b3JpdG8oYWN0b3IuaWQpXG4gICAgfVxuXG4gICAgdGhpcy5hY3RvcmVzRmF2b3JpdG9zKCk7XG5cbn0pO1xuXG4iLCJteUFwcC5jb250cm9sbGVyKCdmaWNoYVBlbGljdWxhQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykge1xuXG4gICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL21vdmllLycgKyAkc3RhdGVQYXJhbXMubW92aWVJZCwge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xuICAgIH1cbiAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICRzY29wZS5tb3ZpZSA9IHJlc3BvbnNlLmRhdGE7XG4gIH0pXG59KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAyLzA1LzIwMTcuXG4gKi9cbm15QXBwLmNvbnRyb2xsZXIoJ2hlYWRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XG5cbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFNlc2lvbi5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2VzaW9uQWN0dWFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSlcblxuICAgIH07XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2xpc3RDb21wQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsJHN0YXRlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudXNlcjEgPSAkc3RhdGVQYXJhbXMudXNlcnNTZWxbMF1cbiAgICBzZWxmLnVzZXIxTGlzdCA9IFwiXCJcbiAgICBzZWxmLnVzZXIyID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzFdXG4gICAgc2VsZi51c2VyMkxpc3QgPSBcIlwiXG4gICAgc2VsZi5pbnRlcnNlY3Rpb24gPSBudWxsXG4gICAgc2VsZi5zZXNpb24gPSAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbDtcblxuICAgIHNlbGYuY29tcGFyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTGlzdFNlcnZpY2UuaW50ZXJzZWN0aW9uT2Yoc2VsZi51c2VyMUxpc3QsIHNlbGYudXNlcjJMaXN0LCBzZWxmLnNlc2lvbixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gIHNlbGYuZXNBZG1pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJHJvb3RTY29wZS5lc0FkbWluO1xuICB9O1xufSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCdsaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBMaXN0U2VydmljZSwgVXN1YXJpbykge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICRzY29wZS5saXN0YXMgPSBbXTtcblxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbiAobm9tYnJlKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmNyZWF0ZUxpc3Qobm9tYnJlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm1vdmllTGlzdCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Rhcy5wdXNoKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdMaXN0YSBjcmVhZGEgY29uIGV4aXRvLicpXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5vbWJyZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5nZXRMaXN0YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVzdWFyaW8uZ2V0TGlzdGFzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5jbGVhblNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgJHNjb3BlLmxpc3Rhcy5tYXAoZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgICAgIGwuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgXG4gICAgc2VsZi5nZXRBY3RvcmVzID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmdldEFjdCgkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCwgaWQsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdG9yZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmNvbXBhcmVTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5saXN0YXNTZWxlYyA9ICRzY29wZS5saXN0YXMuZmlsdGVyKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdC5zZWxlY3RlZFxuICAgICAgICB9KVxuICAgICAgICBpZiAoc2VsZi5saXN0YXNTZWxlYy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIGxpc3Rhc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZi5saXN0YXNTZWxlYy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUubW92aWVzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJVbmEgZGUgbGFzIGxpc3RhcyBubyBwb3NlZSBwZWzDrWN1bGFzXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIExpc3RTZXJ2aWNlLmludGVyc2VjdGlvbk9mKHNlbGYubGlzdGFzU2VsZWNbMF0sIHNlbGYubGlzdGFzU2VsZWNbMV0sICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgICRzY29wZS5xdWl0YXJEZUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhQVF1aXRhcixsaXN0KSB7XG4gICAgICAgIC8vbGlzdC5yZW1vdmUobGlzdC5pbmRleE9mKHBlbGljdWxhQVF1aXRhcikpO1xuICAgICAgICBMaXN0U2VydmljZS5xdWl0YXJEZUxpc3RhKHBlbGljdWxhQVF1aXRhcixsaXN0KTtcbiAgICB9O1xuXG5cbiAgICBzZWxmLmdldExpc3RhcygpO1xuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIFNlc2lvbikge1xuXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQgPSBcIlwiO1xuXG4gICAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIFNlc2lvbi5sb2dpbih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IHRydWU7XG4gICAgICAgICRyb290U2NvcGUuZXNBZG1pbiA9IHJlc3BvbnNlLmRhdGEuZXNBZG1pbjtcblxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XG4gICAgICB9KVxuXG4gICAgfTtcblxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHBcbiAgLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgVXN1YXJpbykge1xuXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQxID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQyID0gXCJcIjtcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiO1xuXG4gICAgJHNjb3BlLnJlZ2lzdGVyTmV3VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkc2NvcGUucGFzc3dvcmQxID09PSAkc2NvcGUucGFzc3dvcmQyKSB7XG4gICAgICAgIFVzdWFyaW8ucmVnaXN0ZXIoe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQxfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBhbGVydChcIlVzdWFyaW8gY3JlYWRvIGNvcnJlY3RhbWVudGUhXCIpO1xuICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJMYXMgcGFzc3dvcmRzIG5vIGNvaW5jaWRlblwiLCBcIlBvciBmYXZvciByZXZpc2FsYXMgYW50ZXMgZGUgZW52aWFyIGVsIGZvcm11bGFyaW9cIiwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJldHVyblRvTWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb250cmFzZW5pYXNEaXN0aW50YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnBhc3N3b3JkMSAhPT0gJHNjb3BlLnBhc3N3b3JkMjtcbiAgICB9XG5cbiAgfSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwNi8wNS8xNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdBZG1pbicsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmdldFVzZXJzID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci9saXN0Jywge1xuICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNlbGYuZ2V0RGF0YSA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hZG1pbi91c2VyLycgKyBpZCwge1xuICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgfVxuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxuICovXG5teUFwcC5zZXJ2aWNlKCdCdXNxdWVkYXNTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5idXNjYXIgPSBmdW5jdGlvbih1cmwsIHRleHRvRGVCdXNxdWVkYSkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zZWFyY2gvJyArIHVybCArIHRleHRvRGVCdXNxdWVkYS5zcGxpdCgnICcpLmpvaW4oJy0nKSwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIlRva2VuXCI6ICcxMjM0NSdcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCJteUFwcC5zZXJ2aWNlKCdMaXN0U2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbnRlcnNlY3Rpb25PZiA9IGZ1bmN0aW9uIChsaXN0YTEsIGxpc3RhMiwgc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkICsgJy8nLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgc2VsZi5nZXRBY3QgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBsaXN0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvcmFua2luZy8nICsgbGlzdGEsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH07XG5cblxuXG4gICAgc2VsZi5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsIHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhMS5pZCArICcvJyArIGxpc3RhMi5pZCwge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHNlbGYuY3JlYXRlTGlzdCA9IGZ1bmN0aW9uIChub21icmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9saXN0LycsIG5vbWJyZSwge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KVxuICAgIH07XG5cbiAgICBzZWxmLmFncmVnYXJBTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvbGlzdC8nICsgbGlzdGEuaWQgKyAnLycsIHBlbGljdWxhLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZWxmLnF1aXRhckRlTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XG4gICAgICAgIC8vIHJldHVybiAkaHR0cCh7XG4gICAgICAgIC8vICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAvLyAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLFxuICAgICAgICAvLyAgICAgZGF0YToge1xuICAgICAgICAvLyAgICAgICAgIG1vdmllOiBwZWxpY3VsYVxuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLHtcbiAgICAgICAgICAgIGRhdGE6IHttb3ZpZTogcGVsaWN1bGF9LFxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KTtcblxuXG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdTZXNpb24nLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dpbicsIGNyZWRlbnRpYWxzKTtcbiAgICB9O1xuXG4gICAgc2VsZi5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dvdXQnLHVuZGVmaW5lZCx7aGVhZGVyczoge1widG9rZW5cIjogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259fSlcbiAgICB9O1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDAxLzA1LzE3LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1VzdWFyaW8nLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyLycsIGNyZWRlbnRpYWxzKTtcbiAgICB9O1xuXG4gICAgc2VsZi5nZXRSZWNNb3ZpZXMgPSBmdW5jdGlvbiAoc2VzaW9uLGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvbW92aWVzJywge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbi5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgc2VsZi5hY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNlbGYubWFyY2FyQWN0b3JGYXZvcml0byA9IGZ1bmN0aW9uIChpZEFjdG9yKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvJyArIGlkQWN0b3IgKyAnLycsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNlbGYuZ2V0TGlzdGFzID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL21vdmllTGlzdHMnLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuICAgIHNlbGYuZ2V0UmFua2luZ0FjdG9yZXNGYXZvcml0b3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvcmFua2luZycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cblxuXG59KVxuO1xuIl19
