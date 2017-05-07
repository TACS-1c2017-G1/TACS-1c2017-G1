/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http) {

    var self = this;

    self.register = function (credentials) {
        return $http.post('http://localhost:8080/user/', credentials);
    };

    self.getRecMovies = function (sesion,callback) {
        return $http.get('http://localhost:8080/user/favoriteactor/movies',{
            headers: {'token': sesion.idSesion}
        }).then(callback);
    }


});