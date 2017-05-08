/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function($scope, BusquedasService, Usuario) {

  var movies = {
    name: "Movies",
    titleLabel: "Titulo",
    url: "movie/",
    mostrarPoster: true
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

  $scope.buscar = function(buscarPor, textoABuscar) {
    if (!textoABuscar)
      return;

    BusquedasService.buscar(buscarPor.url, textoABuscar)
      .then(function(response) {
        if (response.data.results <= 0) {
          alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
          $scope.resultados = [];
        } else
          $scope.resultados = response.data.results;
        $scope.ultimaBusquedaPor = buscarPor;
      })
  };

  $scope.agregarComoFavorito = function(actor) {

    if (actor.media_type !== 'person') {
      alert('Lo que selecciono no es un actor');
      return;
    }

    Usuario.marcarActorFavorito(actor.id)
      .then(function() {
        alert('Actor agregado.')
      });

  };

});
