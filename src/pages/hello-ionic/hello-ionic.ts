
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {GameIonicPage} from  '../../pages/game-ionic/game-ionic';
import { NgModule, ErrorHandler } from '@angular/core';

declare let google: any;
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
  infoWindow: any
  @ViewChild('map') mapElement: ElementRef;
  addressElement: HTMLInputElement = null;
  constructor(public platform: Platform, public alertCtrl: AlertController, public zone: NgZone,public nav:NavController) {
    this.map = null;
    this.platform.ready().then(() => this.loadMaps());

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
        center: { lat: 41.85, lng: -87.65 },
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
        lat: 41.85,
        lng: -87.65

      };

      this.map.setCenter(pos);

      var marker = new google.maps.Marker({
        position: pos,
        map: this.map
      });
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

      var features = [
        {
          position: new google.maps.LatLng(43.85, -87.90),
          type: 'info'
        }, {
          position: new google.maps.LatLng(43.85, -82.90),
          type: 'info'
        }, {
          position: new google.maps.LatLng(44.10, -88.65),
          type: 'info'
        },

        {
          position: new google.maps.LatLng(44.85, -88.65),
          type: 'info'
        },

        {
          position: new google.maps.LatLng(45.85, -88.65),
          type: 'info'
        },
      ];

      // Create markers.
      features.forEach((feature) => {
        var marker = new google.maps.Marker({
          position: feature.position,
          icon: goldStar,
          map: this.map
        });
        this.infoWindow = new google.maps.InfoWindow;

        this.infoWindow.setPosition(feature.position);
        this.infoWindow.setContent('<span>Ruchi</sapn>');
        this.infoWindow.open(this.map, marker);
        marker.addListener('click', () => {
          this.map.setZoom(8);
          this.map.setCenter(marker.getPosition());
          this.openGameDialog();
        });
      });
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: this.map,
        panel: document.getElementById('right-panel')
      });

      directionsDisplay.addListener('directions_changed', function () {
        this.computeTotalDistance(directionsDisplay.getDirections());
      });

      this.displayRoute('Lower West Side, Chicago, IL, USA', 'Herman, WI,  USA', directionsService,
        directionsDisplay);


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
  openWinDialog() {
    this.nav.push(GameIonicPage);
    let alert = this.alertCtrl.create({
      title: 'You Win',
      message: 'Wow you have earn 50 points, walkin to walmart store and reddeem the voucher',
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            console.log('Ok clicked');

          }
        }

      ]
    });
    alert.present();
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

