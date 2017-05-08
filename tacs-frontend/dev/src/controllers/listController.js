myApp.controller('listControler', function($rootScope, $scope,$state, $stateParams, ListService, Usuario){

	var self = this;
	
	self.movieList
	self.listas

	self.create = function (nombre) {
		ListService.createList(nombre, sesionActual, function (response) {
                self.movieList = response.data;
            })
    }

    self.getListas = fuction () {
    	Usuario.getListas();
    }
});