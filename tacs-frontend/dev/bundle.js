var myApp = angular.module('myApp', ['ui.router','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

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
            url: '/movie/:movieId',
            templateUrl: 'templates/fichas/pelicula.html'
        }

    ]

    // Loop over the state definitions and register them
    states.forEach(function (state) {
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
myApp.controller('HomeController', function ($scope, BusquedasService) {

    $scope.buscar = function (textoABuscar) {
        if (!textoABuscar)
            return;

        BusquedasService.buscarPelicula(textoABuscar)
            .then(function (response) {
                if (response.data.results <= 0) {
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
                    $scope.resultados = [];
                }
                else
                    $scope.resultados = response.data.results;
            })
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
myApp.controller('buscarMoviesController', function($scope,$http) {

  $scope.movies = [
    {
      title: 'bla',
      id:'1',
      overview:'buena'
    },
    {
      title: 'ble',
      id:'2',
      overview:'mala'
    }
  ]


    var req = {
     method: 'GET',
     url: 'localhost:8080/search/movie/house',
     headers: {
       'Token': 1,
       Token: 1,
       'Token': '1',
       Token: '1'
     }

    }

      $http(req).then(function successCallback(response) {
      $scope.movies = response
    }, function errorCallback(response) {
      $scope.movies = response
    });

});

myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

  $scope.actoresFavoritos = [];

  this.actoresFavoritos = function(){
    Usuario.actoresFavoritos().then(function (actores){
      $scope.actoresFavoritos = actores;
    });
  };
  
  this.actoresFavoritos();
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

    self.compare = function () {
        ListService.intersectionOf(self.user1List, self.user2List, sesionActual,
            function (response) {
                self.intersection = response.data;
            })
    }

  self.esAdmin = function () {
    return $rootScope.esAdmin();
  };
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
myApp.service('BusquedasService', function ($http) {

    var self = this;

    self.buscarPelicula = function (textoDeBusqueda) {
        return $http.get('http://localhost:8080/search/' + textoDeBusqueda, {
            headers: {
                "Token": '12345'
            }
        });
    };

});
myApp.service('ListService', function ($http) {

    var self = this;

    self.intersectionOf= function (lista1, lista2,sesionActual,callback) {
        return $http.get('http://localhost:8080/admin/user/' + lista1.id + '/' + lista2.id+'/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    }

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

  self.actoresFavoritos = function (credentials, callback) {
            return $http.get('http://localhost:8080/user/favoriteactor/',
    {
      headers: {
        'token'
      :
        $rootScope.sesionActual.idSesion
      }
    }
    );
}


})
;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2J1c2Nhck1vdmllc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mYXZvcml0b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvaGVhZGVyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xpc3RDb21wQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL0FkbWluLmpzIiwic2VydmljZXMvQnVzcXVlZGFzU2VydmljZS5qcyIsInNlcnZpY2VzL0xpc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvU2VzaW9uLmpzIiwic2VydmljZXMvVXN1YXJpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInLCduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnXSk7XG4iLCJteUFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgLy8gQW4gYXJyYXkgb2Ygc3RhdGUgZGVmaW5pdGlvbnNcbiAgICB2YXIgc3RhdGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaG9tZScsXG4gICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2hvbWUuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsb2dpbicsXG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcbiAgICAgICAgICAgIHVybDogJy9yZWdpc3RlcicsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAncmVnaXN0ZXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlZ2lzdGVyLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYWN0b3Jlc0Zhdm9yaXRvcycsXG4gICAgICAgICAgICB1cmw6ICcvYWN0b3Jlc0Zhdm9yaXRvcycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsaXN0YXMnLFxuICAgICAgICAgICAgdXJsOiAnL2xpc3RhcycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9saXN0YXMvbGlzdC5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcbiAgICAgICAgICAgIHVybDogJy9idXNjYXIvcGVsaWN1bGEvJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdidXNjYXJNb3ZpZXNDb250cm9sbGVyJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2J1c2Nhci9tb3ZpZXMuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3VzZXJzJyxcbiAgICAgICAgICAgIHVybDogJy91c2VycycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi91c2Vycy5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAndXNlcnMubGlzdHMnLFxuICAgICAgICAgICAgdXJsOiAnL2xpc3RzJyxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHVzZXJzU2VsOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWRtaW4vbGlzdENvbXBhcmlzb24uaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2ZpY2hhUGVsaWN1bGEnLFxuICAgICAgICAgICAgdXJsOiAnL21vdmllLzptb3ZpZUlkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2ZpY2hhcy9wZWxpY3VsYS5odG1sJ1xuICAgICAgICB9XG5cbiAgICBdXG5cbiAgICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXG4gICAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlKTtcbiAgICB9KTtcblxufSk7XG4iLCIvLyBteUFwcC5jb250cm9sbGVyKCdUZW1wbGF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cbi8vICAgICBbeyBuYW1lOiAnaGVhZGVyJywgdXJsOiAndGVtcGxhdGVzL2hlYWRlci5odG1sJ30sXG4vLyAgICAgIHsgbmFtZTogJ2Zvb3RlcicsIHVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCd9XTtcbi8vIH1dKTtcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ25hdmJhcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkSG9yaXpvbnRhbCA9IGZhbHNlO1xuICAkc2NvcGUuc2VhcmNoPXtcbiAgICBxdWVyeTogXCJcIixcbiAgICBvcHRpb25zOiBbXCJNb3ZpZXNcIixcIlBlb3BsZVwiLFwiQW55dGhpbmdcIl0sXG4gICAgYnk6IFwiTW92aWVzXCJcbiAgfVxuXG59KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXG4gKi9cbm15QXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQnVzcXVlZGFzU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmJ1c2NhciA9IGZ1bmN0aW9uICh0ZXh0b0FCdXNjYXIpIHtcbiAgICAgICAgaWYgKCF0ZXh0b0FCdXNjYXIpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgQnVzcXVlZGFzU2VydmljZS5idXNjYXJQZWxpY3VsYSh0ZXh0b0FCdXNjYXIpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJMbyBzZW50aW1vcywgbm8gc2UgZW5jb250cmFyb24gcmVzdWx0YWRvcyBwYXJhIFxcXCJcIiArIHRleHRvQUJ1c2NhciArIFwiXFxcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlKSB7XG5cbiAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuZXNBZG1pbiA9IGZhbHNlO1xuXG4gICAgaWYoJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8pe1xuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH1cblxufSk7IiwibXlBcHAuY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBBZG1pbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnVzZXJzID0gW107XG4gICAgc2VsZi51c2Vyc1NlbGVjID0gW107XG4gICAgc2VsZi5zZWxlY3RlZFVzZXIgPSBcIlwiO1xuICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcblxuXG4gICAgc2VsZi5pbXBvcnRVc2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQWRtaW4uZ2V0VXNlcnMoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXJzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmltcG9ydFVzZXJzKCk7XG5cbiAgICBzZWxmLmNsZWFuU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICAgICAgc2VsZi51c2Vycy5tYXAoZnVuY3Rpb24gKHVzKSB7XG4gICAgICAgICAgICB1cy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuY29tcGFyZVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnVzZXJzU2VsZWMgPSBzZWxmLnVzZXJzLmZpbHRlcihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc2VsZWN0ZWRcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHNlbGYudXNlcnNTZWxlYy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIHVzdWFyaW9zXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxmLnVzZXJzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmxpc3RzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJVbm8gZGUgbG9zIHVzdWFyaW9zIG5vIHBvc2VlIGxpc3Rhc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3VzZXJzLmxpc3RzJywge3VzZXJzU2VsOiBzZWxmLnVzZXJzU2VsZWN9KVxuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIHNlbGYuZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB2YXIgbW9udGggPSAoMSArIGRhdGUuZ2V0TW9udGgoKSkudG9TdHJpbmcoKTtcbiAgICAgICAgbW9udGggPSBtb250aC5sZW5ndGggPiAxID8gbW9udGggOiAnMCcgKyBtb250aDtcbiAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCk7XG4gICAgICAgIGRheSA9IGRheS5sZW5ndGggPiAxID8gZGF5IDogJzAnICsgZGF5O1xuICAgICAgICByZXR1cm4gZGF5ICsgJy8nICsgbW9udGggKyAnLycgKyB5ZWFyO1xuICAgIH07XG5cbiAgICBzZWxmLnNob3dVc2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYudXNlcnM7XG4gICAgfTtcblxuICAgIHNlbGYuZXNBZG1pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbjtcbiAgICB9O1xuXG4gICAgc2VsZi5nZXRVc2VybmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5jcmVkZW5jaWFsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU2luIFVzZXJuYW1lXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5jcmVkZW5jaWFsLnVzZXJuYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9O1xuXG4gICAgc2VsZi5nZXRMYXN0QWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxhc3RBY2Nlc3MgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBpbmljacOzIHNlc2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kYXRlRm9ybWF0KGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHNlbGYubnVtTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYuZ2V0TW92aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIubGlzdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLm51bUZhdkFjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmZhdm9yaXRlQWN0b3JzLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICBzZWxmLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzZWxmLmdldEluZm8gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgQWRtaW4uZ2V0RGF0YSgkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCwgaWQsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IHRydWU7XG5cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdidXNjYXJNb3ZpZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCRodHRwKSB7XG5cbiAgJHNjb3BlLm1vdmllcyA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsYScsXG4gICAgICBpZDonMScsXG4gICAgICBvdmVydmlldzonYnVlbmEnXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsZScsXG4gICAgICBpZDonMicsXG4gICAgICBvdmVydmlldzonbWFsYSdcbiAgICB9XG4gIF1cblxuXG4gICAgdmFyIHJlcSA9IHtcbiAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAvc2VhcmNoL21vdmllL2hvdXNlJyxcbiAgICAgaGVhZGVyczoge1xuICAgICAgICdUb2tlbic6IDEsXG4gICAgICAgVG9rZW46IDEsXG4gICAgICAgJ1Rva2VuJzogJzEnLFxuICAgICAgIFRva2VuOiAnMSdcbiAgICAgfVxuXG4gICAgfVxuXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9KTtcblxufSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCdmYXZvcml0b3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xuXG4gICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zID0gW107XG5cbiAgdGhpcy5hY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24oKXtcbiAgICBVc3VhcmlvLmFjdG9yZXNGYXZvcml0b3MoKS50aGVuKGZ1bmN0aW9uIChhY3RvcmVzKXtcbiAgICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zID0gYWN0b3JlcztcbiAgICB9KTtcbiAgfTtcbiAgXG4gIHRoaXMuYWN0b3Jlc0Zhdm9yaXRvcygpO1xufSk7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAyLzA1LzIwMTcuXG4gKi9cbm15QXBwLmNvbnRyb2xsZXIoJ2hlYWRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XG5cbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFNlc2lvbi5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2VzaW9uQWN0dWFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSlcblxuICAgIH07XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2xpc3RDb21wQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsJHN0YXRlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudXNlcjEgPSAkc3RhdGVQYXJhbXMudXNlcnNTZWxbMF1cbiAgICBzZWxmLnVzZXIxTGlzdCA9IFwiXCJcbiAgICBzZWxmLnVzZXIyID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzFdXG4gICAgc2VsZi51c2VyMkxpc3QgPSBcIlwiXG4gICAgc2VsZi5pbnRlcnNlY3Rpb24gPSBudWxsXG5cbiAgICBzZWxmLmNvbXBhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmludGVyc2VjdGlvbk9mKHNlbGYudXNlcjFMaXN0LCBzZWxmLnVzZXIyTGlzdCwgc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW4oKTtcbiAgfTtcbn0pO1xuIiwibXlBcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBTZXNpb24pIHtcblxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIjtcblxuICAgICRzY29wZS5hdXRlbnRpY2Fyc2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBTZXNpb24ubG9naW4oe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmR9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRyb290U2NvcGUuc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSB0cnVlO1xuICAgICAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSByZXNwb25zZS5kYXRhLmVzQWRtaW47XG5cbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgfSlcblxuICAgIH07XG5cbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbm15QXBwXG4gIC5jb250cm9sbGVyKCdyZWdpc3RlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIFVzdWFyaW8pIHtcblxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICAgJHNjb3BlLnBhc3N3b3JkMSA9IFwiXCI7XG4gICAgJHNjb3BlLnBhc3N3b3JkMiA9IFwiXCI7XG4gICAgJHNjb3BlLmVtYWlsID0gXCJcIjtcblxuICAgICRzY29wZS5yZWdpc3Rlck5ld1VzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLnBhc3N3b3JkMSA9PT0gJHNjb3BlLnBhc3N3b3JkMikge1xuICAgICAgICBVc3VhcmlvLnJlZ2lzdGVyKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkMX0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgYWxlcnQoXCJVc3VhcmlvIGNyZWFkbyBjb3JyZWN0YW1lbnRlIVwiKTtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiTGFzIHBhc3N3b3JkcyBubyBjb2luY2lkZW5cIiwgXCJQb3IgZmF2b3IgcmV2aXNhbGFzIGFudGVzIGRlIGVudmlhciBlbCBmb3JtdWxhcmlvXCIsIFwiZXJyb3JcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yZXR1cm5Ub01haW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29udHJhc2VuaWFzRGlzdGludGFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRzY29wZS5wYXNzd29yZDEgIT09ICRzY29wZS5wYXNzd29yZDI7XG4gICAgfVxuXG4gIH0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBheWUgb24gMDYvMDUvMTcuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubXlBcHAuc2VydmljZSgnQWRtaW4nLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5nZXRVc2VycyA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FkbWluL3VzZXIvbGlzdCcsIHtcbiAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgfSkudGhlbihjYWxsYmFjayk7XG4gIH1cblxuICBzZWxmLmdldERhdGEgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci8nICsgaWQsIHtcbiAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgfSkudGhlbihjYWxsYmFjayk7XG4gIH1cblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cbiAqL1xubXlBcHAuc2VydmljZSgnQnVzcXVlZGFzU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5idXNjYXJQZWxpY3VsYSA9IGZ1bmN0aW9uICh0ZXh0b0RlQnVzcXVlZGEpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3NlYXJjaC8nICsgdGV4dG9EZUJ1c3F1ZWRhLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJUb2tlblwiOiAnMTIzNDUnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pOyIsIm15QXBwLnNlcnZpY2UoJ0xpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmludGVyc2VjdGlvbk9mPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsc2VzaW9uQWN0dWFsLGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hZG1pbi91c2VyLycgKyBsaXN0YTEuaWQgKyAnLycgKyBsaXN0YTIuaWQrJy8nLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuc2VydmljZSgnU2VzaW9uJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9naW4nLCBjcmVkZW50aWFscyk7XG4gICAgfTtcblxuICAgIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9nb3V0Jyx1bmRlZmluZWQse2hlYWRlcnM6IHtcInRva2VuXCI6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufX0pXG4gICAgfTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwMS8wNS8xNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdVc3VhcmlvJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYucmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvJywgY3JlZGVudGlhbHMpO1xuICB9O1xuXG4gIHNlbGYuYWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uIChjcmVkZW50aWFscywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyL2Zhdm9yaXRlYWN0b3IvJyxcbiAgICB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICd0b2tlbidcbiAgICAgIDpcbiAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgIH1cbiAgICB9XG4gICAgKTtcbn1cblxuXG59KVxuOyJdfQ==
