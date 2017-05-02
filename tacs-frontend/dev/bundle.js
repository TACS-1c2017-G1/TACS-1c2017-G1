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
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function($scope, BusquedasService) {

    $scope.buscar = function (textoABuscar) {
        if(!textoABuscar)
            return;

        BusquedasService.buscarPelicula(textoABuscar)
            .then(function (response) {
                if(response.data.results <= 0)
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvYnVzY2FyTW92aWVzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDb250cm9sbGVyLmpzIiwic2VydmljZXMvQnVzcXVlZGFzU2VydmljZS5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyIsInNlcnZpY2VzL1VzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInLCduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnXSk7XHJcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xyXG4gIC8vIEFuIGFycmF5IG9mIHN0YXRlIGRlZmluaXRpb25zXHJcbiAgdmFyIHN0YXRlcyA9IFt7XHJcblxyXG4gICAgICBuYW1lOiAnbGF5b3V0cycsXHJcbiAgICAgIHVybDogJycsXHJcbiAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdoZWFkZXInOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgICdmb290ZXInOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaG9tZScsXHJcbiAgICAgIHVybDogJy8nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgICB1cmw6ICcvYWN0b3Jlc0Zhdm9yaXRvcycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xpc3RhcycsXHJcbiAgICAgIHVybDogJy9saXN0YXMnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcclxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxyXG4gICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIF1cclxuXHJcbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxyXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XHJcbiAgfSk7XHJcblxyXG59KTtcclxuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cclxuLy8gICAgIFt7IG5hbWU6ICdoZWFkZXInLCB1cmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnfSxcclxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XHJcbi8vIH1dKTtcclxuIiwibXlBcHAuY29udHJvbGxlcignbmF2YmFyJywgZnVuY3Rpb24oJHNjb3BlKSB7XHJcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcclxuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAkc2NvcGUuaXNDb2xsYXBzZWRIb3Jpem9udGFsID0gZmFsc2U7XHJcbiAgJHNjb3BlLnNlYXJjaD17XHJcbiAgICBxdWVyeTogXCJcIixcclxuICAgIG9wdGlvbnM6IFtcIk1vdmllc1wiLFwiUGVvcGxlXCIsXCJBbnl0aGluZ1wiXSxcclxuICAgIGJ5OiBcIk1vdmllc1wiXHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsJGh0dHApIHtcclxuXHJcbiAgJHNjb3BlLm1vdmllcyA9IFtcclxuICAgIHtcclxuICAgICAgdGl0bGU6ICdibGEnLFxyXG4gICAgICBpZDonMScsXHJcbiAgICAgIG92ZXJ2aWV3OididWVuYSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiAnYmxlJyxcclxuICAgICAgaWQ6JzInLFxyXG4gICAgICBvdmVydmlldzonbWFsYSdcclxuICAgIH1cclxuICBdXHJcblxyXG5cclxuICAgIHZhciByZXEgPSB7XHJcbiAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MC9zZWFyY2gvbW92aWUvaG91c2UnLFxyXG4gICAgIGhlYWRlcnM6IHtcclxuICAgICAgICdUb2tlbic6IDEsXHJcbiAgICAgICBUb2tlbjogMSxcclxuICAgICAgICdUb2tlbic6ICcxJyxcclxuICAgICAgIFRva2VuOiAnMSdcclxuICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgICAgJGh0dHAocmVxKS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcclxuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcclxuICAgICAgJHNjb3BlLm1vdmllcyA9IHJlc3BvbnNlXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCIvL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXHJcbiAqL1xyXG5teUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgQnVzcXVlZGFzU2VydmljZSkge1xyXG5cclxuICAgICRzY29wZS5idXNjYXIgPSBmdW5jdGlvbiAodGV4dG9BQnVzY2FyKSB7XHJcbiAgICAgICAgaWYoIXRleHRvQUJ1c2NhcilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBCdXNxdWVkYXNTZXJ2aWNlLmJ1c2NhclBlbGljdWxhKHRleHRvQUJ1c2NhcilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5kYXRhLnJlc3VsdHMgPD0gMClcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkxvIHNlbnRpbW9zLCBubyBzZSBlbmNvbnRyYXJvbiByZXN1bHRhZG9zIHBhcmEgXFxcIlwiICsgdGV4dG9BQnVzY2FyICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSByZXNwb25zZS5kYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XHJcblxyXG4gICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XHJcbiAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIjtcclxuXHJcbiAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBTZXNpb24ubG9naW4oe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmR9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gdHJ1ZTtcclxuICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgIH0pXHJcblxyXG4gIH07XHJcblxyXG59KTtcclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlKSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8gPSBmYWxzZTtcclxuXHJcbiAgICBpZigkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyl7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICB9XHJcblxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcFxyXG4gIC5jb250cm9sbGVyKCdyZWdpc3RlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIFVzdWFyaW8pIHtcclxuXHJcbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xyXG4gICAgJHNjb3BlLnBhc3N3b3JkMSA9IFwiXCI7XHJcbiAgICAkc2NvcGUucGFzc3dvcmQyID0gXCJcIjtcclxuICAgICRzY29wZS5lbWFpbCA9IFwiXCI7XHJcblxyXG4gICAgJHNjb3BlLnJlZ2lzdGVyTmV3VXNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCRzY29wZS5wYXNzd29yZDEgPT09ICRzY29wZS5wYXNzd29yZDIpIHtcclxuICAgICAgICBVc3VhcmlvLnJlZ2lzdGVyKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkMX0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBhbGVydChcIlVzdWFyaW8gY3JlYWRvIGNvcnJlY3RhbWVudGUhXCIpO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChcIkxhcyBwYXNzd29yZHMgbm8gY29pbmNpZGVuXCIsIFwiUG9yIGZhdm9yIHJldmlzYWxhcyBhbnRlcyBkZSBlbnZpYXIgZWwgZm9ybXVsYXJpb1wiLCBcImVycm9yXCIpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZXR1cm5Ub01haW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb250cmFzZW5pYXNEaXN0aW50YXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUucGFzc3dvcmQxICE9PSAkc2NvcGUucGFzc3dvcmQyO1xyXG4gICAgfVxyXG5cclxuICB9KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXHJcbiAqL1xyXG5teUFwcC5zZXJ2aWNlKCdCdXNxdWVkYXNTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuYnVzY2FyUGVsaWN1bGEgPSBmdW5jdGlvbiAodGV4dG9EZUJ1c3F1ZWRhKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3NlYXJjaC8nICsgdGV4dG9EZUJ1c3F1ZWRhLCB7XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuc2VydmljZSgnU2VzaW9uJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgc2VsZi5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dpbicsY3JlZGVudGlhbHMpO1xyXG4gIH07XHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBheWUgb24gMDEvMDUvMTcuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcC5zZXJ2aWNlKCdVc3VhcmlvJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgc2VsZi5yZWdpc3RlciA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2VyLycsY3JlZGVudGlhbHMpO1xyXG4gIH07XHJcblxyXG59KTsiXX0=
