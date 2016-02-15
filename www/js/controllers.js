angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,$http,$timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.regisData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


  $scope.registerdata = function() {
    var firstname = $scope.regisData.firstname;
    var lastname = $scope.regisData.lastname;
    var phone = $scope.regisData.phone;
    var address = $scope.regisData.address;
    var idtype = $scope.regisData.idtype;
    var noid =  $scope.regisData.noid;
    var email = $scope.regisData.email;
    var password =$scope.regisData.password;
    var gender = $scope.regisData.gender;
    if (gender == "Pria"){
          gender = "Male";
    }else{
        gender = "Female";
    }
    var nameemergency = $scope.regisData.nameemergency;
    var phoneemergency = $scope.regisData.phoneemergency;
    var addressemergency = $scope.regisData.addressemergency;
    // var test = $scope.regisData;
    // var json = JSON.stringify(test);
    // console.log(json);

    $http.post('https://bukost-kudaponi.c9users.io/register?accesskey=jSMOWnoPFgsHVpMvz5VrIt5kRbzGpI8u9EF1iFQyJQ=', { 
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      address: address,
      idtype: idtype,
      noid: noid,
      email: email,
      password: password,
      gender: gender,
      nameemergency: nameemergency,
      addressemergency: addressemergency,
      phoneemergency: phoneemergency 
    }).success(function(response){
      var records = response.result;
      console.log(records);
       if (records != ""){
        $location.path("/app");  
       }else{
          
       }
    });
  };


  $scope.closeregister = function() {
    $scope.modal.hide();
    // $scope.registermodal.show();
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})   

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MapCtrl', function($scope, $http, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    // POST
    // $http.post('http://192.168.1.113:3000/getnearbykost', {
    $http.post('https://bukost-kudaponi.c9users.io/getnearbykost?accesskey=jSMOWnoPFgsHVpMvz5VrIt5kRbzGpI8u9EF1iFQyJQ=', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }).success(function(response){
      // SET MARKER
      var image = "img/kost-marker-small.png";
      var records = response.result;
      console.log(records);
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOptions = {
        center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        // SELF MARKER
        var selfpos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var selfmarker = new google.maps.Marker({
          map: $scope.map,
          position: selfpos,
          icon: "img/self-small.png"
        });

        addInfoWindow(selfmarker, 'Me', records);
        // SELF MARKER

        for(var i=0;i<records.length;i++){
          var markerpos = new google.maps.LatLng(records[i].latitude, records[i].longitude);
          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: markerpos,
            icon: image
          });      

          var popupmarker = "<p style='font-wight: bold;'>"+ records[i].name +"</p>" +
                            "<br/>" +
                            "<button style='border-radius: 3px;'>See detail >></button>"

          addInfoWindow(marker, popupmarker, records);
        }
      });

      var addInfoWindow = function(marker, message, record){
        var infoWindow = new google.maps.InfoWindow({
          content: message
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        });
      };
      // SET MARKER
    });
    // POST

    // POPULER KOST
    $scope.populers = [{data: "This is something"},{data: "something else"},{data: "another thing"},{data: "it keeps going"},{data: "seemingly forever..."},{data: "and forever..."},{data: "and forever..."},{data: "and forever..."},{data: "and forever..."},{data: "and forever..."},{data: "and forever..."}];
    // POPULER KOST

  }, function(error){
    console.log("Could not get location");
  });
});