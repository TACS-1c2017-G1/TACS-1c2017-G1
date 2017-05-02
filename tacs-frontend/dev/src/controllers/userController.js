myApp.controller('userController', function (Usuario) {
    var self = this;
    self.users = [];

    self.importUsers = function () {
        Usuario.getUsers(sesionActual,
            function (response) {
                self.users = response.data
            })
    }

    self.importUsers();

    self.showUsers = function () {
        return self.users;
    };
});