myApp.controller('loginController', function($scope,Sesion) {
  $scope.userName = "";
  $scope.password = "";

  $scope.autenticarse = function () {

    Sesion.login({username: $scope.userName, password: $scope.password});
  };
});

