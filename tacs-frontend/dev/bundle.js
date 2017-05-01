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
      name: 'other',
      url: '/other',
      views: {
        'container@': {
          templateUrl: 'templates/other.html'
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

'use strict';

myApp.controller('MainController', function($rootScope,$scope,$state) {

    $rootScope.usuarioLogueado = false;

    if($rootScope.usuarioLogueado){
        $state.go('home');
    }else{
        $state.go('login');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9idXNjYXJNb3ZpZXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyIsInNlcnZpY2VzL1VzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInLCduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnXSk7XG4iLCJteUFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgLy8gQW4gYXJyYXkgb2Ygc3RhdGUgZGVmaW5pdGlvbnNcbiAgdmFyIHN0YXRlcyA9IFt7XG5cbiAgICAgIG5hbWU6ICdsYXlvdXRzJyxcbiAgICAgIHVybDogJycsXG4gICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdoZWFkZXInOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnXG4gICAgICAgIH0sXG4gICAgICAgICdmb290ZXInOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ2hvbWUnLFxuICAgICAgdXJsOiAnLycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9ob21lLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsb2dpbicsXG4gICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAncmVnaXN0ZXInLFxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdyZWdpc3RlckNvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVnaXN0ZXIuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ290aGVyJyxcbiAgICAgIHVybDogJy9vdGhlcicsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9vdGhlci5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdsaXN0YXMnLFxuICAgICAgdXJsOiAnL2xpc3RhcycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9saXN0YXMvbGlzdC5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdidXNjYXJNb3ZpZXMnLFxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxuICAgICAgY29udHJvbGxlcjogJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnVzY2FyL21vdmllcy5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIF1cblxuICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoc3RhdGUpO1xuICB9KTtcblxufSk7XG4iLCIvLyBteUFwcC5jb250cm9sbGVyKCdUZW1wbGF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cbi8vICAgICBbeyBuYW1lOiAnaGVhZGVyJywgdXJsOiAndGVtcGxhdGVzL2hlYWRlci5odG1sJ30sXG4vLyAgICAgIHsgbmFtZTogJ2Zvb3RlcicsIHVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCd9XTtcbi8vIH1dKTtcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ25hdmJhcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkSG9yaXpvbnRhbCA9IGZhbHNlO1xuICAkc2NvcGUuc2VhcmNoPXtcbiAgICBxdWVyeTogXCJcIixcbiAgICBvcHRpb25zOiBbXCJNb3ZpZXNcIixcIlBlb3BsZVwiLFwiQW55dGhpbmdcIl0sXG4gICAgYnk6IFwiTW92aWVzXCJcbiAgfVxuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUpIHtcblxuICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XG5cbiAgICBpZigkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyl7XG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgIH1lbHNle1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfVxuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdidXNjYXJNb3ZpZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCRodHRwKSB7XG5cbiAgJHNjb3BlLm1vdmllcyA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsYScsXG4gICAgICBpZDonMScsXG4gICAgICBvdmVydmlldzonYnVlbmEnXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsZScsXG4gICAgICBpZDonMicsXG4gICAgICBvdmVydmlldzonbWFsYSdcbiAgICB9XG4gIF1cblxuXG4gICAgdmFyIHJlcSA9IHtcbiAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAvc2VhcmNoL21vdmllL2hvdXNlJyxcbiAgICAgaGVhZGVyczoge1xuICAgICAgICdUb2tlbic6IDEsXG4gICAgICAgVG9rZW46IDEsXG4gICAgICAgJ1Rva2VuJzogJzEnLFxuICAgICAgIFRva2VuOiAnMSdcbiAgICAgfVxuXG4gICAgfVxuXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9KTtcblxufSk7XG4iLCIvL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwkc3RhdGUsU2VzaW9uKSB7XG5cbiAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcbiAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIjtcblxuICAkc2NvcGUuYXV0ZW50aWNhcnNlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgU2VzaW9uLmxvZ2luKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IHRydWU7XG4gICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcbiAgICAgIH0pXG5cbiAgfTtcblxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHBcbiAgLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgVXN1YXJpbykge1xuXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQxID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQyID0gXCJcIjtcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiO1xuXG4gICAgJHNjb3BlLnJlZ2lzdGVyTmV3VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkc2NvcGUucGFzc3dvcmQxID09PSAkc2NvcGUucGFzc3dvcmQyKSB7XG4gICAgICAgIFVzdWFyaW8ucmVnaXN0ZXIoe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQxfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBhbGVydChcIlVzdWFyaW8gY3JlYWRvIGNvcnJlY3RhbWVudGUhXCIpO1xuICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJMYXMgcGFzc3dvcmRzIG5vIGNvaW5jaWRlblwiLCBcIlBvciBmYXZvciByZXZpc2FsYXMgYW50ZXMgZGUgZW52aWFyIGVsIGZvcm11bGFyaW9cIiwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJldHVyblRvTWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb250cmFzZW5pYXNEaXN0aW50YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnBhc3N3b3JkMSAhPT0gJHNjb3BlLnBhc3N3b3JkMjtcbiAgICB9XG5cbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdTZXNpb24nLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9naW4nLGNyZWRlbnRpYWxzKTtcbiAgfTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwMS8wNS8xNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdVc3VhcmlvJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYucmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VzZXIvJyxjcmVkZW50aWFscyk7XG4gIH07XG5cbn0pOyJdfQ==
