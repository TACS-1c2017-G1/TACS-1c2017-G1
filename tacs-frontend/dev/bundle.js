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

'use strict';

myApp.controller('MainController', function($scope) {

    $scope.usuarioLogueado = true;

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
  $scope.userName = "";
  $scope.password = "";

  $scope.autenticarse = function () {
    Sesion.login({username: $scope.userName, password: $scope.password});
  };
});


'use strict';

myApp.service('Sesion', function ($http) {

  var self = this;
  var sesionActual = undefined;

  self.login = function (credentials) {
    return $http.post('http://localhost:8080/authentication/login',credentials)
      .success(function (sesion) {
        sesionActual = sesion;
        alert("Bienvenido");
      })
      .fail(function (exception) {
        alert(exception);
      })
  };

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9idXNjYXJNb3ZpZXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJ10pO1xuIiwibXlBcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gIC8vIEFuIGFycmF5IG9mIHN0YXRlIGRlZmluaXRpb25zXG4gIHZhciBzdGF0ZXMgPSBbe1xuICAgICAgbmFtZTogJ2xheW91dHMnLFxuICAgICAgdXJsOiAnJyxcbiAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2hlYWRlcic6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2Zvb3Rlcic6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnaG9tZScsXG4gICAgICB1cmw6ICcvJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2hvbWUuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2xvZ2luJyxcbiAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ290aGVyJyxcbiAgICAgIHVybDogJy9vdGhlcicsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9vdGhlci5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdsaXN0YXMnLFxuICAgICAgdXJsOiAnL2xpc3RhcycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9saXN0YXMvbGlzdC5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdidXNjYXJNb3ZpZXMnLFxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxuICAgICAgY29udHJvbGxlcjogJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnVzY2FyL21vdmllcy5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIF1cblxuICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoc3RhdGUpO1xuICB9KTtcblxufSk7XG4iLCIvLyBteUFwcC5jb250cm9sbGVyKCdUZW1wbGF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xuLy8gICAkc2NvcGUudGVtcGxhdGVzID1cbi8vICAgICBbeyBuYW1lOiAnaGVhZGVyJywgdXJsOiAndGVtcGxhdGVzL2hlYWRlci5odG1sJ30sXG4vLyAgICAgIHsgbmFtZTogJ2Zvb3RlcicsIHVybDogJ3RlbXBsYXRlcy9mb290ZXIuaHRtbCd9XTtcbi8vIH1dKTtcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ25hdmJhcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkSG9yaXpvbnRhbCA9IGZhbHNlO1xuICAkc2NvcGUuc2VhcmNoPXtcbiAgICBxdWVyeTogXCJcIixcbiAgICBvcHRpb25zOiBbXCJNb3ZpZXNcIixcIlBlb3BsZVwiLFwiQW55dGhpbmdcIl0sXG4gICAgYnk6IFwiTW92aWVzXCJcbiAgfVxuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS51c3VhcmlvTG9ndWVhZG8gPSB0cnVlO1xuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdidXNjYXJNb3ZpZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCRodHRwKSB7XG5cbiAgJHNjb3BlLm1vdmllcyA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsYScsXG4gICAgICBpZDonMScsXG4gICAgICBvdmVydmlldzonYnVlbmEnXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ2JsZScsXG4gICAgICBpZDonMicsXG4gICAgICBvdmVydmlldzonbWFsYSdcbiAgICB9XG4gIF1cblxuXG4gICAgdmFyIHJlcSA9IHtcbiAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgdXJsOiAnbG9jYWxob3N0OjgwODAvc2VhcmNoL21vdmllL2hvdXNlJyxcbiAgICAgaGVhZGVyczoge1xuICAgICAgICdUb2tlbic6IDEsXG4gICAgICAgVG9rZW46IDEsXG4gICAgICAgJ1Rva2VuJzogJzEnLFxuICAgICAgIFRva2VuOiAnMSdcbiAgICAgfVxuXG4gICAgfVxuXG4gICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubW92aWVzID0gcmVzcG9uc2VcbiAgICB9KTtcblxufSk7XG4iLCIvL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsU2VzaW9uKSB7XG4gICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XG5cbiAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTZXNpb24ubG9naW4oe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmR9KTtcbiAgfTtcbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1Nlc2lvbicsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHNlc2lvbkFjdHVhbCA9IHVuZGVmaW5lZDtcblxuICBzZWxmLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoZW50aWNhdGlvbi9sb2dpbicsY3JlZGVudGlhbHMpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoc2VzaW9uKSB7XG4gICAgICAgIHNlc2lvbkFjdHVhbCA9IHNlc2lvbjtcbiAgICAgICAgYWxlcnQoXCJCaWVudmVuaWRvXCIpO1xuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uIChleGNlcHRpb24pIHtcbiAgICAgICAgYWxlcnQoZXhjZXB0aW9uKTtcbiAgICAgIH0pXG4gIH07XG5cbn0pOyJdfQ==
