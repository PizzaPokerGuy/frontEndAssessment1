let app = angular.module('app', ['ngRoute']);

app.controller('fundsCtrl', function ($scope, $http, $interval, $location) {
    let vm = $scope;
     let time = 0;
    // vm.details = {url:"details.html"};
    vm.newFund = {
        Id: null
    }
    //Timer variable
    vm.timer = null;
    //Gets initial funds list
    vm.getFunds = function () {
        $http.get("http://iwg-prod-web-interview.azurewebsites.net/stem/v1/funds").success(function (data) {
            console.log(data);
            vm.fundsData = data;
        });
      
    }

    //Gets details about a specific fund
    vm.getFundDetails = function (fund) {
        $http.get(`http://iwg-prod-web-interview.azurewebsites.net/stem/v1/funds/${fund.Id}`).success(function (data) {
            console.log(data);
            vm.detailData = data;
        });
    };

    //Adds a fund
    vm.addFund = function (newFund) {
        $http.post("http://iwg-prod-web-interview.azurewebsites.net/stem/v1/funds", newFund).success(function (response) {
            console.log(response)
            console.log(response.data);
        }).error(function (data, status) {
            console.log(data);
            console.log(status);
        }).finally(function () {
            //Updates the fund array to current version
            vm.getFunds();
        });
    }

    //Edits a fund
    vm.editFund = function (detailData) {
        $http.put(`http://iwg-prod-web-interview.azurewebsites.net/stem/v1/funds/${detailData.Id}`, detailData).then(function (response) {
            console.log('Success');
            console.log(response);
        },
            function (response) {
                console.log('Failure');
                console.log(response);
            }).finally(function(){
                //Updates the fund array to current version
            vm.getFunds();
            });

    };

//Starts the timer
vm.timedUpdate = function(){
  
    vm.timer = $interval(function(){
        time += 1000;
        if(time === 120000){
            vm.getFundDetails({Id: 2});
            $("#detailsModal").modal();
            $location.path('details')
            $interval.cancel(vm.timer);
        }
        console.log(time);
    }, 1000)
}

    vm.timedUpdate();
    vm.getFunds();
}).config(function($routeProvider){
    $routeProvider
    .when('/details', {
        templateUrl: 'details.html',
        controller:'fundsCtrl'
    })
    .otherwise({
        redirectTo: ''
    })
});