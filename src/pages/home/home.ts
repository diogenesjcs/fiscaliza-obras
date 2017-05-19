import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
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


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  constructionSites: Array<any>;
  errorMessage: any;
  complaintPage = ComplaintPage;

  constructor(private apiService: ApiService, private geolocation: Geolocation,
    private googleMaps: GoogleMaps, public nav: NavController, public toastCtrl: ToastController) { }

  getConstructionSites() {
    this.apiService.getConstructionSites().subscribe(data => {
      this.constructionSites = data;

      this.constructionSites.forEach((cs) => {
        let markerOptions: MarkerOptions = {
          position: new LatLng(cs.lat, cs.lng),
          title: cs.title,
          icon: { url: 'assets/pics/construction-site.png' },
          animation: GoogleMapsAnimation.BOUNCE
        };
        this.map.addCircle({
          'center': new LatLng(cs.lat, cs.lng),
          'radius': cs.complaints * 5,
          'fillColor': '#880000'
        });
        if (cs.complaints > 0) {
          this.map.addMarker(markerOptions).then((marker: Marker) => {
          });
        }
      });


    });

  }
  goToAddComplaint() {
    this.nav.push(ComplaintPage, { cs: this.constructionSites });
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


  ionViewDidEnter() {
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

  loadMap() {
    this.map = new GoogleMap('map');
  }
}
