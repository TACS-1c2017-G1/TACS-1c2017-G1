myApp.controller('loginController', function($scope,Sesion) {
  $scope.userName = "";
  $scope.password = "";

  $scope.autenticarse = function () {

    alert({
      title: "Logeandose",
      showConfirmButton: false
    });

    Sesion.login({userName: $scope.userName, password: $scope.password});
  };
});

