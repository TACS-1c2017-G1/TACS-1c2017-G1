var myApp = angular.module('myApp', ['ui.router','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

myApp.config(function($stateProvider) {
  // An array of state definitions
  var states = [{

      name: 'layouts',
      url: '',
      abstract: true,
      views: {
        'header': {
          templateUrl: 'templates/header.html'
        },
        'footer': {
          templateUrl: 'templates/footer.html'
        }
      }
    },

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

//favoritosController.js
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
});

myApp.controller('loginController', function($rootScope,$scope,$state,Sesion) {

  $scope.userName = "";
  $scope.password = "";

  $scope.autenticarse = function () {

    Sesion.login({username: $scope.userName, password: $scope.password})
      .then(function(response) {
          sesionActual = response.data;
          $rootScope.usuarioLogueado = true;
          $state.go('home');
      })
      .catch(function(error) {
          alert(error.data.message);
      })

  };

});


'use strict';

myApp.controller('MainController', function($rootScope,$scope,$state) {

    $rootScope.usuarioLogueado = false;

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
myApp.controller('userController', function ($rootScope, $scope, $state, Usuario) {
    var self = this;
    self.users = [];
    self.usersSelec = [];
    self.selectedUser = "";
    self.visibleData = false;


    self.importUsers = function () {
        Usuario.getUsers(sesionActual,
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
        if (self.usersSelec.length != 2){
            self.errorMessage = "Seleccione sólo dos usuarios"
        }
        else if(self.usersSelec.some(function (e) {
                return e.lists.length === 0
            })) {
            self.errorMessage = "Uno de los usuarios no posee listas"
        }
        else {
            self.visibleData = false;
            $state.go('users.lists', {usersSel:self.usersSelec})
        }

    }


    self.dateFormat = function (date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '/' + month + '/' + year;
    }

    self.showUsers = function () {
        return self.users;
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


    }

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

    }

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
        Usuario.getData(sesionActual, id,
            function (response) {
                self.selectedUser = response.data;
                self.visibleData = true;

            })
    }

});
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
        return $http.get('http://localhost:8080/user/' + lista1.id + '/' + lista2.id+'/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    }

});
'use strict';

myApp.service('Sesion', function ($http) {

  var self = this;

  self.login = function (credentials) {
    return $http.post('http://localhost:8080/authentication/login',credentials);
  };

});
/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http) {

    var self = this;

    self.register = function (credentials) {
        return $http.post('http://localhost:8080/user/', credentials);
    };

    self.getUsers = function (sesionActual, callback) {
        return $http.get('http://localhost:8080/user/list', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    }

    self.getData = function (sesionActual, id, callback) {
        return $http.get('http://localhost:8080/user/' + id, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    }

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbnRyb2xsZXJzL2J1c2Nhck1vdmllc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mYXZvcml0b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9saXN0Q29tcENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3VzZXJDb250cm9sbGVyLmpzIiwiY29tbW9ucy9ib290c3RyYXAuanMiLCJzZXJ2aWNlcy9CdXNxdWVkYXNTZXJ2aWNlLmpzIiwic2VydmljZXMvTGlzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXNpb24uanMiLCJzZXJ2aWNlcy9Vc3VhcmlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInLCduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnXSk7XHJcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xyXG4gIC8vIEFuIGFycmF5IG9mIHN0YXRlIGRlZmluaXRpb25zXHJcbiAgdmFyIHN0YXRlcyA9IFt7XHJcblxyXG4gICAgICBuYW1lOiAnbGF5b3V0cycsXHJcbiAgICAgIHVybDogJycsXHJcbiAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdoZWFkZXInOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgICdmb290ZXInOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaG9tZScsXHJcbiAgICAgIHVybDogJy8nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgICB1cmw6ICcvYWN0b3Jlc0Zhdm9yaXRvcycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xpc3RhcycsXHJcbiAgICAgIHVybDogJy9saXN0YXMnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcclxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxyXG4gICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ3VzZXJzJyxcclxuICAgICAgdXJsOiAnL3VzZXJzJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3VzZXJzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ3VzZXJzLmxpc3RzJyxcclxuICAgICAgdXJsOiAnL2xpc3RzJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgdXNlcnNTZWw6IG51bGxcclxuICAgICAgfSxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL2xpc3RDb21wYXJpc29uLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIF1cclxuXHJcbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxyXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XHJcbiAgfSk7XHJcblxyXG59KTtcclxuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cclxuLy8gICAgIFt7IG5hbWU6ICdoZWFkZXInLCB1cmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnfSxcclxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XHJcbi8vIH1dKTtcclxuIiwibXlBcHAuY29udHJvbGxlcignYnVzY2FyTW92aWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwkaHR0cCkge1xyXG5cclxuICAkc2NvcGUubW92aWVzID0gW1xyXG4gICAge1xyXG4gICAgICB0aXRsZTogJ2JsYScsXHJcbiAgICAgIGlkOicxJyxcclxuICAgICAgb3ZlcnZpZXc6J2J1ZW5hJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGl0bGU6ICdibGUnLFxyXG4gICAgICBpZDonMicsXHJcbiAgICAgIG92ZXJ2aWV3OidtYWxhJ1xyXG4gICAgfVxyXG4gIF1cclxuXHJcblxyXG4gICAgdmFyIHJlcSA9IHtcclxuICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgIHVybDogJ2xvY2FsaG9zdDo4MDgwL3NlYXJjaC9tb3ZpZS9ob3VzZScsXHJcbiAgICAgaGVhZGVyczoge1xyXG4gICAgICAgJ1Rva2VuJzogMSxcclxuICAgICAgIFRva2VuOiAxLFxyXG4gICAgICAgJ1Rva2VuJzogJzEnLFxyXG4gICAgICAgVG9rZW46ICcxJ1xyXG4gICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxyXG4gICAgfSwgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsIi8vZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cclxuICovXHJcbm15QXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQnVzcXVlZGFzU2VydmljZSkge1xyXG5cclxuICAgICRzY29wZS5idXNjYXIgPSBmdW5jdGlvbiAodGV4dG9BQnVzY2FyKSB7XHJcbiAgICAgICAgaWYgKCF0ZXh0b0FCdXNjYXIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgQnVzcXVlZGFzU2VydmljZS5idXNjYXJQZWxpY3VsYSh0ZXh0b0FCdXNjYXIpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEucmVzdWx0cyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJMbyBzZW50aW1vcywgbm8gc2UgZW5jb250cmFyb24gcmVzdWx0YWRvcyBwYXJhIFxcXCJcIiArIHRleHRvQUJ1c2NhciArIFwiXFxcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gcmVzcG9uc2UuZGF0YS5yZXN1bHRzO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxufSk7IiwibXlBcHAuY29udHJvbGxlcignbGlzdENvbXBDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwkc3RhdGUsICRzdGF0ZVBhcmFtcywgTGlzdFNlcnZpY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudXNlcjEgPSAkc3RhdGVQYXJhbXMudXNlcnNTZWxbMF1cclxuICAgIHNlbGYudXNlcjFMaXN0ID0gXCJcIlxyXG4gICAgc2VsZi51c2VyMiA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFsxXVxyXG4gICAgc2VsZi51c2VyMkxpc3QgPSBcIlwiXHJcbiAgICBzZWxmLmludGVyc2VjdGlvbiA9IG51bGxcclxuXHJcbiAgICBzZWxmLmNvbXBhcmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UuaW50ZXJzZWN0aW9uT2Yoc2VsZi51c2VyMUxpc3QsIHNlbGYudXNlcjJMaXN0LCBzZXNpb25BY3R1YWwsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG59KTtcclxuIiwibXlBcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlLFNlc2lvbikge1xyXG5cclxuICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xyXG4gICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XHJcblxyXG4gICRzY29wZS5hdXRlbnRpY2Fyc2UgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgU2VzaW9uLmxvZ2luKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIHNlc2lvbkFjdHVhbCA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IHRydWU7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICB9KVxyXG5cclxuICB9O1xyXG5cclxufSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSkge1xyXG5cclxuICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XHJcblxyXG4gICAgaWYoJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8pe1xyXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgfVxyXG5cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHBcclxuICAuY29udHJvbGxlcigncmVnaXN0ZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBVc3VhcmlvKSB7XHJcblxyXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcclxuICAgICRzY29wZS5wYXNzd29yZDEgPSBcIlwiO1xyXG4gICAgJHNjb3BlLnBhc3N3b3JkMiA9IFwiXCI7XHJcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiO1xyXG5cclxuICAgICRzY29wZS5yZWdpc3Rlck5ld1VzZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkc2NvcGUucGFzc3dvcmQxID09PSAkc2NvcGUucGFzc3dvcmQyKSB7XHJcbiAgICAgICAgVXN1YXJpby5yZWdpc3Rlcih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZDF9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgYWxlcnQoXCJVc3VhcmlvIGNyZWFkbyBjb3JyZWN0YW1lbnRlIVwiKTtcclxuICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoXCJMYXMgcGFzc3dvcmRzIG5vIGNvaW5jaWRlblwiLCBcIlBvciBmYXZvciByZXZpc2FsYXMgYW50ZXMgZGUgZW52aWFyIGVsIGZvcm11bGFyaW9cIiwgXCJlcnJvclwiKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUucmV0dXJuVG9NYWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY29udHJhc2VuaWFzRGlzdGludGFzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJHNjb3BlLnBhc3N3b3JkMSAhPT0gJHNjb3BlLnBhc3N3b3JkMjtcclxuICAgIH1cclxuXHJcbiAgfSk7IiwibXlBcHAuY29udHJvbGxlcigndXNlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIFVzdWFyaW8pIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudXNlcnMgPSBbXTtcclxuICAgIHNlbGYudXNlcnNTZWxlYyA9IFtdO1xyXG4gICAgc2VsZi5zZWxlY3RlZFVzZXIgPSBcIlwiO1xyXG4gICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICBzZWxmLmltcG9ydFVzZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFVzdWFyaW8uZ2V0VXNlcnMoc2VzaW9uQWN0dWFsLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudXNlcnMgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5pbXBvcnRVc2VycygpO1xyXG5cclxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XHJcbiAgICAgICAgc2VsZi51c2Vycy5tYXAoZnVuY3Rpb24gKHVzKSB7XHJcbiAgICAgICAgICAgIHVzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmNvbXBhcmVTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLnVzZXJzU2VsZWMgPSBzZWxmLnVzZXJzLmZpbHRlcihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5zZWxlY3RlZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHNlbGYudXNlcnNTZWxlYy5sZW5ndGggIT0gMil7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJTZWxlY2Npb25lIHPDs2xvIGRvcyB1c3Vhcmlvc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2VsZi51c2Vyc1NlbGVjLnNvbWUoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlLmxpc3RzLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5vIGRlIGxvcyB1c3VhcmlvcyBubyBwb3NlZSBsaXN0YXNcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3VzZXJzLmxpc3RzJywge3VzZXJzU2VsOnNlbGYudXNlcnNTZWxlY30pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgc2VsZi5kYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSAoMSArIGRhdGUuZ2V0TW9udGgoKSkudG9TdHJpbmcoKTtcclxuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICcwJyArIG1vbnRoO1xyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGRheSA9IGRheS5sZW5ndGggPiAxID8gZGF5IDogJzAnICsgZGF5O1xyXG4gICAgICAgIHJldHVybiBkYXkgKyAnLycgKyBtb250aCArICcvJyArIHllYXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5zaG93VXNlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYudXNlcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZ2V0VXNlcm5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmNyZWRlbmNpYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlNpbiBVc2VybmFtZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuY3JlZGVuY2lhbC51c2VybmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldExhc3RBY2Nlc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxhc3RBY2Nlc3MgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGluaWNpw7Mgc2VzacOzblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYuc2VsZWN0ZWRVc2VyLmxhc3RBY2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGF0ZUZvcm1hdChkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYubnVtTGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzLmxlbmd0aFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldE1vdmllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYubnVtRmF2QWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldEluZm8gPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICBVc3VhcmlvLmdldERhdGEoc2VzaW9uQWN0dWFsLCBpZCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcclxuICAkc2NvcGUuc2VhcmNoPXtcclxuICAgIHF1ZXJ5OiBcIlwiLFxyXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxyXG4gICAgYnk6IFwiTW92aWVzXCJcclxuICB9XHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxyXG4gKi9cclxubXlBcHAuc2VydmljZSgnQnVzcXVlZGFzU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCkge1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLmJ1c2NhclBlbGljdWxhID0gZnVuY3Rpb24gKHRleHRvRGVCdXNxdWVkYSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zZWFyY2gvJyArIHRleHRvRGVCdXNxdWVkYSwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIlRva2VuXCI6ICcxMjM0NSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn0pOyIsIm15QXBwLnNlcnZpY2UoJ0xpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuaW50ZXJzZWN0aW9uT2Y9IGZ1bmN0aW9uIChsaXN0YTEsIGxpc3RhMixzZXNpb25BY3R1YWwsY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkKycvJywge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuc2VydmljZSgnU2VzaW9uJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgc2VsZi5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dpbicsY3JlZGVudGlhbHMpO1xyXG4gIH07XHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBheWUgb24gMDEvMDUvMTcuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcC5zZXJ2aWNlKCdVc3VhcmlvJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYucmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvJywgY3JlZGVudGlhbHMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmdldFVzZXJzID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci9saXN0Jywge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuZ2V0RGF0YSA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyLycgKyBpZCwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxufSk7Il19
