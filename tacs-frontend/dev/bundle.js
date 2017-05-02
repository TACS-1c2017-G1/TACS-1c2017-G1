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
    return $http.post('http://localhost:8080/user/',credentials);
  };

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvYnVzY2FyTW92aWVzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9oZWFkZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL0J1c3F1ZWRhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXNpb24uanMiLCJzZXJ2aWNlcy9Vc3VhcmlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInLCduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnXSk7XHJcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xyXG4gIC8vIEFuIGFycmF5IG9mIHN0YXRlIGRlZmluaXRpb25zXHJcbiAgdmFyIHN0YXRlcyA9IFt7XHJcblxyXG4gICAgICBuYW1lOiAnbGF5b3V0cycsXHJcbiAgICAgIHVybDogJycsXHJcbiAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdoZWFkZXInOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgICdmb290ZXInOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaG9tZScsXHJcbiAgICAgIHVybDogJy8nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgICB1cmw6ICcvYWN0b3Jlc0Zhdm9yaXRvcycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xpc3RhcycsXHJcbiAgICAgIHVybDogJy9saXN0YXMnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcclxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxyXG4gICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIF1cclxuXHJcbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxyXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XHJcbiAgfSk7XHJcblxyXG59KTtcclxuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cclxuLy8gICAgIFt7IG5hbWU6ICdoZWFkZXInLCB1cmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnfSxcclxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XHJcbi8vIH1dKTtcclxuIiwibXlBcHAuY29udHJvbGxlcignbmF2YmFyJywgZnVuY3Rpb24oJHNjb3BlKSB7XHJcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcclxuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAkc2NvcGUuaXNDb2xsYXBzZWRIb3Jpem9udGFsID0gZmFsc2U7XHJcbiAgJHNjb3BlLnNlYXJjaD17XHJcbiAgICBxdWVyeTogXCJcIixcclxuICAgIG9wdGlvbnM6IFtcIk1vdmllc1wiLFwiUGVvcGxlXCIsXCJBbnl0aGluZ1wiXSxcclxuICAgIGJ5OiBcIk1vdmllc1wiXHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsJGh0dHApIHtcclxuXHJcbiAgJHNjb3BlLm1vdmllcyA9IFtcclxuICAgIHtcclxuICAgICAgdGl0bGU6ICdibGEnLFxyXG4gICAgICBpZDonMScsXHJcbiAgICAgIG92ZXJ2aWV3OididWVuYSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiAnYmxlJyxcclxuICAgICAgaWQ6JzInLFxyXG4gICAgICBvdmVydmlldzonbWFsYSdcclxuICAgIH1cclxuICBdXHJcblxyXG5cclxuICAgIHZhciByZXEgPSB7XHJcbiAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MC9zZWFyY2gvbW92aWUvaG91c2UnLFxyXG4gICAgIGhlYWRlcnM6IHtcclxuICAgICAgICdUb2tlbic6IDEsXHJcbiAgICAgICBUb2tlbjogMSxcclxuICAgICAgICdUb2tlbic6ICcxJyxcclxuICAgICAgIFRva2VuOiAnMSdcclxuICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgICAgJGh0dHAocmVxKS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcclxuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcclxuICAgICAgJHNjb3BlLm1vdmllcyA9IHJlc3BvbnNlXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCIvL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAyLzA1LzIwMTcuXHJcbiAqL1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXHJcbiAqL1xyXG5teUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEJ1c3F1ZWRhc1NlcnZpY2UpIHtcclxuXHJcbiAgICAkc2NvcGUuYnVzY2FyID0gZnVuY3Rpb24gKHRleHRvQUJ1c2Nhcikge1xyXG4gICAgICAgIGlmICghdGV4dG9BQnVzY2FyKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIEJ1c3F1ZWRhc1NlcnZpY2UuYnVzY2FyUGVsaWN1bGEodGV4dG9BQnVzY2FyKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnJlc3VsdHMgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiTG8gc2VudGltb3MsIG5vIHNlIGVuY29udHJhcm9uIHJlc3VsdGFkb3MgcGFyYSBcXFwiXCIgKyB0ZXh0b0FCdXNjYXIgKyBcIlxcXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEucmVzdWx0cztcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSxTZXNpb24pIHtcclxuXHJcbiAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcclxuICAkc2NvcGUucGFzc3dvcmQgPSBcIlwiO1xyXG5cclxuICAkc2NvcGUuYXV0ZW50aWNhcnNlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFNlc2lvbi5sb2dpbih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBzZXNpb25BY3R1YWwgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSB0cnVlO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgfSlcclxuXHJcbiAgfTtcclxuXHJcbn0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUpIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xyXG5cclxuICAgIGlmKCRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvKXtcclxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgIH1cclxuXHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwXHJcbiAgLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgVXN1YXJpbykge1xyXG5cclxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XHJcbiAgICAkc2NvcGUucGFzc3dvcmQxID0gXCJcIjtcclxuICAgICRzY29wZS5wYXNzd29yZDIgPSBcIlwiO1xyXG4gICAgJHNjb3BlLmVtYWlsID0gXCJcIjtcclxuXHJcbiAgICAkc2NvcGUucmVnaXN0ZXJOZXdVc2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLnBhc3N3b3JkMSA9PT0gJHNjb3BlLnBhc3N3b3JkMikge1xyXG4gICAgICAgIFVzdWFyaW8ucmVnaXN0ZXIoe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQxfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGFsZXJ0KFwiVXN1YXJpbyBjcmVhZG8gY29ycmVjdGFtZW50ZSFcIik7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KFwiTGFzIHBhc3N3b3JkcyBubyBjb2luY2lkZW5cIiwgXCJQb3IgZmF2b3IgcmV2aXNhbGFzIGFudGVzIGRlIGVudmlhciBlbCBmb3JtdWxhcmlvXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJldHVyblRvTWFpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnRyYXNlbmlhc0Rpc3RpbnRhcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS5wYXNzd29yZDEgIT09ICRzY29wZS5wYXNzd29yZDI7XHJcbiAgICB9XHJcblxyXG4gIH0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cclxuICovXHJcbm15QXBwLnNlcnZpY2UoJ0J1c3F1ZWRhc1NlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5idXNjYXJQZWxpY3VsYSA9IGZ1bmN0aW9uICh0ZXh0b0RlQnVzcXVlZGEpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvc2VhcmNoLycgKyB0ZXh0b0RlQnVzcXVlZGEsIHtcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJUb2tlblwiOiAnMTIzNDUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcC5zZXJ2aWNlKCdTZXNpb24nLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGhlbnRpY2F0aW9uL2xvZ2luJyxjcmVkZW50aWFscyk7XHJcbiAgfTtcclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwMS8wNS8xNy5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLnNlcnZpY2UoJ1VzdWFyaW8nLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBzZWxmLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvJyxjcmVkZW50aWFscyk7XHJcbiAgfTtcclxuXHJcbn0pOyJdfQ==
