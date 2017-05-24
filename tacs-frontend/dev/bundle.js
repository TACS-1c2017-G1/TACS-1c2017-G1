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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluUmFua2luZ0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9idXNjYXJNb3ZpZXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2ZpY2hhc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9oZWFkZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbXBDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9yZWdpc3RlckNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9BZG1pbi5qcyIsInNlcnZpY2VzL0J1c3F1ZWRhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9MaXN0U2VydmljZS5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyIsInNlcnZpY2VzL1VzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCddKTtcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xuICB2YXIgc3RhdGVzID0gW3tcbiAgICAgIG5hbWU6ICdob21lJyxcbiAgICAgIHVybDogJy8nLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbG9naW4nLFxuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcbiAgICAgIHVybDogJy9yZWdpc3RlcicsXG4gICAgICBjb250cm9sbGVyOiAncmVnaXN0ZXJDb250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlZ2lzdGVyLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdhY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgIHVybDogJy9hY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FjdG9yZXNGYXZvcml0b3MuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnbGlzdGFzJyxcbiAgICAgIHVybDogJy9saXN0YXMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcbiAgICAgIHVybDogJy9idXNjYXIvcGVsaWN1bGEvJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdidXNjYXJNb3ZpZXNDb250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2J1c2Nhci9tb3ZpZXMuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAndXNlcnMnLFxuICAgICAgdXJsOiAnL3VzZXJzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3VzZXJzLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ3VzZXJzLmxpc3RzJyxcbiAgICAgIHVybDogJy9saXN0cycsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdXNlcnNTZWw6IG51bGxcbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9saXN0Q29tcGFyaXNvbi5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdmaWNoYVBlbGljdWxhJyxcbiAgICAgIHVybDogJy9tb3ZpZS86ZmljaGFJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9maWNoYXMvcGVsaWN1bGEuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnZmljaGFQZXJzb25hJyxcbiAgICAgIHVybDogJy9wZXJzb24vOmZpY2hhSWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlcnNvbmEuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG57XG4gIG5hbWU6ICdyYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcycsXG4gICAgdXJsOiAnL3JhbmtpbmcnLFxuICB2aWV3czoge1xuICAnY29udGFpbmVyQCc6IHtcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9yYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xuICB9XG59XG59XG5cbiAgXVxuXG4gIC8vIExvb3Agb3ZlciB0aGUgc3RhdGUgZGVmaW5pdGlvbnMgYW5kIHJlZ2lzdGVyIHRoZW1cbiAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XG4gIH0pO1xuXG59KTtcbiIsIi8vIG15QXBwLmNvbnRyb2xsZXIoJ1RlbXBsYXRlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4vLyAgICRzY29wZS50ZW1wbGF0ZXMgPVxuLy8gICAgIFt7IG5hbWU6ICdoZWFkZXInLCB1cmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnfSxcbi8vICAgICAgeyBuYW1lOiAnZm9vdGVyJywgdXJsOiAndGVtcGxhdGVzL2Zvb3Rlci5odG1sJ31dO1xuLy8gfV0pO1xuIiwibXlBcHAuY29udHJvbGxlcignbmF2YmFyJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICRzY29wZS5pc05hdkNvbGxhcHNlZCA9IHRydWU7XG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAkc2NvcGUuaXNDb2xsYXBzZWRIb3Jpem9udGFsID0gZmFsc2U7XG4gICRzY29wZS5zZWFyY2g9e1xuICAgIHF1ZXJ5OiBcIlwiLFxuICAgIG9wdGlvbnM6IFtcIk1vdmllc1wiLFwiUGVvcGxlXCIsXCJBbnl0aGluZ1wiXSxcbiAgICBieTogXCJNb3ZpZXNcIlxuICB9XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cbiAqL1xubXlBcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBCdXNxdWVkYXNTZXJ2aWNlLCBVc3VhcmlvLCBMaXN0U2VydmljZSkge1xuXG4gICAgdmFyIG1vdmllcyA9IHtcbiAgICAgICAgbmFtZTogXCJNb3ZpZXNcIixcbiAgICAgICAgdGl0bGVMYWJlbDogXCJUaXR1bG9cIixcbiAgICAgICAgdXJsOiBcIm1vdmllL1wiLFxuICAgICAgICBhZ3JlZ2FyTGlzdGE6IHRydWVcblxuICAgIH07XG5cbiAgICB2YXIgcGVvcGxlID0ge1xuICAgICAgICBuYW1lOiBcIlBlb3BsZVwiLFxuICAgICAgICB0aXRsZUxhYmVsOiBcIk5vbWJyZVwiLFxuICAgICAgICB1cmw6IFwicGVyc29uL1wiLFxuICAgICAgICBhZ3JlZ2FyRmF2b3JpdG86IHRydWVcbiAgICB9O1xuXG4gICAgdmFyIGFueXRoaW5nID0ge1xuICAgICAgICBuYW1lOiBcIkFueXRoaW5nXCIsXG4gICAgICAgIHRpdGxlTGFiZWw6IFwiVGl0dWxvL05vbWJyZVwiLFxuICAgICAgICB1cmw6IFwiXCIsXG4gICAgICAgIG1vc3RyYXJUaXBvOiB0cnVlXG4gICAgfTtcblxuICAgIHZhciB1bHRpbWFCdXNxdWVkYVBvciA9IG1vdmllcztcblxuICAgICRzY29wZS5zZWFyY2ggPSB7XG4gICAgICAgIHF1ZXJ5OiBcIlwiLFxuICAgICAgICBvcHRpb25zOiBbbW92aWVzLCBwZW9wbGUsIGFueXRoaW5nXSxcbiAgICAgICAgYnk6IG1vdmllc1xuICAgIH07XG5cbiAgICAkc2NvcGUuYnVzY2FyID0gZnVuY3Rpb24gKGJ1c2NhclBvciwgdGV4dG9BQnVzY2FyKSB7XG4gICAgICAgIGlmICghdGV4dG9BQnVzY2FyKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmKGJ1c2NhclBvci5hZ3JlZ2FyTGlzdGEpXG4gICAgICAgICAgICBVc3VhcmlvLmdldExpc3RhcygpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIEJ1c3F1ZWRhc1NlcnZpY2UuYnVzY2FyKGJ1c2NhclBvci51cmwsIHRleHRvQUJ1c2NhcilcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnJlc3VsdHMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkxvIHNlbnRpbW9zLCBubyBzZSBlbmNvbnRyYXJvbiByZXN1bHRhZG9zIHBhcmEgXFxcIlwiICsgdGV4dG9BQnVzY2FyICsgXCJcXFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgICAgICAkc2NvcGUudWx0aW1hQnVzcXVlZGFQb3IgPSBidXNjYXJQb3I7XG4gICAgICAgICAgICB9KVxuICAgIH07XG5cbiAgICAkc2NvcGUuYWdyZWdhckNvbW9GYXZvcml0byA9IGZ1bmN0aW9uIChhY3Rvcikge1xuXG4gICAgICAgIGlmICgoYWN0b3IubWVkaWFfdHlwZSA9PSAncGVyc29uJykgfHwgKCRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9PSBwZW9wbGUpKSB7XG4gICAgICAgICAgICBVc3VhcmlvLm1hcmNhckFjdG9yRmF2b3JpdG8oYWN0b3IuaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQWN0b3IgYWdyZWdhZG8uJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnTG8gcXVlIHNlbGVjY2lvbm8gbm8gZXMgdW4gYWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgJHNjb3BlLmFncmVnYXJBTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGEsIGxpc3RhKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmFncmVnYXJBTGlzdGEocGVsaWN1bGEsbGlzdGEpO1xuICAgIH1cblxuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUpIHtcblxuICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XG4gICAgJHJvb3RTY29wZS5lc0FkbWluID0gZmFsc2U7XG5cbiAgICBpZigkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyl7XG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgIH1lbHNle1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfVxuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdhZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIEFkbWluKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudXNlcnMgPSBbXTtcbiAgICBzZWxmLnVzZXJzU2VsZWMgPSBbXTtcbiAgICBzZWxmLnNlbGVjdGVkVXNlciA9IFwiXCI7XG4gICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgIHNlbGYuc2VzaW9uID0gJHJvb3RTY29wZS5zZXNpb25BY3R1YWw7XG5cblxuICAgIHNlbGYuaW1wb3J0VXNlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEFkbWluLmdldFVzZXJzKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51c2VycyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5pbXBvcnRVc2VycygpO1xuXG4gICAgc2VsZi5jbGVhblNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgICAgIHNlbGYudXNlcnMubWFwKGZ1bmN0aW9uICh1cykge1xuICAgICAgICAgICAgdXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmNvbXBhcmVTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi51c2Vyc1NlbGVjID0gc2VsZi51c2Vycy5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnNlbGVjdGVkXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChzZWxmLnVzZXJzU2VsZWMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJTZWxlY2Npb25lIHPDs2xvIGRvcyB1c3Vhcmlvc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZi51c2Vyc1NlbGVjLnNvbWUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5saXN0cy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5vIGRlIGxvcyB1c3VhcmlvcyBubyBwb3NlZSBsaXN0YXNcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd1c2Vycy5saXN0cycsIHt1c2Vyc1NlbDogc2VsZi51c2Vyc1NlbGVjfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBzZWxmLmRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIG1vbnRoID0gKDEgKyBkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCk7XG4gICAgICAgIG1vbnRoID0gbW9udGgubGVuZ3RoID4gMSA/IG1vbnRoIDogJzAnICsgbW9udGg7XG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xuICAgICAgICBkYXkgPSBkYXkubGVuZ3RoID4gMSA/IGRheSA6ICcwJyArIGRheTtcbiAgICAgICAgcmV0dXJuIGRheSArICcvJyArIG1vbnRoICsgJy8nICsgeWVhcjtcbiAgICB9O1xuXG4gICAgc2VsZi5zaG93VXNlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnVzZXJzO1xuICAgIH07XG5cbiAgICBzZWxmLmVzQWRtaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW47XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0VXNlcm5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIuY3JlZGVuY2lhbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlNpbiBVc2VybmFtZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuY3JlZGVuY2lhbC51c2VybmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfTtcblxuICAgIHNlbGYuZ2V0TGFzdEFjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaW5pY2nDsyBzZXNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5zZWxlY3RlZFVzZXIubGFzdEFjY2Vzcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGF0ZUZvcm1hdChkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBzZWxmLm51bUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5saXN0cy5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLmdldE1vdmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5udW1GYXZBY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycy5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgc2VsZi5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc2VsZi5nZXRJbmZvID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIEFkbWluLmdldERhdGEoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsIGlkLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSB0cnVlO1xuXG4gICAgICAgICAgICB9KVxuICAgIH1cblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDgvMDUvMjAxNy5cbiAqL1xubXlBcHAuY29udHJvbGxlcignYWRtaW5SYW5raW5nQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIFVzdWFyaW8pIHtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmtpbmcoKSB7XG4gICAgICAgIFVzdWFyaW8uZ2V0UmFua2luZ0FjdG9yZXNGYXZvcml0b3MoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJhbmtpbmcgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRSYW5raW5nKCk7XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2ZpY2hhQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykge1xuXG4gICRzY29wZS50cmFlckZpY2hhID0gZnVuY3Rpb24odGlwbykge1xuICAgICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwLycgKyB0aXBvICsgJy8nICsgJHN0YXRlUGFyYW1zLmZpY2hhSWQsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJUb2tlblwiOiAnMTIzNDUnXG4gICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLml0ZW0gPSByZXNwb25zZS5kYXRhO1xuICAgIH0pXG4gIH1cbn0pO1xuIiwibXlBcHAuY29udHJvbGxlcignZmF2b3JpdG9zQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIFVzdWFyaW8pIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zID0gW107XG4gICAgc2VsZi5yZWNNb3ZpZXMgPSB1bmRlZmluZWQ7XG4gICAgc2VsZi52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuc2VhcmNoUmVjTW92aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBVc3VhcmlvLmdldFJlY01vdmllcygkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVjTW92aWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICBzZWxmLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgdGhpcy5hY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBVc3VhcmlvLmFjdG9yZXNGYXZvcml0b3MoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGFjdG9yZXMpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWN0b3Jlc0Zhdm9yaXRvcyA9IGFjdG9yZXMuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2FjYXJEZUZhdm9yaXRvID0gZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zLnNwbGljZSgkc2NvcGUuYWN0b3Jlc0Zhdm9yaXRvcy5pbmRleE9mKGFjdG9yKSwgMSlcbiAgICAgICAgVXN1YXJpby5tYXJjYXJBY3RvckZhdm9yaXRvKGFjdG9yLmlkKVxuICAgIH1cblxuICAgIHRoaXMuYWN0b3Jlc0Zhdm9yaXRvcygpO1xuXG59KTtcblxuIiwibXlBcHAuY29udHJvbGxlcignZmljaGFQZWxpY3VsYUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIHtcblxuICAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9tb3ZpZS8nICsgJHN0YXRlUGFyYW1zLm1vdmllSWQsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIlRva2VuXCI6ICcxMjM0NSdcbiAgICB9XG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAkc2NvcGUubW92aWUgPSByZXNwb25zZS5kYXRhO1xuICB9KVxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMi8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdoZWFkZXJDb250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlLFNlc2lvbikge1xuXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBTZXNpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICB9O1xuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsaXN0Q29tcENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBMaXN0U2VydmljZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnVzZXIxID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzBdXG4gICAgc2VsZi51c2VyMUxpc3QgPSBcIlwiXG4gICAgc2VsZi51c2VyMiA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFsxXVxuICAgIHNlbGYudXNlcjJMaXN0ID0gXCJcIlxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gbnVsbFxuICAgIHNlbGYuc2VzaW9uID0gJHJvb3RTY29wZS5zZXNpb25BY3R1YWw7XG5cbiAgICBzZWxmLmNvbXBhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmludGVyc2VjdGlvbk9mKHNlbGYudXNlcjFMaXN0LCBzZWxmLnVzZXIyTGlzdCwgc2VsZi5zZXNpb24sXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICBzZWxmLmVzQWRtaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbjtcbiAgfTtcbn0pO1xuIiwibXlBcHAuY29udHJvbGxlcignbGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTGlzdFNlcnZpY2UsIFVzdWFyaW8pIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAkc2NvcGUubGlzdGFzID0gW107XG5cbiAgICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24gKG5vbWJyZSkge1xuICAgICAgICBMaXN0U2VydmljZS5jcmVhdGVMaXN0KG5vbWJyZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5tb3ZpZUxpc3QgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMucHVzaChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBhbGVydCgnTGlzdGEgY3JlYWRhIGNvbiBleGl0by4nKVxuICAgICAgICAgICAgICAgICRzY29wZS5ub21icmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuZ2V0TGlzdGFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBVc3VhcmlvLmdldExpc3RhcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdGFzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICRzY29wZS5saXN0YXMubWFwKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgICAgICBsLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIHNlbGYuZ2V0QWN0b3JlcyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBMaXN0U2VydmljZS5nZXRBY3QoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsIGlkLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RvcmVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5jb21wYXJlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYubGlzdGFzU2VsZWMgPSAkc2NvcGUubGlzdGFzLmZpbHRlcihmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Quc2VsZWN0ZWRcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHNlbGYubGlzdGFzU2VsZWMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJTZWxlY2Npb25lIHPDs2xvIGRvcyBsaXN0YXNcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlbGYubGlzdGFzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLm1vdmllcy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5hIGRlIGxhcyBsaXN0YXMgbm8gcG9zZWUgcGVsw61jdWxhc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLmxpc3Rhc1NlbGVjWzBdLCBzZWxmLmxpc3Rhc1NlbGVjWzFdLCAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucXVpdGFyRGVMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYUFRdWl0YXIsbGlzdCkge1xuICAgICAgICAvL2xpc3QucmVtb3ZlKGxpc3QuaW5kZXhPZihwZWxpY3VsYUFRdWl0YXIpKTtcbiAgICAgICAgTGlzdFNlcnZpY2UucXVpdGFyRGVMaXN0YShwZWxpY3VsYUFRdWl0YXIsbGlzdCk7XG4gICAgfTtcblxuXG4gICAgc2VsZi5nZXRMaXN0YXMoKTtcblxufSk7IiwibXlBcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBTZXNpb24pIHtcblxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIjtcblxuICAgICRzY29wZS5hdXRlbnRpY2Fyc2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBTZXNpb24ubG9naW4oe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmR9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRyb290U2NvcGUuc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSB0cnVlO1xuICAgICAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSByZXNwb25zZS5kYXRhLmVzQWRtaW47XG5cbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgfSlcblxuICAgIH07XG5cbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbm15QXBwXG4gIC5jb250cm9sbGVyKCdyZWdpc3RlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIFVzdWFyaW8pIHtcblxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICAgJHNjb3BlLnBhc3N3b3JkMSA9IFwiXCI7XG4gICAgJHNjb3BlLnBhc3N3b3JkMiA9IFwiXCI7XG4gICAgJHNjb3BlLmVtYWlsID0gXCJcIjtcblxuICAgICRzY29wZS5yZWdpc3Rlck5ld1VzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLnBhc3N3b3JkMSA9PT0gJHNjb3BlLnBhc3N3b3JkMikge1xuICAgICAgICBVc3VhcmlvLnJlZ2lzdGVyKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkMX0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgYWxlcnQoXCJVc3VhcmlvIGNyZWFkbyBjb3JyZWN0YW1lbnRlIVwiKTtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiTGFzIHBhc3N3b3JkcyBubyBjb2luY2lkZW5cIiwgXCJQb3IgZmF2b3IgcmV2aXNhbGFzIGFudGVzIGRlIGVudmlhciBlbCBmb3JtdWxhcmlvXCIsIFwiZXJyb3JcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yZXR1cm5Ub01haW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29udHJhc2VuaWFzRGlzdGludGFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRzY29wZS5wYXNzd29yZDEgIT09ICRzY29wZS5wYXNzd29yZDI7XG4gICAgfVxuXG4gIH0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBheWUgb24gMDYvMDUvMTcuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubXlBcHAuc2VydmljZSgnQWRtaW4nLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5nZXRVc2VycyA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FkbWluL3VzZXIvbGlzdCcsIHtcbiAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgfSkudGhlbihjYWxsYmFjayk7XG4gIH1cblxuICBzZWxmLmdldERhdGEgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci8nICsgaWQsIHtcbiAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgfSkudGhlbihjYWxsYmFjayk7XG4gIH1cblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cbiAqL1xubXlBcHAuc2VydmljZSgnQnVzcXVlZGFzU2VydmljZScsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuYnVzY2FyID0gZnVuY3Rpb24odXJsLCB0ZXh0b0RlQnVzcXVlZGEpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvc2VhcmNoLycgKyB1cmwgKyB0ZXh0b0RlQnVzcXVlZGEuc3BsaXQoJyAnKS5qb2luKCctJyksIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJUb2tlblwiOiAnMTIzNDUnXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwibXlBcHAuc2VydmljZSgnTGlzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuaW50ZXJzZWN0aW9uT2YgPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsIHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FkbWluL3VzZXIvJyArIGxpc3RhMS5pZCArICcvJyArIGxpc3RhMi5pZCArICcvJywge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0QWN0ID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgbGlzdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL3JhbmtpbmcvJyArIGxpc3RhLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9O1xuXG5cblxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gKGxpc3RhMSwgbGlzdGEyLCBzZXNpb25BY3R1YWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9saXN0LycgKyBsaXN0YTEuaWQgKyAnLycgKyBsaXN0YTIuaWQsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBzZWxmLmNyZWF0ZUxpc3QgPSBmdW5jdGlvbiAobm9tYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvbGlzdC8nLCBub21icmUsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgc2VsZi5hZ3JlZ2FyQUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhLCBsaXN0YSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLCBwZWxpY3VsYSwge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2VsZi5xdWl0YXJEZUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhLCBsaXN0YSkge1xuICAgICAgICAvLyByZXR1cm4gJGh0dHAoe1xuICAgICAgICAvLyAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgLy8gICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9saXN0LycgKyBsaXN0YS5pZCArICcvJyxcbiAgICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgICAgLy8gICAgICAgICBtb3ZpZTogcGVsaWN1bGFcbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC8vICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9saXN0LycgKyBsaXN0YS5pZCArICcvJyx7XG4gICAgICAgICAgICBkYXRhOiB7bW92aWU6IHBlbGljdWxhfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSk7XG5cblxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuc2VydmljZSgnU2VzaW9uJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9naW4nLCBjcmVkZW50aWFscyk7XG4gICAgfTtcblxuICAgIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9nb3V0Jyx1bmRlZmluZWQse2hlYWRlcnM6IHtcInRva2VuXCI6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufX0pXG4gICAgfTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwMS8wNS8xNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdVc3VhcmlvJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci8nLCBjcmVkZW50aWFscyk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0UmVjTW92aWVzID0gZnVuY3Rpb24gKHNlc2lvbixjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9mYXZvcml0ZWFjdG9yL21vdmllcycsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb24uaWRTZXNpb259XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHNlbGYuYWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9mYXZvcml0ZWFjdG9yLycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzZWxmLm1hcmNhckFjdG9yRmF2b3JpdG8gPSBmdW5jdGlvbiAoaWRBY3Rvcikge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9mYXZvcml0ZWFjdG9yLycgKyBpZEFjdG9yICsgJy8nLCB1bmRlZmluZWQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzZWxmLmdldExpc3RhcyA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9tb3ZpZUxpc3RzJywge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcbiAgICBzZWxmLmdldFJhbmtpbmdBY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9mYXZvcml0ZWFjdG9yL3JhbmtpbmcnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG5cblxufSlcbjtcbiJdfQ==
