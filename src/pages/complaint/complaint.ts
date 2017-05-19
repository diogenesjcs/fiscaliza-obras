import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html'
})
export class ComplaintPage {
  constructionSites: Array<any>;
  impact: number;
  constructionSite: string;
  description: string;
  lat: number;
  lng: number;
  email: string;

  constructor(platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiService, private nativeStorage: NativeStorage,
    private alertCtrl: AlertController, private cameraPreview: CameraPreview,
    public toastCtrl: ToastController, private diagnostic: Diagnostic,
    private geolocation: Geolocation) {
    this.constructionSites = this.navParams.get('cs');
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
        this.constructionSites = this.constructionSites.slice(0, 5);
      }, error => {
        let resp = {
        lat: -7.9723606,
        lng: -34.8391074
      };
      this.constructionSites = this.applyHaversine(resp, this.constructionSites);
      this.constructionSites.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });
      this.constructionSites = this.constructionSites.slice(0,5);
        console.log(JSON.stringify(error));
      }, options);
    }

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

  getCamera() { };
  getGallery() { };



  confirmComplaint() {
    let alert = this.alertCtrl.create({
      title: 'Enviar a denúncia?',
      message: 'Deseja enviar a denúncia?',
      buttons: [
        {
          text: 'não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'sim',
          handler: () => {
            let complaint = {
              constructionSiteId: this.constructionSite,
              impact: Math.floor(this.impact / 10),
              description: this.description,
              lat: -7.9723606,
              lng: -34.8391074,
              email: ""
            };
            const alertCtrl = this.alertCtrl;
            const apiService = this.apiService;
            const navCtrl = this.navCtrl;
            this.nativeStorage.getItem('user')
              .then(function (data) {
                complaint.email = data.email;
                apiService.addComplaint(complaint).subscribe(data => {
                  let alertOk = alertCtrl.create({
                    title: 'Denúncia enviada',
                    subTitle: 'Obrigado por contribuir para uma cidade melhor!',
                    buttons: [{
                      text: 'fechar',
                      handler: () => {
                        navCtrl.pop();
                      }
                    }]
                  });
                  alertOk.present();
                });
              });

          }
        }
      ]
    });
    alert.present();
  }

}
