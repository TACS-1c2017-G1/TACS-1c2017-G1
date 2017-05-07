myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

  $scope.actoresFavoritos = [];

  this.actoresFavoritos = function(){
    Usuario.actoresFavoritos().then(function (actores){
      $scope.actoresFavoritos = actores;
    });
  };


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

  this.actoresFavoritos();
});

