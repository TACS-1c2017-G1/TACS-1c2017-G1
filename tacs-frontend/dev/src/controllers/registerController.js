'use strict';

myApp
<<<<<<< HEAD
  .controller('registerController', function ($scope, $state, Usuario) {
=======
  .controller('registerController', function ($scope, MainController) {
>>>>>>> a28d904fe56a99f983dce5b6f234ecb2b3f5dddc
    $scope.userName = "";
    $scope.password1 = "";
    $scope.password2 = "";
    $scope.email = "";

    $scope.registerNewUser = function () {
<<<<<<< HEAD
      if ($scope.password1 === $scope.password2) {
        Usuario.register({username: $scope.userName, password: $scope.password1})                     .then(function(response) {
          alert("Usuario creado correctamente!");
          $state.go('login');
        })
          .catch(function(error) {
            alert(error.data.message);
          });
      } else {
        alert("Las passwords no coinciden", "Por favor revisalas antes de enviar el formulario", "error");
      }
    };

    $scope.returnToMain = function () {
      return $state.go('login');
    };

    $scope.contraseniasDistintas = function () {
      return $scope.password1 !== $scope.password2;
    }
=======
      if($scope.password1 === $scope.password2) {
        SweetAlert.swal({
          title: "Registro enviado",
          text: "Espere un momento, por favor",
          duration: 3,
          showConfirmButton: false
        });
        Account.register({userName: $scope.userName, password: $scope.password1, email: $scope.email});
      }else{
        SweetAlert.swal("Las passwords no coinciden", "Por favor revisálas antes de enviar el formulario", "error");
      }
    };

    $scope.returnToMain = function() {
      return navigator.path("/#!/login");
    };
>>>>>>> a28d904fe56a99f983dce5b6f234ecb2b3f5dddc
  });