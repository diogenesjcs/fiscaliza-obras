import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { Geolocation } from '@ionic-native/geolocation';
import { ComplaintPage } from '../complaint/complaint';
import { ConstructionSitePage } from '../construction-site/construction-site';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { ToastController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  constructionSites: Array<any>;
  errorMessage: any;
  complaintPage = ComplaintPage;
  constructionSitesToAdd: any;

  constructor(private apiService: ApiService, private geolocation: Geolocation,
    private googleMaps: GoogleMaps, public nav: NavController, public toastCtrl: ToastController,
    public platform: Platform, private diagnostic: Diagnostic) {


  }
   applyHaversine(usersLocation, locations) {

    locations.map((location) => {

      let placeLocation = {
        lat: location.lat,
        lng: location.lng
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

  getConstructionSites() {
    this.apiService.getConstructionSites().subscribe(data => {
      this.constructionSites = data;
      if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(position => {
          console.info('using navigator');
          console.info(position.coords.latitude);
          console.info(position.coords.longitude);
          this.constructionSites = this.applyHaversine({ lat: position.coords.latitude, lng: position.coords.longitude }, this.constructionSites);
          this.constructionSites.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });
          this.constructionSitesToAdd = this.constructionSites.slice(0, 5);
        }, error => {
          let resp = {
            lat: -7.9723606,
            lng: -34.8391074
          };
          this.constructionSites = this.applyHaversine(resp, this.constructionSites);
          this.constructionSites.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });
          this.constructionSitesToAdd = this.constructionSites.slice(0, 5);
          console.log(JSON.stringify(error));
        }, options);
      }
      this.constructionSites.forEach((cs) => {

        let markerOptions: MarkerOptions = {
          position: new LatLng(cs.lat, cs.lng),
          icon: { url: 'file:///android_asset/www/assets/pics/construction-site.png' },
          animation: GoogleMapsAnimation.BOUNCE
        };
        this.map.addCircle({
          'center': new LatLng(cs.lat, cs.lng),
          'radius': cs.complaints * 10,
          'fillColor': '#880000'
        });
        if (cs.complaints > 0) {
          this.map.addMarker(markerOptions).then((marker: Marker) => {
            marker.addEventListener(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(e => {
                this.nav.push(ConstructionSitePage, { cs: cs });
              });

          });
        }
      });

    });

  }
  goToAddComplaint() {
    this.nav.push(ComplaintPage, { cs: this.constructionSitesToAdd });
  }
  getLocation() {
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(position => {
        console.info('using navigator');
        console.info(position.coords.latitude);
        console.info(position.coords.longitude);
        this.map.setZoom(12);
        this.map.setCenter(new LatLng(position.coords.latitude, position.coords.longitude));
      }, error => {
        console.log(JSON.stringify(error));
      }, options);
    }

  }

  intMap() {
    if (this.map !== undefined) {
      this.map.clear();
      this.getConstructionSites();
    }
    else {
      this.loadMap();
      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        this.getConstructionSites();
        if (navigator.geolocation) {
          var options = {
            enableHighAccuracy: true
          };

          navigator.geolocation.getCurrentPosition(position => {
            console.info('using navigator');
            console.info(position.coords.latitude);
            console.info(position.coords.longitude);
            this.map.setZoom(12);
            this.map.setCenter(new LatLng(position.coords.latitude, position.coords.longitude));
          }, error => {
            console.log(JSON.stringify(error));
          }, options);
        }
      });
    }
  }


  ionViewDidEnter() {
    this.diagnostic.requestLocationAuthorization()
      .then((state) => {
        console.log(state);
        if (state == this.diagnostic.permissionStatus.GRANTED) {
          this.intMap();
        }
        else {
          this.diagnostic.isLocationAuthorized()
            .then((state2) => {
              if (state2 == this.diagnostic.permissionStatus.GRANTED) {
                this.intMap();
              }
            }).catch(e => console.error(e));
        }
      }).catch(e => console.error(e));



  }

  loadMap() {
    this.map = new GoogleMap('map');
  }
}
