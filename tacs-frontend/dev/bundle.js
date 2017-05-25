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
                if($scope.listas.contains(response.data)){
                    alert('La lista ya existe.')
                }else{
                    $scope.listas.push(response.data);
                    alert('Lista creada con exito.')
                }
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

myApp.controller('MainController', function($rootScope,$scope,$state) {

    $rootScope.usuarioLogueado = false;
    $rootScope.esAdmin = false;

    if($rootScope.usuarioLogueado){
        $state.go('home');
    }else{
        $state.go('login');
    }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvYWRtaW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYWRtaW5SYW5raW5nQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2J1c2Nhck1vdmllc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mYXZvcml0b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmljaGFzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2hlYWRlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xpc3RDb21wQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xpc3RDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbG9naW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9yZWdpc3RlckNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9BZG1pbi5qcyIsInNlcnZpY2VzL0J1c3F1ZWRhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9MaXN0U2VydmljZS5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyIsInNlcnZpY2VzL1VzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJ10pO1xyXG4iLCJteUFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcclxuICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xyXG4gIHZhciBzdGF0ZXMgPSBbe1xyXG4gICAgICBuYW1lOiAnaG9tZScsXHJcbiAgICAgIHVybDogJy8nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgICB1cmw6ICcvYWN0b3Jlc0Zhdm9yaXRvcycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xpc3RhcycsXHJcbiAgICAgIHVybDogJy9saXN0YXMnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcclxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxyXG4gICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ3VzZXJzJyxcclxuICAgICAgdXJsOiAnL3VzZXJzJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3VzZXJzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ3VzZXJzLmxpc3RzJyxcclxuICAgICAgdXJsOiAnL2xpc3RzJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgdXNlcnNTZWw6IG51bGxcclxuICAgICAgfSxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL2xpc3RDb21wYXJpc29uLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZpY2hhUGVsaWN1bGEnLFxyXG4gICAgICB1cmw6ICcvbW92aWUvOmZpY2hhSWQnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlbGljdWxhLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZpY2hhUGVyc29uYScsXHJcbiAgICAgIHVybDogJy9wZXJzb24vOmZpY2hhSWQnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlcnNvbmEuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbntcclxuICBuYW1lOiAncmFua2luZ0FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgdXJsOiAnL3JhbmtpbmcnLFxyXG4gIHZpZXdzOiB7XHJcbiAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9yYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xyXG4gIH1cclxufVxyXG59XHJcblxyXG4gIF1cclxuXHJcbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxyXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XHJcbiAgfSk7XHJcblxyXG59KTtcclxuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cclxuLy8gICAgIFt7IG5hbWU6ICdoZWFkZXInLCB1cmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnfSxcclxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XHJcbi8vIH1dKTtcclxuIiwibXlBcHAuY29udHJvbGxlcignbmF2YmFyJywgZnVuY3Rpb24oJHNjb3BlKSB7XHJcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcclxuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAkc2NvcGUuaXNDb2xsYXBzZWRIb3Jpem9udGFsID0gZmFsc2U7XHJcbiAgJHNjb3BlLnNlYXJjaD17XHJcbiAgICBxdWVyeTogXCJcIixcclxuICAgIG9wdGlvbnM6IFtcIk1vdmllc1wiLFwiUGVvcGxlXCIsXCJBbnl0aGluZ1wiXSxcclxuICAgIGJ5OiBcIk1vdmllc1wiXHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgQWRtaW4pIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudXNlcnMgPSBbXTtcclxuICAgIHNlbGYudXNlcnNTZWxlYyA9IFtdO1xyXG4gICAgc2VsZi5zZWxlY3RlZFVzZXIgPSBcIlwiO1xyXG4gICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG4gICAgc2VsZi5zZXNpb24gPSAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbDtcclxuXHJcblxyXG4gICAgc2VsZi5pbXBvcnRVc2VycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBBZG1pbi5nZXRVc2Vycygkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXJzID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuaW1wb3J0VXNlcnMoKTtcclxuXHJcbiAgICBzZWxmLmNsZWFuU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgIHNlbGYudXNlcnMubWFwKGZ1bmN0aW9uICh1cykge1xyXG4gICAgICAgICAgICB1cy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5jb21wYXJlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi51c2Vyc1NlbGVjID0gc2VsZi51c2Vycy5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc2VsZWN0ZWRcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChzZWxmLnVzZXJzU2VsZWMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIHVzdWFyaW9zXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2VsZi51c2Vyc1NlbGVjLnNvbWUoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlLmxpc3RzLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5vIGRlIGxvcyB1c3VhcmlvcyBubyBwb3NlZSBsaXN0YXNcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3VzZXJzLmxpc3RzJywge3VzZXJzU2VsOiBzZWxmLnVzZXJzU2VsZWN9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNlbGYuZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIG1vbnRoID0gKDEgKyBkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbW9udGggPSBtb250aC5sZW5ndGggPiAxID8gbW9udGggOiAnMCcgKyBtb250aDtcclxuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBkYXkgPSBkYXkubGVuZ3RoID4gMSA/IGRheSA6ICcwJyArIGRheTtcclxuICAgICAgICByZXR1cm4gZGF5ICsgJy8nICsgbW9udGggKyAnLycgKyB5ZWFyO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLnNob3dVc2VycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gc2VsZi51c2VycztcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW47XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZ2V0VXNlcm5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmNyZWRlbmNpYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlNpbiBVc2VybmFtZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuY3JlZGVuY2lhbC51c2VybmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5nZXRMYXN0QWNjZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBpbmljacOzIHNlc2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmRhdGVGb3JtYXQoZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5udW1MaXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMubGVuZ3RoXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuZ2V0TW92aWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIubGlzdHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5udW1GYXZBY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmZhdm9yaXRlQWN0b3JzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycy5sZW5ndGhcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuZ2V0SW5mbyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIEFkbWluLmdldERhdGEoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsIGlkLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDgvMDUvMjAxNy5cclxuICovXHJcbm15QXBwLmNvbnRyb2xsZXIoJ2FkbWluUmFua2luZ0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBVc3VhcmlvKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmFua2luZygpIHtcclxuICAgICAgICBVc3VhcmlvLmdldFJhbmtpbmdBY3RvcmVzRmF2b3JpdG9zKClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucmFua2luZyA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFua2luZygpO1xyXG5cclxufSk7IiwibXlBcHAuY29udHJvbGxlcignZmljaGFDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSB7XHJcblxyXG4gICRzY29wZS50cmFlckZpY2hhID0gZnVuY3Rpb24odGlwbykge1xyXG4gICAgJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvJyArIHRpcG8gKyAnLycgKyAkc3RhdGVQYXJhbXMuZmljaGFJZCwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgXCJUb2tlblwiOiAnMTIzNDUnXHJcbiAgICAgIH1cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgJHNjb3BlLml0ZW0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgfSlcclxuICB9XHJcbn0pO1xyXG4iLCJteUFwcC5jb250cm9sbGVyKCdmYXZvcml0b3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAkc2NvcGUuYWN0b3Jlc0Zhdm9yaXRvcyA9IFtdO1xyXG4gICAgc2VsZi5yZWNNb3ZpZXMgPSB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAkc2NvcGUuc2VhcmNoUmVjTW92aWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFVzdWFyaW8uZ2V0UmVjTW92aWVzKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVjTW92aWVzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIHNlbGYudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBVc3VhcmlvLmFjdG9yZXNGYXZvcml0b3MoKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYWN0b3Jlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3MgPSBhY3RvcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2FjYXJEZUZhdm9yaXRvID0gZnVuY3Rpb24gKGFjdG9yKSB7XHJcbiAgICAgICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3Muc3BsaWNlKCRzY29wZS5hY3RvcmVzRmF2b3JpdG9zLmluZGV4T2YoYWN0b3IpLCAxKVxyXG4gICAgICAgIFVzdWFyaW8ubWFyY2FyQWN0b3JGYXZvcml0byhhY3Rvci5pZClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjdG9yZXNGYXZvcml0b3MoKTtcclxuXHJcbn0pO1xyXG5cclxuIiwibXlBcHAuY29udHJvbGxlcignZmljaGFQZWxpY3VsYUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIHtcclxuXHJcbiAgJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvbW92aWUvJyArICRzdGF0ZVBhcmFtcy5tb3ZpZUlkLCB7XHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xyXG4gICAgfVxyXG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICRzY29wZS5tb3ZpZSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgfSlcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDIvMDUvMjAxNy5cclxuICovXHJcbm15QXBwLmNvbnRyb2xsZXIoJ2hlYWRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XHJcblxyXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgU2VzaW9uLmxvZ291dCgpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICB9O1xyXG5cclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxyXG4gKi9cclxubXlBcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBCdXNxdWVkYXNTZXJ2aWNlLCBVc3VhcmlvLCBMaXN0U2VydmljZSkge1xyXG5cclxuICAgIHZhciBtb3ZpZXMgPSB7XHJcbiAgICAgICAgbmFtZTogXCJNb3ZpZXNcIixcclxuICAgICAgICB0aXRsZUxhYmVsOiBcIlRpdHVsb1wiLFxyXG4gICAgICAgIHVybDogXCJtb3ZpZS9cIixcclxuICAgICAgICBhZ3JlZ2FyTGlzdGE6IHRydWVcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBwZW9wbGUgPSB7XHJcbiAgICAgICAgbmFtZTogXCJQZW9wbGVcIixcclxuICAgICAgICB0aXRsZUxhYmVsOiBcIk5vbWJyZVwiLFxyXG4gICAgICAgIHVybDogXCJwZXJzb24vXCIsXHJcbiAgICAgICAgYWdyZWdhckZhdm9yaXRvOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBhbnl0aGluZyA9IHtcclxuICAgICAgICBuYW1lOiBcIkFueXRoaW5nXCIsXHJcbiAgICAgICAgdGl0bGVMYWJlbDogXCJUaXR1bG8vTm9tYnJlXCIsXHJcbiAgICAgICAgdXJsOiBcIlwiLFxyXG4gICAgICAgIG1vc3RyYXJUaXBvOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB1bHRpbWFCdXNxdWVkYVBvciA9IG1vdmllcztcclxuXHJcbiAgICAkc2NvcGUuc2VhcmNoID0ge1xyXG4gICAgICAgIHF1ZXJ5OiBcIlwiLFxyXG4gICAgICAgIG9wdGlvbnM6IFttb3ZpZXMsIHBlb3BsZSwgYW55dGhpbmddLFxyXG4gICAgICAgIGJ5OiBtb3ZpZXNcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmJ1c2NhciA9IGZ1bmN0aW9uIChidXNjYXJQb3IsIHRleHRvQUJ1c2Nhcikge1xyXG4gICAgICAgIGlmICghdGV4dG9BQnVzY2FyKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmKGJ1c2NhclBvci5hZ3JlZ2FyTGlzdGEpXHJcbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdGFzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEJ1c3F1ZWRhc1NlcnZpY2UuYnVzY2FyKGJ1c2NhclBvci51cmwsIHRleHRvQUJ1c2NhcilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkxvIHNlbnRpbW9zLCBubyBzZSBlbmNvbnRyYXJvbiByZXN1bHRhZG9zIHBhcmEgXFxcIlwiICsgdGV4dG9BQnVzY2FyICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gW107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEucmVzdWx0cztcclxuICAgICAgICAgICAgICAgICRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9IGJ1c2NhclBvcjtcclxuICAgICAgICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmFncmVnYXJDb21vRmF2b3JpdG8gPSBmdW5jdGlvbiAoYWN0b3IpIHtcclxuXHJcbiAgICAgICAgaWYgKChhY3Rvci5tZWRpYV90eXBlID09ICdwZXJzb24nKSB8fCAoJHNjb3BlLnVsdGltYUJ1c3F1ZWRhUG9yID09IHBlb3BsZSkpIHtcclxuICAgICAgICAgICAgVXN1YXJpby5tYXJjYXJBY3RvckZhdm9yaXRvKGFjdG9yLmlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBY3RvciBhZ3JlZ2Fkby4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdMbyBxdWUgc2VsZWNjaW9ubyBubyBlcyB1biBhY3RvcicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgJHNjb3BlLmFncmVnYXJBTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UuYWdyZWdhckFMaXN0YShwZWxpY3VsYSxsaXN0YSk7XHJcbiAgICB9XHJcblxyXG5cclxufSk7XHJcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2xpc3RDb21wQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsJHN0YXRlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnVzZXIxID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzBdXHJcbiAgICBzZWxmLnVzZXIxTGlzdCA9IFwiXCJcclxuICAgIHNlbGYudXNlcjIgPSAkc3RhdGVQYXJhbXMudXNlcnNTZWxbMV1cclxuICAgIHNlbGYudXNlcjJMaXN0ID0gXCJcIlxyXG4gICAgc2VsZi5pbnRlcnNlY3Rpb24gPSBudWxsXHJcbiAgICBzZWxmLnNlc2lvbiA9ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsO1xyXG5cclxuICAgIHNlbGYuY29tcGFyZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLnVzZXIxTGlzdCwgc2VsZi51c2VyMkxpc3QsIHNlbGYuc2VzaW9uLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbjtcclxuICB9O1xyXG59KTtcclxuIiwibXlBcHAuY29udHJvbGxlcignbGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTGlzdFNlcnZpY2UsIFVzdWFyaW8pIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAkc2NvcGUubGlzdGFzID0gW107XHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChub21icmUpIHtcclxuICAgICAgICBMaXN0U2VydmljZS5jcmVhdGVMaXN0KG5vbWJyZSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubW92aWVMaXN0ID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5saXN0YXMuY29udGFpbnMocmVzcG9uc2UuZGF0YSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdMYSBsaXN0YSB5YSBleGlzdGUuJylcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMucHVzaChyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnTGlzdGEgY3JlYWRhIGNvbiBleGl0by4nKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5vbWJyZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldExpc3RhcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBVc3VhcmlvLmdldExpc3RhcygpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RhcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAkc2NvcGUubGlzdGFzLm1hcChmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICBsLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2VsZi5nZXRBY3RvcmVzID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UuZ2V0QWN0KCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLCBpZCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmFjdG9yZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuY29tcGFyZVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYubGlzdGFzU2VsZWMgPSAkc2NvcGUubGlzdGFzLmZpbHRlcihmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdC5zZWxlY3RlZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHNlbGYubGlzdGFzU2VsZWMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIGxpc3Rhc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNlbGYubGlzdGFzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGUubW92aWVzLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5hIGRlIGxhcyBsaXN0YXMgbm8gcG9zZWUgcGVsw61jdWxhc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLmxpc3Rhc1NlbGVjWzBdLCBzZWxmLmxpc3Rhc1NlbGVjWzFdLCAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5xdWl0YXJEZUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhQVF1aXRhcixsaXN0KSB7XHJcbiAgICAgICAgLy9saXN0LnJlbW92ZShsaXN0LmluZGV4T2YocGVsaWN1bGFBUXVpdGFyKSk7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UucXVpdGFyRGVMaXN0YShwZWxpY3VsYUFRdWl0YXIsbGlzdCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBzZWxmLmdldExpc3RhcygpO1xyXG5cclxufSk7IiwibXlBcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBTZXNpb24pIHtcclxuXHJcbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xyXG4gICAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIjtcclxuXHJcbiAgICAkc2NvcGUuYXV0ZW50aWNhcnNlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFNlc2lvbi5sb2dpbih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICRyb290U2NvcGUuc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IHRydWU7XHJcbiAgICAgICAgJHJvb3RTY29wZS5lc0FkbWluID0gcmVzcG9uc2UuZGF0YS5lc0FkbWluO1xyXG5cclxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgfTtcclxuXHJcbn0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUpIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xyXG4gICAgJHJvb3RTY29wZS5lc0FkbWluID0gZmFsc2U7XHJcblxyXG4gICAgaWYoJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8pe1xyXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgfVxyXG5cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHBcclxuICAuY29udHJvbGxlcigncmVnaXN0ZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBVc3VhcmlvKSB7XHJcblxyXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcclxuICAgICRzY29wZS5wYXNzd29yZDEgPSBcIlwiO1xyXG4gICAgJHNjb3BlLnBhc3N3b3JkMiA9IFwiXCI7XHJcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiO1xyXG5cclxuICAgICRzY29wZS5yZWdpc3Rlck5ld1VzZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkc2NvcGUucGFzc3dvcmQxID09PSAkc2NvcGUucGFzc3dvcmQyKSB7XHJcbiAgICAgICAgVXN1YXJpby5yZWdpc3Rlcih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZDF9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgYWxlcnQoXCJVc3VhcmlvIGNyZWFkbyBjb3JyZWN0YW1lbnRlIVwiKTtcclxuICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoXCJMYXMgcGFzc3dvcmRzIG5vIGNvaW5jaWRlblwiLCBcIlBvciBmYXZvciByZXZpc2FsYXMgYW50ZXMgZGUgZW52aWFyIGVsIGZvcm11bGFyaW9cIiwgXCJlcnJvclwiKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUucmV0dXJuVG9NYWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY29udHJhc2VuaWFzRGlzdGludGFzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJHNjb3BlLnBhc3N3b3JkMSAhPT0gJHNjb3BlLnBhc3N3b3JkMjtcclxuICAgIH1cclxuXHJcbiAgfSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDA2LzA1LzE3LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuc2VydmljZSgnQWRtaW4nLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBzZWxmLmdldFVzZXJzID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hZG1pbi91c2VyL2xpc3QnLCB7XHJcbiAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XHJcbiAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHNlbGYuZ2V0RGF0YSA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGlkLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FkbWluL3VzZXIvJyArIGlkLCB7XHJcbiAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XHJcbiAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXHJcbiAqL1xyXG5teUFwcC5zZXJ2aWNlKCdCdXNxdWVkYXNTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHApIHtcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBzZWxmLmJ1c2NhciA9IGZ1bmN0aW9uKHVybCwgdGV4dG9EZUJ1c3F1ZWRhKSB7XHJcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvc2VhcmNoLycgKyB1cmwgKyB0ZXh0b0RlQnVzcXVlZGEuc3BsaXQoJyAnKS5qb2luKCctJyksIHtcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxufSk7XHJcbiIsIm15QXBwLnNlcnZpY2UoJ0xpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuaW50ZXJzZWN0aW9uT2YgPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsIHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkICsgJy8nLCB7XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XHJcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZ2V0QWN0ID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgbGlzdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvcmFua2luZy8nICsgbGlzdGEsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzZWxmLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChsaXN0YTEsIGxpc3RhMiwgc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9saXN0LycgKyBsaXN0YTEuaWQgKyAnLycgKyBsaXN0YTIuaWQsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5jcmVhdGVMaXN0ID0gZnVuY3Rpb24gKG5vbWJyZSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvbGlzdC8nLCBub21icmUsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuYWdyZWdhckFMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYSwgbGlzdGEpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLCBwZWxpY3VsYSwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYucXVpdGFyRGVMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYSwgbGlzdGEpIHtcclxuICAgICAgICAvLyByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgIC8vICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgIC8vICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvbGlzdC8nICsgbGlzdGEuaWQgKyAnLycsXHJcbiAgICAgICAgLy8gICAgIGRhdGE6IHtcclxuICAgICAgICAvLyAgICAgICAgIG1vdmllOiBwZWxpY3VsYVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLHtcclxuICAgICAgICAgICAgZGF0YToge21vdmllOiBwZWxpY3VsYX0sXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfTtcclxuXHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLnNlcnZpY2UoJ1Nlc2lvbicsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dpbicsIGNyZWRlbnRpYWxzKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGhlbnRpY2F0aW9uL2xvZ291dCcsdW5kZWZpbmVkLHtoZWFkZXJzOiB7XCJ0b2tlblwiOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn19KVxyXG4gICAgfTtcclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwMS8wNS8xNy5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLnNlcnZpY2UoJ1VzdWFyaW8nLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5yZWdpc3RlciA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci8nLCBjcmVkZW50aWFscyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZ2V0UmVjTW92aWVzID0gZnVuY3Rpb24gKHNlc2lvbixjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvbW92aWVzJywge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuYWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYubWFyY2FyQWN0b3JGYXZvcml0byA9IGZ1bmN0aW9uIChpZEFjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvZmF2b3JpdGVhY3Rvci8nICsgaWRBY3RvciArICcvJywgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5nZXRMaXN0YXMgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9tb3ZpZUxpc3RzJywge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfTtcclxuICAgIHNlbGYuZ2V0UmFua2luZ0FjdG9yZXNGYXZvcml0b3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvZmF2b3JpdGVhY3Rvci9yYW5raW5nJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59KVxyXG47Il19
