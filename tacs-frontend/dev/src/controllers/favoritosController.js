myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

  $scope.actoresFavoritos = [];

  this.actoresFavoritos = function(){
    Usuario.actoresFavoritos().then(function (actores){
      $scope.actoresFavoritos = actores;
    });
  };
  
  this.actoresFavoritos();
});

