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

