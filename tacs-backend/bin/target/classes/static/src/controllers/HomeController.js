/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function ($scope, BusquedasService, Usuario, ListService) {

    var movies = {
        name: "Movies",
        titleLabel: "Titulo",
        url: "movie/",
        agregarLista: true

    };

    var people = {
        name: "People",
        titleLabel: "Nombre",
        url: "person/",
        agregarFavorito: true
    };

    var anything = {
        name: "Anything",
        titleLabel: "Titulo/Nombre",
        url: "",
        mostrarTipo: true
    };

    var ultimaBusquedaPor = movies;

    $scope.search = {
        query: "",
        options: [movies, people, anything],
        by: movies
    };

    function llenarGrillaDeResultados(buscarPor, textoABuscar) {
        BusquedasService.buscar(buscarPor.url, textoABuscar, $scope.numeroDePagina)
            .then(function (response) {
                if (response.data.results <= 0) {
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
                    $scope.resultados = [];
                } else {
                    $scope.resultados = response.data.results;
                    $scope.cantidadDeResultados = response.data.total_results;
                }
                $scope.ultimaBusquedaPor = buscarPor;
            })
    }

    $scope.buscar = function (buscarPor, textoABuscar) {
        if (!textoABuscar)
            return;

        if (buscarPor.agregarLista)
            Usuario.getListas()
                .then(function (response) {
                    $scope.listas = response.data;
                });

        $scope.numeroDePagina = 1;

        llenarGrillaDeResultados(buscarPor, textoABuscar);
    };

    $scope.agregarComoFavorito = function (actor) {

        if ((actor.media_type == 'person') || ($scope.ultimaBusquedaPor == people)) {
            Usuario.marcarActorFavorito(actor)
                .then(function () {
                    alert('Actor agregado.');
                });
        } else {
            alert('Lo que seleccionó no es un actor');
            return;
        }
    };

    $scope.agregarALista = function (pelicula, lista) {
        if (lista)
            ListService.agregarALista(pelicula, lista)
                .then(function () {
                    alert('Pelicula agregada correctamente.');
                });
    }

    $scope.obtenerPagina = function () {
        llenarGrillaDeResultados($scope.search.by, $scope.search.query);
    }

    $scope.numeroDePagina = 1;

});
