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

myApp.service('Usuario', function ($http) {

    var self = this;

    self.register = function (credentials) {
        return $http.post('http://localhost:8080/user/', credentials);
    };


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FkbWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2J1c2Nhck1vdmllc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mYXZvcml0b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvaGVhZGVyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xpc3RDb21wQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL0FkbWluLmpzIiwic2VydmljZXMvQnVzcXVlZGFzU2VydmljZS5qcyIsInNlcnZpY2VzL0xpc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvU2VzaW9uLmpzIiwic2VydmljZXMvVXN1YXJpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbXlBcHAgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3VpLnJvdXRlcicsJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCddKTtcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xuICAgIHZhciBzdGF0ZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdob21lJyxcbiAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2xvZ2luJyxcbiAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncmVnaXN0ZXInLFxuICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyZWdpc3RlckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVnaXN0ZXIuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdhY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgICAgICAgIHVybDogJy9hY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FjdG9yZXNGYXZvcml0b3MuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2xpc3RhcycsXG4gICAgICAgICAgICB1cmw6ICcvbGlzdGFzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xpc3Rhcy9saXN0Lmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdidXNjYXJNb3ZpZXMnLFxuICAgICAgICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnVzY2FyL21vdmllcy5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAndXNlcnMnLFxuICAgICAgICAgICAgdXJsOiAnL3VzZXJzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3VzZXJzLmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd1c2Vycy5saXN0cycsXG4gICAgICAgICAgICB1cmw6ICcvbGlzdHMnLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdXNlcnNTZWw6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9saXN0Q29tcGFyaXNvbi5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgXVxuXG4gICAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxuICAgIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XG4gICAgfSk7XG5cbn0pO1xuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcbi8vICAgJHNjb3BlLnRlbXBsYXRlcyA9XG4vLyAgICAgW3sgbmFtZTogJ2hlYWRlcicsIHVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCd9LFxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XG4vLyB9XSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcbiAgJHNjb3BlLnNlYXJjaD17XG4gICAgcXVlcnk6IFwiXCIsXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxuICAgIGJ5OiBcIk1vdmllc1wiXG4gIH1cblxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMS8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEJ1c3F1ZWRhc1NlcnZpY2UpIHtcblxuICAgICRzY29wZS5idXNjYXIgPSBmdW5jdGlvbiAodGV4dG9BQnVzY2FyKSB7XG4gICAgICAgIGlmICghdGV4dG9BQnVzY2FyKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIEJ1c3F1ZWRhc1NlcnZpY2UuYnVzY2FyUGVsaWN1bGEodGV4dG9BQnVzY2FyKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEucmVzdWx0cyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiTG8gc2VudGltb3MsIG5vIHNlIGVuY29udHJhcm9uIHJlc3VsdGFkb3MgcGFyYSBcXFwiXCIgKyB0ZXh0b0FCdXNjYXIgKyBcIlxcXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSByZXNwb25zZS5kYXRhLnJlc3VsdHM7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSkge1xuXG4gICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSBmYWxzZTtcbiAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSBmYWxzZTtcblxuICAgIGlmKCRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvKXtcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgfWVsc2V7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgQWRtaW4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi51c2VycyA9IFtdO1xuICAgIHNlbGYudXNlcnNTZWxlYyA9IFtdO1xuICAgIHNlbGYuc2VsZWN0ZWRVc2VyID0gXCJcIjtcbiAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG5cblxuICAgIHNlbGYuaW1wb3J0VXNlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEFkbWluLmdldFVzZXJzKHNlc2lvbkFjdHVhbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYudXNlcnMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuaW1wb3J0VXNlcnMoKTtcblxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgICAgICBzZWxmLnVzZXJzLm1hcChmdW5jdGlvbiAodXMpIHtcbiAgICAgICAgICAgIHVzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5jb21wYXJlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudXNlcnNTZWxlYyA9IHNlbGYudXNlcnMuZmlsdGVyKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zZWxlY3RlZFxuICAgICAgICB9KVxuICAgICAgICBpZiAoc2VsZi51c2Vyc1NlbGVjLmxlbmd0aCAhPSAyKXtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJTZWxlY2Npb25lIHPDs2xvIGRvcyB1c3Vhcmlvc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihzZWxmLnVzZXJzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmxpc3RzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJVbm8gZGUgbG9zIHVzdWFyaW9zIG5vIHBvc2VlIGxpc3Rhc1wiXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3VzZXJzLmxpc3RzJywge3VzZXJzU2VsOnNlbGYudXNlcnNTZWxlY30pXG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgc2VsZi5kYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBtb250aCA9ICgxICsgZGF0ZS5nZXRNb250aCgpKS50b1N0cmluZygpO1xuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICcwJyArIG1vbnRoO1xuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKTtcbiAgICAgICAgZGF5ID0gZGF5Lmxlbmd0aCA+IDEgPyBkYXkgOiAnMCcgKyBkYXk7XG4gICAgICAgIHJldHVybiBkYXkgKyAnLycgKyBtb250aCArICcvJyArIHllYXI7XG4gICAgfTtcblxuICAgIHNlbGYuc2hvd1VzZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2VsZi51c2VycztcbiAgICB9O1xuXG4gICAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbigpO1xuICAgIH07XG5cbiAgICBzZWxmLmdldFVzZXJuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmNyZWRlbmNpYWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTaW4gVXNlcm5hbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmNyZWRlbmNpYWwudXNlcm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG5cblxuICAgIH07XG5cbiAgICBzZWxmLmdldExhc3RBY2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGFzdEFjY2VzcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGluaWNpw7Mgc2VzacOzblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYuc2VsZWN0ZWRVc2VyLmxhc3RBY2Nlc3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmRhdGVGb3JtYXQoZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgc2VsZi5udW1MaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMubGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5nZXRNb3ZpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5saXN0c1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYubnVtRmF2QWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLmZhdm9yaXRlQWN0b3JzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMubGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIHNlbGYuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNlbGYuZ2V0SW5mbyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBBZG1pbi5nZXREYXRhKHNlc2lvbkFjdHVhbCwgaWQsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IHRydWU7XG5cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdidXNjYXJNb3ZpZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCRodHRwKSB7XG5cbiAgJHNjb3BlLm1vdmllcyA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsYScsXG4gICAgICBpZDonMScsXG4gICAgICBvdmVydmlldzonYnVlbmEnXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsZScsXG4gICAgICBpZDonMicsXG4gICAgICBvdmVydmlldzonbWFsYSdcbiAgICB9XG4gIF1cblxuXG4gICAgdmFyIHJlcSA9IHtcbiAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAvc2VhcmNoL21vdmllL2hvdXNlJyxcbiAgICAgaGVhZGVyczoge1xuICAgICAgICdUb2tlbic6IDEsXG4gICAgICAgVG9rZW46IDEsXG4gICAgICAgJ1Rva2VuJzogJzEnLFxuICAgICAgIFRva2VuOiAnMSdcbiAgICAgfVxuXG4gICAgfVxuXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9KTtcblxufSk7XG4iLCIvL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCIvKipcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMi8wNS8yMDE3LlxuICovXG5teUFwcC5jb250cm9sbGVyKCdoZWFkZXJDb250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlLFNlc2lvbikge1xuXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBTZXNpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICB9O1xuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsaXN0Q29tcENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBMaXN0U2VydmljZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnVzZXIxID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzBdXG4gICAgc2VsZi51c2VyMUxpc3QgPSBcIlwiXG4gICAgc2VsZi51c2VyMiA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFsxXVxuICAgIHNlbGYudXNlcjJMaXN0ID0gXCJcIlxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gbnVsbFxuXG4gICAgc2VsZi5jb21wYXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLnVzZXIxTGlzdCwgc2VsZi51c2VyMkxpc3QsIHNlc2lvbkFjdHVhbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gIHNlbGYuZXNBZG1pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJHJvb3RTY29wZS5lc0FkbWluKCk7XG4gIH07XG59KTtcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgU2VzaW9uKSB7XG5cbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XG5cbiAgICAkc2NvcGUuYXV0ZW50aWNhcnNlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgU2VzaW9uLmxvZ2luKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gdHJ1ZTtcbiAgICAgICAgJHJvb3RTY29wZS5lc0FkbWluID0gcmVzcG9uc2UuZGF0YS5lc0FkbWluO1xuXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgIH0pXG5cbiAgICB9O1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcFxuICAuY29udHJvbGxlcigncmVnaXN0ZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBVc3VhcmlvKSB7XG5cbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZDEgPSBcIlwiO1xuICAgICRzY29wZS5wYXNzd29yZDIgPSBcIlwiO1xuICAgICRzY29wZS5lbWFpbCA9IFwiXCI7XG5cbiAgICAkc2NvcGUucmVnaXN0ZXJOZXdVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5wYXNzd29yZDEgPT09ICRzY29wZS5wYXNzd29yZDIpIHtcbiAgICAgICAgVXN1YXJpby5yZWdpc3Rlcih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZDF9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGFsZXJ0KFwiVXN1YXJpbyBjcmVhZG8gY29ycmVjdGFtZW50ZSFcIik7XG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkxhcyBwYXNzd29yZHMgbm8gY29pbmNpZGVuXCIsIFwiUG9yIGZhdm9yIHJldmlzYWxhcyBhbnRlcyBkZSBlbnZpYXIgZWwgZm9ybXVsYXJpb1wiLCBcImVycm9yXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmV0dXJuVG9NYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnRyYXNlbmlhc0Rpc3RpbnRhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkc2NvcGUucGFzc3dvcmQxICE9PSAkc2NvcGUucGFzc3dvcmQyO1xuICAgIH1cblxuICB9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDA2LzA1LzE3LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ0FkbWluJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuZ2V0VXNlcnMgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hZG1pbi91c2VyL2xpc3QnLCB7XG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbiAgc2VsZi5nZXREYXRhID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgaWQsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FkbWluL3VzZXIvJyArIGlkLCB7XG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXG4gKi9cbm15QXBwLnNlcnZpY2UoJ0J1c3F1ZWRhc1NlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuYnVzY2FyUGVsaWN1bGEgPSBmdW5jdGlvbiAodGV4dG9EZUJ1c3F1ZWRhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9zZWFyY2gvJyArIHRleHRvRGVCdXNxdWVkYSwge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCJteUFwcC5zZXJ2aWNlKCdMaXN0U2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbnRlcnNlY3Rpb25PZj0gZnVuY3Rpb24gKGxpc3RhMSwgbGlzdGEyLHNlc2lvbkFjdHVhbCxjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYWRtaW4vdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkKycvJywge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1Nlc2lvbicsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGhlbnRpY2F0aW9uL2xvZ2luJywgY3JlZGVudGlhbHMpO1xuICAgIH07XG5cbiAgICBzZWxmLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGhlbnRpY2F0aW9uL2xvZ291dCcsdW5kZWZpbmVkLHtoZWFkZXJzOiB7XCJ0b2tlblwiOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn19KVxuICAgIH07XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBheWUgb24gMDEvMDUvMTcuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubXlBcHAuc2VydmljZSgnVXN1YXJpbycsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5yZWdpc3RlciA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvJywgY3JlZGVudGlhbHMpO1xuICAgIH07XG5cblxufSk7Il19
