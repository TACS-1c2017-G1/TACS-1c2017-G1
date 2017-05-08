myApp.controller('fichaPeliculaController', function($scope, $http, $stateParams) {

  $http.get('http://localhost:8080/movie/' + $stateParams.movieId, {
    headers: {
      "Token": '12345'
    }
  }).then(function(response) {
    $scope.movie = response.data;
  })
});
