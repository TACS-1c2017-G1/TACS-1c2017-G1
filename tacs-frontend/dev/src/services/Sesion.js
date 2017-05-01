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