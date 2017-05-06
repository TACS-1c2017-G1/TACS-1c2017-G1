var myApp = angular.module('myApp', ['ui.router','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

myApp.config(function ($stateProvider) {
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
          $rootScope.sesionActual = response.data;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvYnVzY2FyTW92aWVzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9oZWFkZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9saXN0Q29tcENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3VzZXJDb250cm9sbGVyLmpzIiwic2VydmljZXMvQnVzcXVlZGFzU2VydmljZS5qcyIsInNlcnZpY2VzL0xpc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvU2VzaW9uLmpzIiwic2VydmljZXMvVXN1YXJpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbXlBcHAgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3VpLnJvdXRlcicsJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCddKTtcclxuIiwibXlBcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgLy8gQW4gYXJyYXkgb2Ygc3RhdGUgZGVmaW5pdGlvbnNcclxuICAgIHZhciBzdGF0ZXMgPSBbe1xyXG5cclxuICAgICAgICBuYW1lOiAnbGF5b3V0cycsXHJcbiAgICAgICAgdXJsOiAnJyxcclxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAnaGVhZGVyJzoge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdmb290ZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2hvbWUnLFxyXG4gICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2hvbWUuaHRtbCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnbG9naW4nLFxyXG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luLmh0bWwnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdhY3RvcmVzRmF2b3JpdG9zJyxcclxuICAgICAgICAgICAgdXJsOiAnL2FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnbGlzdGFzJyxcclxuICAgICAgICAgICAgdXJsOiAnL2xpc3RhcycsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9saXN0YXMvbGlzdC5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcclxuICAgICAgICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICd1c2VycycsXHJcbiAgICAgICAgICAgIHVybDogJy91c2VycycsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi91c2Vycy5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAndXNlcnMubGlzdHMnLFxyXG4gICAgICAgICAgICB1cmw6ICcvbGlzdHMnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIHVzZXJzU2VsOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9saXN0Q29tcGFyaXNvbi5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIF1cclxuXHJcbiAgICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXHJcbiAgICBzdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCIvLyBteUFwcC5jb250cm9sbGVyKCdUZW1wbGF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xyXG4vLyAgICRzY29wZS50ZW1wbGF0ZXMgPVxyXG4vLyAgICAgW3sgbmFtZTogJ2hlYWRlcicsIHVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCd9LFxyXG4vLyAgICAgIHsgbmFtZTogJ2Zvb3RlcicsIHVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCd9XTtcclxuLy8gfV0pO1xyXG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcclxuICAkc2NvcGUuc2VhcmNoPXtcclxuICAgIHF1ZXJ5OiBcIlwiLFxyXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxyXG4gICAgYnk6IFwiTW92aWVzXCJcclxuICB9XHJcblxyXG59KTtcclxuIiwibXlBcHAuY29udHJvbGxlcignYnVzY2FyTW92aWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwkaHR0cCkge1xyXG5cclxuICAkc2NvcGUubW92aWVzID0gW1xyXG4gICAge1xyXG4gICAgICB0aXRsZTogJ2JsYScsXHJcbiAgICAgIGlkOicxJyxcclxuICAgICAgb3ZlcnZpZXc6J2J1ZW5hJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGl0bGU6ICdibGUnLFxyXG4gICAgICBpZDonMicsXHJcbiAgICAgIG92ZXJ2aWV3OidtYWxhJ1xyXG4gICAgfVxyXG4gIF1cclxuXHJcblxyXG4gICAgdmFyIHJlcSA9IHtcclxuICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgIHVybDogJ2xvY2FsaG9zdDo4MDgwL3NlYXJjaC9tb3ZpZS9ob3VzZScsXHJcbiAgICAgaGVhZGVyczoge1xyXG4gICAgICAgJ1Rva2VuJzogMSxcclxuICAgICAgIFRva2VuOiAxLFxyXG4gICAgICAgJ1Rva2VuJzogJzEnLFxyXG4gICAgICAgVG9rZW46ICcxJ1xyXG4gICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxyXG4gICAgfSwgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsIi8vZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDIvMDUvMjAxNy5cclxuICovXHJcbm15QXBwLmNvbnRyb2xsZXIoJ2hlYWRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XHJcblxyXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgU2VzaW9uLmxvZ291dCgpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICB9O1xyXG5cclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxyXG4gKi9cclxubXlBcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBCdXNxdWVkYXNTZXJ2aWNlKSB7XHJcblxyXG4gICAgJHNjb3BlLmJ1c2NhciA9IGZ1bmN0aW9uICh0ZXh0b0FCdXNjYXIpIHtcclxuICAgICAgICBpZiAoIXRleHRvQUJ1c2NhcilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBCdXNxdWVkYXNTZXJ2aWNlLmJ1c2NhclBlbGljdWxhKHRleHRvQUJ1c2NhcilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkxvIHNlbnRpbW9zLCBubyBzZSBlbmNvbnRyYXJvbiByZXN1bHRhZG9zIHBhcmEgXFxcIlwiICsgdGV4dG9BQnVzY2FyICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSByZXNwb25zZS5kYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsaXN0Q29tcENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBMaXN0U2VydmljZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi51c2VyMSA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFswXVxyXG4gICAgc2VsZi51c2VyMUxpc3QgPSBcIlwiXHJcbiAgICBzZWxmLnVzZXIyID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzFdXHJcbiAgICBzZWxmLnVzZXIyTGlzdCA9IFwiXCJcclxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gbnVsbFxyXG5cclxuICAgIHNlbGYuY29tcGFyZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLnVzZXIxTGlzdCwgc2VsZi51c2VyMkxpc3QsIHNlc2lvbkFjdHVhbCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcbn0pO1xyXG4iLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XHJcblxyXG4gICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XHJcbiAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIjtcclxuXHJcbiAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBTZXNpb24ubG9naW4oe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmR9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSB0cnVlO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgfSlcclxuXHJcbiAgfTtcclxuXHJcbn0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUpIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xyXG5cclxuICAgIGlmKCRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvKXtcclxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgIH1cclxuXHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwXHJcbiAgLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgVXN1YXJpbykge1xyXG5cclxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XHJcbiAgICAkc2NvcGUucGFzc3dvcmQxID0gXCJcIjtcclxuICAgICRzY29wZS5wYXNzd29yZDIgPSBcIlwiO1xyXG4gICAgJHNjb3BlLmVtYWlsID0gXCJcIjtcclxuXHJcbiAgICAkc2NvcGUucmVnaXN0ZXJOZXdVc2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLnBhc3N3b3JkMSA9PT0gJHNjb3BlLnBhc3N3b3JkMikge1xyXG4gICAgICAgIFVzdWFyaW8ucmVnaXN0ZXIoe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQxfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGFsZXJ0KFwiVXN1YXJpbyBjcmVhZG8gY29ycmVjdGFtZW50ZSFcIik7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KFwiTGFzIHBhc3N3b3JkcyBubyBjb2luY2lkZW5cIiwgXCJQb3IgZmF2b3IgcmV2aXNhbGFzIGFudGVzIGRlIGVudmlhciBlbCBmb3JtdWxhcmlvXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJldHVyblRvTWFpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnRyYXNlbmlhc0Rpc3RpbnRhcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS5wYXNzd29yZDEgIT09ICRzY29wZS5wYXNzd29yZDI7XHJcbiAgICB9XHJcblxyXG4gIH0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ3VzZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBVc3VhcmlvKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnVzZXJzID0gW107XHJcbiAgICBzZWxmLnVzZXJzU2VsZWMgPSBbXTtcclxuICAgIHNlbGYuc2VsZWN0ZWRVc2VyID0gXCJcIjtcclxuICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgc2VsZi5pbXBvcnRVc2VycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBVc3VhcmlvLmdldFVzZXJzKHNlc2lvbkFjdHVhbCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXJzID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuaW1wb3J0VXNlcnMoKTtcclxuXHJcbiAgICBzZWxmLmNsZWFuU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgIHNlbGYudXNlcnMubWFwKGZ1bmN0aW9uICh1cykge1xyXG4gICAgICAgICAgICB1cy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5jb21wYXJlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi51c2Vyc1NlbGVjID0gc2VsZi51c2Vycy5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc2VsZWN0ZWRcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChzZWxmLnVzZXJzU2VsZWMubGVuZ3RoICE9IDIpe1xyXG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiU2VsZWNjaW9uZSBzw7NsbyBkb3MgdXN1YXJpb3NcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNlbGYudXNlcnNTZWxlYy5zb21lKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5saXN0cy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlVubyBkZSBsb3MgdXN1YXJpb3Mgbm8gcG9zZWUgbGlzdGFzXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCd1c2Vycy5saXN0cycsIHt1c2Vyc1NlbDpzZWxmLnVzZXJzU2VsZWN9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNlbGYuZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIG1vbnRoID0gKDEgKyBkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbW9udGggPSBtb250aC5sZW5ndGggPiAxID8gbW9udGggOiAnMCcgKyBtb250aDtcclxuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBkYXkgPSBkYXkubGVuZ3RoID4gMSA/IGRheSA6ICcwJyArIGRheTtcclxuICAgICAgICByZXR1cm4gZGF5ICsgJy8nICsgbW9udGggKyAnLycgKyB5ZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuc2hvd1VzZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnVzZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmdldFVzZXJuYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5jcmVkZW5jaWFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTaW4gVXNlcm5hbWVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmNyZWRlbmNpYWwudXNlcm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5nZXRMYXN0QWNjZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBpbmljacOzIHNlc2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmRhdGVGb3JtYXQoZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLm51bUxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5saXN0cy5sZW5ndGhcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5nZXRNb3ZpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5saXN0c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLm51bUZhdkFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmZhdm9yaXRlQWN0b3JzLmxlbmd0aFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5nZXRJbmZvID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgVXN1YXJpby5nZXREYXRhKHNlc2lvbkFjdHVhbCwgaWQsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxyXG4gKi9cclxubXlBcHAuc2VydmljZSgnQnVzcXVlZGFzU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCkge1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLmJ1c2NhclBlbGljdWxhID0gZnVuY3Rpb24gKHRleHRvRGVCdXNxdWVkYSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zZWFyY2gvJyArIHRleHRvRGVCdXNxdWVkYSwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIlRva2VuXCI6ICcxMjM0NSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn0pOyIsIm15QXBwLnNlcnZpY2UoJ0xpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuaW50ZXJzZWN0aW9uT2Y9IGZ1bmN0aW9uIChsaXN0YTEsIGxpc3RhMixzZXNpb25BY3R1YWwsY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkKycvJywge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuc2VydmljZSgnU2VzaW9uJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGhlbnRpY2F0aW9uL2xvZ2luJywgY3JlZGVudGlhbHMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9nb3V0Jyx1bmRlZmluZWQse2hlYWRlcnM6IHtcInRva2VuXCI6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufX0pXHJcbiAgICB9O1xyXG5cclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDAxLzA1LzE3LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuc2VydmljZSgnVXN1YXJpbycsIGZ1bmN0aW9uICgkaHR0cCkge1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyLycsIGNyZWRlbnRpYWxzKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5nZXRVc2VycyA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvbGlzdCcsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldERhdGEgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBpZCwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvdXNlci8nICsgaWQsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbn0pOyJdfQ==
