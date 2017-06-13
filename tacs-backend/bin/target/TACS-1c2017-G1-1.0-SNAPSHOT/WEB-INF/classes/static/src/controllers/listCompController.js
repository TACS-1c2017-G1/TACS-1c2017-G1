myApp.controller('listCompController', function ($rootScope, $scope,$state, $stateParams, ListService) {
    var self = this;
    self.user1 = $stateParams.usersSel[0]
    self.user1List = ""
    self.user2 = $stateParams.usersSel[1]
    self.user2List = ""
    self.intersection = null
    self.sesion = $rootScope.sesionActual;

    self.compare = function () {
        ListService.intersectionOf(self.user1List, self.user2List, self.sesion,
            function (response) {
                self.intersection = response.data;
            })
    }

  self.esAdmin = function () {
    return $rootScope.esAdmin;
  };
});
