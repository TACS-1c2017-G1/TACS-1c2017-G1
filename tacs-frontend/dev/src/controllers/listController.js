myApp.controller('listController', function ($rootScope, $scope, $state, $stateParams, ListService, Usuario) {

    var self = this;
    $scope.listas = [];

    $scope.create = function (nombre) {
        ListService.createList(nombre)
            .then(function (response) {
                $scope.movieList = response.data;
                $scope.listas.push(response.data);
                alert('Lista creada con exito.')
                $scope.nombre = undefined;
            })
    }

    self.getListas = function () {
        Usuario.getListas()
            .then(function (response) {
                $scope.listas = response.data;
            });
    }

    self.cleanSelected = function () {
        self.intersection = undefined;
        $scope.listas.map(function (l) {
            l.selected = false;
        })
    }
    
    self.getActores = function (id) {
        ListService.getAct($rootScope.sesionActual, id,
            function (response) {
                self.actores = response.data;
            })
    }

    self.compareSelected = function () {
        self.listasSelec = $scope.listas.filter(function (list) {
            return list.selected
        })
        if (self.listasSelec.length != 2) {
            self.errorMessage = "Seleccione sólo dos listas"
        }
        else if (self.listasSelec.some(function (e) {
                return e.movies.length === 0
            })) {
            self.errorMessage = "Una de las listas no posee películas"
        }
        else {
            ListService.intersectionOf(self.listasSelec[0], self.listasSelec[1], $rootScope.sesionActual,
                function (response) {
                    self.intersection = response.data;
                })
        }
    }

    $scope.quitarDeLista = function (peliculaAQuitar,list) {
        ListService.quitarDeLista(peliculaAQuitar,list).then(function () {
          alert('Pelicula quitada correctamente.');
          var movies = $scope.listas.filter(lista => lista.id === list.id)[0].movies;

          movies.splice(movies.indexOf(peliculaAQuitar),1);

        });
    };


    self.getListas();

});