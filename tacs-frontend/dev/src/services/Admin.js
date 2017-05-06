/**
 * Created by aye on 06/05/17.
 */
'use strict';

myApp.service('Admin', function ($http) {

  var self = this;

  self.getUsers = function (sesionActual, callback) {
    return $http.get('http://localhost:8080/admin/user/list', {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

  self.getData = function (sesionActual, id, callback) {
    return $http.get('http://localhost:8080/admin/user/' + id, {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

});