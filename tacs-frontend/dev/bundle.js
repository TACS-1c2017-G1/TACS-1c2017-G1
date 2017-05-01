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

    $scope.usuarioLogueado = false;

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
myApp.controller('buscarMoviesController', function($scope,Sesion) {
  $scope.userName = "";
  $scope.password = "";

  $scope.autenticarse = function () {

    SweetAlert.swal({
      title: "Logeandose",
      text: "Entrando en la Matrix...",
      showConfirmButton: false
    });

    Sesion.login({userName: $scope.userName, password: $scope.password});
  };
});


myApp.service('Account', function ($http, $rootScope, SweetAlert, $location) {


  var self = this;


  self.login = function (credentials) {
    return $http.post('', credentials)
      .then(function (response) {
        return self.getProfile()
      }).then(function (currentProfile) {
        SweetAlert.swal("¡Bienvenido " + currentProfile.userName + "!", "Ingresaste correctamente", "success");
        $location.path('/profile');
        return currentProfile;
      }).catch(function () {
        SweetAlert.swal("Usuario o contraseña invalida", "Por favor complete el formulario de registro o contactese con el Administrador", "error");
        $location.path('/login');
      })
  };

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInRlbXBsYXRlcy5qcyIsImNvbW1vbnMvYm9vdHN0cmFwLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9idXNjYXJNb3ZpZXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci5qcyIsInNlcnZpY2VzL1Nlc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbXlBcHAgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3VpLnJvdXRlcicsJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCddKTtcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xuICB2YXIgc3RhdGVzID0gW3tcbiAgICAgIG5hbWU6ICdsYXlvdXRzJyxcbiAgICAgIHVybDogJycsXG4gICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdoZWFkZXInOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnXG4gICAgICAgIH0sXG4gICAgICAgICdmb290ZXInOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ2hvbWUnLFxuICAgICAgdXJsOiAnLycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9ob21lLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsb2dpbicsXG4gICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICdvdGhlcicsXG4gICAgICB1cmw6ICcvb3RoZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvb3RoZXIuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnbGlzdGFzJyxcbiAgICAgIHVybDogJy9saXN0YXMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcbiAgICAgIHVybDogJy9idXNjYXIvcGVsaWN1bGEvJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdidXNjYXJNb3ZpZXNDb250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2J1c2Nhci9tb3ZpZXMuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICBdXG5cbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxuICBzdGF0ZXMuZm9yRWFjaChmdW5jdGlvbihzdGF0ZSkge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlKTtcbiAgfSk7XG5cbn0pO1xuIiwiLy8gbXlBcHAuY29udHJvbGxlcignVGVtcGxhdGVDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpIHtcbi8vICAgJHNjb3BlLnRlbXBsYXRlcyA9XG4vLyAgICAgW3sgbmFtZTogJ2hlYWRlcicsIHVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCd9LFxuLy8gICAgICB7IG5hbWU6ICdmb290ZXInLCB1cmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnfV07XG4vLyB9XSk7XG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgJHNjb3BlLmlzTmF2Q29sbGFwc2VkID0gdHJ1ZTtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcbiAgJHNjb3BlLnNlYXJjaD17XG4gICAgcXVlcnk6IFwiXCIsXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxuICAgIGJ5OiBcIk1vdmllc1wiXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsJGh0dHApIHtcblxuICAkc2NvcGUubW92aWVzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnYmxhJyxcbiAgICAgIGlkOicxJyxcbiAgICAgIG92ZXJ2aWV3OididWVuYSdcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnYmxlJyxcbiAgICAgIGlkOicyJyxcbiAgICAgIG92ZXJ2aWV3OidtYWxhJ1xuICAgIH1cbiAgXVxuXG5cbiAgICB2YXIgcmVxID0ge1xuICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICB1cmw6ICdsb2NhbGhvc3Q6ODA4MC9zZWFyY2gvbW92aWUvaG91c2UnLFxuICAgICBoZWFkZXJzOiB7XG4gICAgICAgJ1Rva2VuJzogMSxcbiAgICAgICBUb2tlbjogMSxcbiAgICAgICAnVG9rZW4nOiAnMScsXG4gICAgICAgVG9rZW46ICcxJ1xuICAgICB9XG5cbiAgICB9XG5cbiAgICAgICRodHRwKHJlcSkudGhlbihmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tb3ZpZXMgPSByZXNwb25zZVxuICAgIH0pO1xuXG59KTtcbiIsIi8vZmF2b3JpdG9zQ29udHJvbGxlci5qcyIsIm15QXBwLmNvbnRyb2xsZXIoJ2J1c2Nhck1vdmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsU2VzaW9uKSB7XG4gICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XG4gICRzY29wZS5wYXNzd29yZCA9IFwiXCI7XG5cbiAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIFN3ZWV0QWxlcnQuc3dhbCh7XG4gICAgICB0aXRsZTogXCJMb2dlYW5kb3NlXCIsXG4gICAgICB0ZXh0OiBcIkVudHJhbmRvIGVuIGxhIE1hdHJpeC4uLlwiLFxuICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlXG4gICAgfSk7XG5cbiAgICBTZXNpb24ubG9naW4oe3VzZXJOYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmR9KTtcbiAgfTtcbn0pO1xuXG4iLCJteUFwcC5zZXJ2aWNlKCdBY2NvdW50JywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlLCBTd2VldEFsZXJ0LCAkbG9jYXRpb24pIHtcblxuXG4gIHZhciBzZWxmID0gdGhpcztcblxuXG4gIHNlbGYubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnJywgY3JlZGVudGlhbHMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZ2V0UHJvZmlsZSgpXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjdXJyZW50UHJvZmlsZSkge1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoXCLCoUJpZW52ZW5pZG8gXCIgKyBjdXJyZW50UHJvZmlsZS51c2VyTmFtZSArIFwiIVwiLCBcIkluZ3Jlc2FzdGUgY29ycmVjdGFtZW50ZVwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvZmlsZScpO1xuICAgICAgICByZXR1cm4gY3VycmVudFByb2ZpbGU7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFN3ZWV0QWxlcnQuc3dhbChcIlVzdWFyaW8gbyBjb250cmFzZcOxYSBpbnZhbGlkYVwiLCBcIlBvciBmYXZvciBjb21wbGV0ZSBlbCBmb3JtdWxhcmlvIGRlIHJlZ2lzdHJvIG8gY29udGFjdGVzZSBjb24gZWwgQWRtaW5pc3RyYWRvclwiLCBcImVycm9yXCIpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgICB9KVxuICB9O1xuXG59KTsiXX0=
