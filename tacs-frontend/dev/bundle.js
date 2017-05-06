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
        Admin.getUsers(sesionActual,
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
    };

    self.showUsers = function () {
        return self.users;
    };

    self.esAdmin = function () {
      return $rootScope.esAdmin();
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
        Admin.getData(sesionActual, id,
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

//favoritosController.js
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

myApp.controller('loginController', function($rootScope,$scope,$state,Sesion) {

  $scope.userName = "";
  $scope.password = "";

  $scope.autenticarse = function () {

    Sesion.login({username: $scope.userName, password: $scope.password})
      .then(function (response) {
        sesionActual = response.data;
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


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2J1c2Nhck1vdmllc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mYXZvcml0b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbXBDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbG9naW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDb250cm9sbGVyLmpzIiwic2VydmljZXMvQWRtaW4uanMiLCJzZXJ2aWNlcy9CdXNxdWVkYXNTZXJ2aWNlLmpzIiwic2VydmljZXMvTGlzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXNpb24uanMiLCJzZXJ2aWNlcy9Vc3VhcmlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJ10pO1xuIiwibXlBcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgIC8vIEFuIGFycmF5IG9mIHN0YXRlIGRlZmluaXRpb25zXG4gICAgdmFyIHN0YXRlcyA9IFt7XG5cbiAgICAgICAgbmFtZTogJ2xheW91dHMnLFxuICAgICAgICB1cmw6ICcnLFxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdoZWFkZXInOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2Zvb3Rlcic6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2hvbWUnLFxuICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9ob21lLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbG9naW4nLFxuICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdyZWdpc3RlcicsXG4gICAgICAgICAgICB1cmw6ICcvcmVnaXN0ZXInLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxuICAgICAgICAgICAgdXJsOiAnL2FjdG9yZXNGYXZvcml0b3MnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbGlzdGFzJyxcbiAgICAgICAgICAgIHVybDogJy9saXN0YXMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2J1c2Nhck1vdmllcycsXG4gICAgICAgICAgICB1cmw6ICcvYnVzY2FyL3BlbGljdWxhLycsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd1c2VycycsXG4gICAgICAgICAgICB1cmw6ICcvdXNlcnMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWRtaW4vdXNlcnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3VzZXJzLmxpc3RzJyxcbiAgICAgICAgICAgIHVybDogJy9saXN0cycsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICB1c2Vyc1NlbDogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL2xpc3RDb21wYXJpc29uLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBdXG5cbiAgICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXG4gICAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlKTtcbiAgICB9KTtcblxufSk7XG4iLCIvLyBteUFwcC5jb250cm9sbGVyKCdUZW1wbGF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cbi8vICAgICBbeyBuYW1lOiAnaGVhZGVyJywgdXJsOiAndGVtcGxhdGVzL2hlYWRlci5odG1sJ30sXG4vLyAgICAgIHsgbmFtZTogJ2Zvb3RlcicsIHVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCd9XTtcbi8vIH1dKTtcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ25hdmJhcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkSG9yaXpvbnRhbCA9IGZhbHNlO1xuICAkc2NvcGUuc2VhcmNoPXtcbiAgICBxdWVyeTogXCJcIixcbiAgICBvcHRpb25zOiBbXCJNb3ZpZXNcIixcIlBlb3BsZVwiLFwiQW55dGhpbmdcIl0sXG4gICAgYnk6IFwiTW92aWVzXCJcbiAgfVxuXG59KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXG4gKi9cbm15QXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQnVzcXVlZGFzU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmJ1c2NhciA9IGZ1bmN0aW9uICh0ZXh0b0FCdXNjYXIpIHtcbiAgICAgICAgaWYgKCF0ZXh0b0FCdXNjYXIpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgQnVzcXVlZGFzU2VydmljZS5idXNjYXJQZWxpY3VsYSh0ZXh0b0FCdXNjYXIpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJMbyBzZW50aW1vcywgbm8gc2UgZW5jb250cmFyb24gcmVzdWx0YWRvcyBwYXJhIFxcXCJcIiArIHRleHRvQUJ1c2NhciArIFwiXFxcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlKSB7XG5cbiAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuZXNBZG1pbiA9IGZhbHNlO1xuXG4gICAgaWYoJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8pe1xuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH1cblxufSk7IiwibXlBcHAuY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBBZG1pbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnVzZXJzID0gW107XG4gICAgc2VsZi51c2Vyc1NlbGVjID0gW107XG4gICAgc2VsZi5zZWxlY3RlZFVzZXIgPSBcIlwiO1xuICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcblxuXG4gICAgc2VsZi5pbXBvcnRVc2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQWRtaW4uZ2V0VXNlcnMoc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51c2VycyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5pbXBvcnRVc2VycygpO1xuXG4gICAgc2VsZi5jbGVhblNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgICAgIHNlbGYudXNlcnMubWFwKGZ1bmN0aW9uICh1cykge1xuICAgICAgICAgICAgdXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmNvbXBhcmVTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi51c2Vyc1NlbGVjID0gc2VsZi51c2Vycy5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnNlbGVjdGVkXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChzZWxmLnVzZXJzU2VsZWMubGVuZ3RoICE9IDIpe1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIHVzdWFyaW9zXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHNlbGYudXNlcnNTZWxlYy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUubGlzdHMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlVubyBkZSBsb3MgdXN1YXJpb3Mgbm8gcG9zZWUgbGlzdGFzXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygndXNlcnMubGlzdHMnLCB7dXNlcnNTZWw6c2VsZi51c2Vyc1NlbGVjfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBzZWxmLmRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIG1vbnRoID0gKDEgKyBkYXRlLmdldE1vbnRoKCkpLnRvU3RyaW5nKCk7XG4gICAgICAgIG1vbnRoID0gbW9udGgubGVuZ3RoID4gMSA/IG1vbnRoIDogJzAnICsgbW9udGg7XG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xuICAgICAgICBkYXkgPSBkYXkubGVuZ3RoID4gMSA/IGRheSA6ICcwJyArIGRheTtcbiAgICAgICAgcmV0dXJuIGRheSArICcvJyArIG1vbnRoICsgJy8nICsgeWVhcjtcbiAgICB9O1xuXG4gICAgc2VsZi5zaG93VXNlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnVzZXJzO1xuICAgIH07XG5cbiAgICBzZWxmLmVzQWRtaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHJvb3RTY29wZS5lc0FkbWluKCk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0VXNlcm5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIuY3JlZGVuY2lhbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlNpbiBVc2VybmFtZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuY3JlZGVuY2lhbC51c2VybmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfTtcblxuICAgIHNlbGYuZ2V0TGFzdEFjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaW5pY2nDsyBzZXNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5zZWxlY3RlZFVzZXIubGFzdEFjY2Vzcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGF0ZUZvcm1hdChkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBzZWxmLm51bUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5saXN0cy5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLmdldE1vdmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5udW1GYXZBY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycy5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgc2VsZi5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc2VsZi5nZXRJbmZvID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIEFkbWluLmdldERhdGEoc2VzaW9uQWN0dWFsLCBpZCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gdHJ1ZTtcblxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsJGh0dHApIHtcblxuICAkc2NvcGUubW92aWVzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnYmxhJyxcbiAgICAgIGlkOicxJyxcbiAgICAgIG92ZXJ2aWV3OididWVuYSdcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnYmxlJyxcbiAgICAgIGlkOicyJyxcbiAgICAgIG92ZXJ2aWV3OidtYWxhJ1xuICAgIH1cbiAgXVxuXG5cbiAgICB2YXIgcmVxID0ge1xuICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MC9zZWFyY2gvbW92aWUvaG91c2UnLFxuICAgICBoZWFkZXJzOiB7XG4gICAgICAgJ1Rva2VuJzogMSxcbiAgICAgICBUb2tlbjogMSxcbiAgICAgICAnVG9rZW4nOiAnMScsXG4gICAgICAgVG9rZW46ICcxJ1xuICAgICB9XG5cbiAgICB9XG5cbiAgICAgICRodHRwKHJlcSkudGhlbihmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxuICAgIH0pO1xuXG59KTtcbiIsIi8vZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsIm15QXBwLmNvbnRyb2xsZXIoJ2xpc3RDb21wQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsJHN0YXRlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudXNlcjEgPSAkc3RhdGVQYXJhbXMudXNlcnNTZWxbMF1cbiAgICBzZWxmLnVzZXIxTGlzdCA9IFwiXCJcbiAgICBzZWxmLnVzZXIyID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzFdXG4gICAgc2VsZi51c2VyMkxpc3QgPSBcIlwiXG4gICAgc2VsZi5pbnRlcnNlY3Rpb24gPSBudWxsXG5cbiAgICBzZWxmLmNvbXBhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIExpc3RTZXJ2aWNlLmludGVyc2VjdGlvbk9mKHNlbGYudXNlcjFMaXN0LCBzZWxmLnVzZXIyTGlzdCwgc2VzaW9uQWN0dWFsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW4oKTtcbiAgfTtcbn0pO1xuIiwibXlBcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlLFNlc2lvbikge1xuXG4gICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XG5cbiAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIFNlc2lvbi5sb2dpbih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSB0cnVlO1xuICAgICAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSByZXNwb25zZS5kYXRhLmVzQWRtaW47XG5cbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgfSlcblxuICB9O1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcFxuICAuY29udHJvbGxlcigncmVnaXN0ZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBVc3VhcmlvKSB7XG5cbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZDEgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZDIgPSBcIlwiO1xuICAgICRzY29wZS5lbWFpbCA9IFwiXCI7XG5cbiAgICAkc2NvcGUucmVnaXN0ZXJOZXdVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5wYXNzd29yZDEgPT09ICRzY29wZS5wYXNzd29yZDIpIHtcbiAgICAgICAgVXN1YXJpby5yZWdpc3Rlcih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZDF9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGFsZXJ0KFwiVXN1YXJpbyBjcmVhZG8gY29ycmVjdGFtZW50ZSFcIik7XG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkxhcyBwYXNzd29yZHMgbm8gY29pbmNpZGVuXCIsIFwiUG9yIGZhdm9yIHJldmlzYWxhcyBhbnRlcyBkZSBlbnZpYXIgZWwgZm9ybXVsYXJpb1wiLCBcImVycm9yXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmV0dXJuVG9NYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnRyYXNlbmlhc0Rpc3RpbnRhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkc2NvcGUucGFzc3dvcmQxICE9PSAkc2NvcGUucGFzc3dvcmQyO1xuICAgIH1cblxuICB9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDA2LzA1LzE3LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ0FkbWluJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuZ2V0VXNlcnMgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hZG1pbi91c2VyL2xpc3QnLCB7XG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbiAgc2VsZi5nZXREYXRhID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgaWQsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FkbWluL3VzZXIvJyArIGlkLCB7XG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXG4gKi9cbm15QXBwLnNlcnZpY2UoJ0J1c3F1ZWRhc1NlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuYnVzY2FyUGVsaWN1bGEgPSBmdW5jdGlvbiAodGV4dG9EZUJ1c3F1ZWRhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zZWFyY2gvJyArIHRleHRvRGVCdXNxdWVkYSwge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCJteUFwcC5zZXJ2aWNlKCdMaXN0U2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbnRlcnNlY3Rpb25PZj0gZnVuY3Rpb24gKGxpc3RhMSwgbGlzdGEyLHNlc2lvbkFjdHVhbCxjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkKycvJywge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1Nlc2lvbicsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dpbicsY3JlZGVudGlhbHMpO1xuICB9O1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDAxLzA1LzE3LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1VzdWFyaW8nLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyLycsIGNyZWRlbnRpYWxzKTtcbiAgICB9O1xuXG5cbn0pOyJdfQ==
