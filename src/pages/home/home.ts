import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ApiService} from '../../app/apiService';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';


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

  getConstructionSites() {
    this.apiService.getConstructionSites().subscribe(data => {
      this.constructionSites = data;

      this.constructionSites.forEach((cs) => {
        let markerOptions: MarkerOptions = {
          position: new LatLng(cs.lat, cs.lng),
          title: 'Ionic'
        };
        this.map.addMarker(markerOptions);
      });

    });

  }
  ngAfterViewInit() {
    this.loadMap();
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      this.getConstructionSites();
      this.geolocation.getCurrentPosition().then((resp) => {
        this.map.moveCamera(new LatLng(resp.coords.latitude, resp.coords.longitude));
      }).catch((error) => {
        console.log('Error getting location', error);
      });
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
      });
    });
  }

  constructor(private apiService: ApiService, private geolocation: Geolocation, private googleMaps: GoogleMaps) {


  }

  ionViewDidLoad() {


  }
  // ionViewWillEnter() {
  //   document.querySelector('.transport-page').setAttribute("hidden", "");
  // }
  //
  // ionViewWillLeave() {
  //   document.querySelector('.transport-page').removeAttribute("hidden");
  // }

  loadMap() {
    // make sure to create following structure in your view.html file
    // and add a height (for example 100%) to it, else the map won't be visible
    // <ion-content>
    //  <div #map id="map" style="height:100%;"></div>
    // </ion-content>

    // create a new map by passing HTMLElement
    this.map = new GoogleMap('map');

    let location = new LatLng(-8.000000, -34.8352986);
    this.map.moveCamera(location);



  }
}
