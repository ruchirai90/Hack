
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { GameIonicPage } from '../../pages/game-ionic/game-ionic';
import { NgModule, ErrorHandler } from '@angular/core';

// let allmarkers = [];
declare let google: any;
let navy: any;
let modal: any;
let shop:any;

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})

@NgModule({
  declarations: [


  ],
  imports: [

  ],
  bootstrap: [],
  entryComponents: [

    GameIonicPage
  ],
  providers: [

  ]
})

export class HelloIonicPage {
  map: any;
  m: any;
  infoWindow: any;
  ruchiArray: any = [];
  features: any;
  public buttonClicked: boolean = false;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  constructor(public platform: Platform, public alertCtrl: AlertController, public zone: NgZone, public nav: NavController) {
    this.map = null;
    this.m = null;
    this.platform.ready().then(() => this.loadMaps());
    this.ruchiArray = [];
    this.features = [
      {
        position: new google.maps.LatLng(46.95, -70.90),
        type: 'info'
      }, {
        position: new google.maps.LatLng(46.85, -73.91),
        type: 'info'
      }, {
        position: new google.maps.LatLng(47.90, -71.91),
        type: 'info'
      },

      {
        position: new google.maps.LatLng(47.85, -70.91),
        type: 'info'
      },

    ];
    navy = this.nav;
    // declare modal
    modal = document.getElementById("ruchipopup1");
    shop = document.getElementById("shoppopup1");
    
    this.m = modal;
  }
  loadMaps() {
    if (!!google) {
      this.initializeMap();
    } else {
      this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
    }
  }

  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.loadMaps();
          }
        }
      ]
    });
    alert.present();
  }
  initializeMap() {
    this.zone.run(() => {
      var mapElement = this.mapElement.nativeElement;

      this.map = new google.maps.Map(mapElement, {
        zoom: 7,
        center: { lat: 44.85, lng: -70.65 },
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });

      // if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition((position)=> {
      var pos = {
        // lat: position.coords.latitude,
        // lng: position.coords.longitude
        lat: 44.85,
        lng: -70.65

      };

      this.map.setCenter(pos);

      var marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        icon: '../assets/imgs/100.png',

      });
      marker.pin
      var goldStar = {
        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 0.3,
        strokeColor: 'gold',
        strokeWeight: 8
      };


      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      var icons = {
        parking: {
          icon: iconBase + 'parking_lot_maps.png'
        },
        library: {
          icon: iconBase + 'library_maps.png'
        },
        info: {
          icon: iconBase + 'info-i_maps.png'
        }
      };




      // Create markers. walmart icon
      this.features.forEach((feature) => {
        var marker = new google.maps.Marker({
          position: feature.position,
          icon: '../assets/imgs/WalmartPlay50.gif',
          animation: google.maps.Animation.DROP,
          map: this.map

        });
        this.ruchiArray.push(marker);

        // this.infoWindow = new google.maps.InfoWindow;

        // this.infoWindow.setPosition(feature.position);
        // this.infoWindow.setContent('<div class="loki"><img src = "../assets/imgs/win_anim.gif"></div>');
        // this.infoWindow.open(this.map, marker);
        marker.addListener('click', () => {
          this.map.setZoom(8);
          this.map.setCenter(marker.getPosition());
          this.openGameDialog();
        });
      }, this);


    })

  }

  openGameDialog() {
    let alert = this.alertCtrl.create({
      title: 'Play Game',
      message: 'Do you want to play game?',
      buttons: [
        {
          text: 'Play',
          role: 'play',
          handler: () => {
            console.log('Play clicked');
            this.openWinDialog();
          }
        }

      ]
    });
    alert.present();
  }
  startNavigation() {

    document.getElementById("ruchipopup1").classList.remove("show");
    this.buttonClicked = true;
    let directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,

    });
    // directionsDisplay.setPanel(this.directionsPanel);

    directionsService.route({
      origin: 'West Central Franklin, ME, USA',
      destination: 'Saint-Jean-de, QC G0A 3W0, Canada',
      travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }

    });
    setTimeout(function(){
      document.getElementById("shoppopup1").classList.add("show");
      
    },5000)

  }


  ionViewDidEnter() {
    debugger;
    if (navy.getViews().length === 2) {
      for (var i in this.ruchiArray) {
        if (this.ruchiArray[i].getPosition().lat() === 46.95 && this.ruchiArray[i].getPosition().lng() ===  -70.90) {
          this.ruchiArray[i].setMap(null);
        }
      }
      var position = new google.maps.LatLng(46.95, -70.90);

      var mymarker = new google.maps.Marker({
        position: position,
        icon: '../assets/imgs/car70.png',
        map: this.map
      });

      mymarker.addListener('click', () => {
        this.map.setZoom(8);
        this.map.setCenter(mymarker.getPosition());
        document.getElementById("ruchipopup1").classList.add("show");
        document.getElementById("ruchiplay-again").addEventListener("click", () => {
          this.startNavigation();
        });
      },this);
    }
  }
  openWinDialog() {
    this.nav.push(GameIonicPage);
  }
  displayRoute(origin, destination, service, display) {
    service.route({
      origin: origin,
      destination: destination,
      // waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
      travelMode: 'DRIVING',
      avoidTolls: true
    }, function (response, status) {
      if (status === 'OK') {
        display.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('total').innerHTML = total + ' km';
  }


  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }
}

