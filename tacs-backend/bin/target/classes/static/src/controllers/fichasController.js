myApp.controller('fichaPeliculaController', function($scope, $http, $stateParams) {

  $http.get(settings.apiUrl+'movie/' + $stateParams.movieId, {
    headers: {
      "Token": '12345'
    }
  }).then(function(response) {
    $scope.movie = response.data;
  })
});
