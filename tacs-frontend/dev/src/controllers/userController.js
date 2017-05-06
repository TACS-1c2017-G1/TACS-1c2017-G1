myApp.controller('userController', function ($rootScope,$scope,$state,Usuario) {
    var self = this;
    self.users = [];
    self.selectedUser ="";
    self.visibleData = false;

    self.importUsers = function () {
        Usuario.getUsers(sesionActual,
            function (response) {
                self.users = response.data
            })
    }

    self.importUsers();

    self.dateFormat = function(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '/' + month + '/' + year;
    }

    self.showUsers = function () {
        return self.users;
    };

    self.getUsername = function () {
        try{
            if (self.selectedUser.credencial===null){
                return "Sin Username"
            }
            else
            {
                return self.selectedUser.credencial.username;
            }
        }
        catch(e){

        }


    }

    self.getLastAccess = function () {
        try{
            if (self.selectedUser.lastAccess===null){
                return "No inició sesión"
            }
            else
            {
                var d = new Date(self.selectedUser.lastAccess);
                console.log(d.toDateString())
                return self.dateFormat(d);
            }
        }
        catch(e){

        }

    }

    self.numList = function () {
        try{
            if (self.selectedUser.lists === null){
                return "No hay información"
            }
            else
            {
                return self.selectedUser.lists.length
            }
        }
        catch(e){

        }
    }

    self.getMovies = function () {
        try{
            if (self.selectedUser.lists === null){
                return "No hay información"
            }
            else
            {
                return self.selectedUser.lists
            }
        }
        catch(e){

        }
    }

    self.numFavAct = function () {
        try{
            if (self.selectedUser.favoriteActors === null){
                return "No hay información"
            }
            else
            {
                return self.selectedUser.favoriteActors.length
            }
        }
        catch(e){

        }


    }

    self.hide = function () {
        self.visibleData = false;
    }
    
    self.getInfo = function(id){
        Usuario.getData(sesionActual,id,
            function (response) {
                self.selectedUser = response.data;
                self.visibleData = true;

            })
    }

});