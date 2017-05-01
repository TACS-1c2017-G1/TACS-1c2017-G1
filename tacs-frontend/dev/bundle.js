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
myApp.controller('loginController', function($scope,Sesion) {

  $scope.autenticarse = function () {

    var sesionActual = undefined;

    Sesion.login({username: $scope.userName, password: $scope.password})
      .then(function (response) {
          sesionActual = response.data;
          console.log(sesionActual);
      })
      .catch(function (error) {
          alert(error.data.message);
      })


  };
});


'use strict';

myApp.controller('MainController', function($scope) {
    $scope.usuarioLogueado = false;
});
'use strict';

myApp.service('Sesion', function ($http) {

  var self = this;

  self.login = function (credentials) {
    return $http.post('http://localhost:8080/authentication/login',credentials);
  };

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvYnVzY2FyTW92aWVzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbXlBcHAgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3VpLnJvdXRlcicsJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCddKTtcclxuIiwibXlBcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgLy8gQW4gYXJyYXkgb2Ygc3RhdGUgZGVmaW5pdGlvbnNcclxuICB2YXIgc3RhdGVzID0gW3tcclxuICAgICAgbmFtZTogJ2xheW91dHMnLFxyXG4gICAgICB1cmw6ICcnLFxyXG4gICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnaGVhZGVyJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnXHJcbiAgICAgICAgfSxcclxuICAgICAgICAnZm9vdGVyJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2hvbWUnLFxyXG4gICAgICB1cmw6ICcvJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2hvbWUuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdsb2dpbicsXHJcbiAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnb3RoZXInLFxyXG4gICAgICB1cmw6ICcvb3RoZXInLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvb3RoZXIuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnbGlzdGFzJyxcclxuICAgICAgdXJsOiAnL2xpc3RhcycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9saXN0YXMvbGlzdC5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdidXNjYXJNb3ZpZXMnLFxyXG4gICAgICB1cmw6ICcvYnVzY2FyL3BlbGljdWxhLycsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdidXNjYXJNb3ZpZXNDb250cm9sbGVyJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2J1c2Nhci9tb3ZpZXMuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgXVxyXG5cclxuICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXHJcbiAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24oc3RhdGUpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlKTtcclxuICB9KTtcclxuXHJcbn0pO1xyXG4iLCIvLyBteUFwcC5jb250cm9sbGVyKCdUZW1wbGF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xyXG4vLyAgICRzY29wZS50ZW1wbGF0ZXMgPVxyXG4vLyAgICAgW3sgbmFtZTogJ2hlYWRlcicsIHVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCd9LFxyXG4vLyAgICAgIHsgbmFtZTogJ2Zvb3RlcicsIHVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCd9XTtcclxuLy8gfV0pO1xyXG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcclxuICAkc2NvcGUuc2VhcmNoPXtcclxuICAgIHF1ZXJ5OiBcIlwiLFxyXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxyXG4gICAgYnk6IFwiTW92aWVzXCJcclxuICB9XHJcblxyXG59KTtcclxuIiwibXlBcHAuY29udHJvbGxlcignYnVzY2FyTW92aWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwkaHR0cCkge1xyXG5cclxuICAkc2NvcGUubW92aWVzID0gW1xyXG4gICAge1xyXG4gICAgICB0aXRsZTogJ2JsYScsXHJcbiAgICAgIGlkOicxJyxcclxuICAgICAgb3ZlcnZpZXc6J2J1ZW5hJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGl0bGU6ICdibGUnLFxyXG4gICAgICBpZDonMicsXHJcbiAgICAgIG92ZXJ2aWV3OidtYWxhJ1xyXG4gICAgfVxyXG4gIF1cclxuXHJcblxyXG4gICAgdmFyIHJlcSA9IHtcclxuICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgIHVybDogJ2xvY2FsaG9zdDo4MDgwL3NlYXJjaC9tb3ZpZS9ob3VzZScsXHJcbiAgICAgaGVhZGVyczoge1xyXG4gICAgICAgJ1Rva2VuJzogMSxcclxuICAgICAgIFRva2VuOiAxLFxyXG4gICAgICAgJ1Rva2VuJzogJzEnLFxyXG4gICAgICAgVG9rZW46ICcxJ1xyXG4gICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxyXG4gICAgfSwgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsIi8vZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsIm15QXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSxTZXNpb24pIHtcclxuXHJcbiAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgc2VzaW9uQWN0dWFsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIFNlc2lvbi5sb2dpbih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgc2VzaW9uQWN0dWFsID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNlc2lvbkFjdHVhbCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgIH0pXHJcblxyXG5cclxuICB9O1xyXG59KTtcclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKSB7XHJcbiAgICAkc2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLnNlcnZpY2UoJ1Nlc2lvbicsIGZ1bmN0aW9uICgkaHR0cCkge1xyXG5cclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIHNlbGYubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aGVudGljYXRpb24vbG9naW4nLGNyZWRlbnRpYWxzKTtcclxuICB9O1xyXG5cclxufSk7Il19
