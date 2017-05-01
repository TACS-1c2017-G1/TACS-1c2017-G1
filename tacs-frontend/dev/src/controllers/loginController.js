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

