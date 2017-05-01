myApp.service('Sesion', function ($http, $location) {
  var self = this;


  self.login = function (credentials) {
    return $http({
      method:'POST',
      url: 'http://localhost:8080/authentication/login',
      data: JSON.stringify(credentials)
    })
      .then(function (response) {
        return self.getProfile()
      }).then(function (currentProfile) {
        alert("¡Bienvenido " + currentProfile.userName + "!", "Ingresaste correctamente", "success");
        $location.path('/home');
        return currentProfile;
      }).catch(function () {
        alert("Usuario o contraseña invalida", "Por favor complete el formulario de registro o contactese con el Administrador", "error");
        $location.path('/login');
      })
  };

});