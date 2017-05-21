import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { ComplaintPage } from '../complaint/complaint';
import { AlertController } from 'ionic-angular';
import { ConstructionSitePage } from '../construction-site/construction-site';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import * as config from '../../app/global';
import { Slides } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment';
import 'moment/min/locales';

@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html'
})
export class ComplaintsPage {
  @ViewChild(Slides) slides: Slides;
  constructionSites: Array<any>;
  complaints: Array<any>;
  constructionSitesToAdd: any;
  user: any;
  commentArea: boolean;
  comment: string;
  searchText: any;
  constructor(public nav: NavController, private apiService: ApiService,
    public view: ViewController, public _DomSanitizationService: DomSanitizer,
    public nativeStorage: NativeStorage, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    moment.locale('pt-br');
    this.commentArea = false;
  }
  goToAddComplaint() {
    this.nav.push(ComplaintPage, { cs: this.constructionSitesToAdd });
  }
  toggleCommentArea(c) {
    let alert = this.alertCtrl.create({
      title: 'Comentário',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Faça um comentário'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            this.sendComment(c);

          }
        }
      ]
    });
    alert.present();
  }
  sendComment(cs) {
    let loading = this.loadingCtrl.create({
      content: 'Enviando...',
      spinner: 'crescent'
    });
    loading.present();
    const comment = {
      text: this.comment,
      email: this.user.email,
      id: cs._id
    }
    this.apiService.addComment(comment).subscribe((data) => {
      loading.dismiss();
      this.comment = "";
      this.commentArea = false;
      let alertOk = this.alertCtrl.create({
        title: 'Comentário enviado',
        subTitle: '',
        buttons: [{
          text: 'fechar',
          handler: () => {
            this.loadComplaints();
          }
        }]
      });
      alertOk.present();
    });

  }
  goToConstructionSite(cs) {
    this.nav.push(ConstructionSitePage, { cs: cs });
  }
  doImageResize(img, callback, MAX_WIDTH: number = 50, MAX_HEIGHT: number = 50) {
    var canvas = document.createElement("canvas");

    var image = new Image();

    image.onload = function () {
      console.log("Size Before: " + image.src.length + " bytes");

      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = 50;
      canvas.height = 50;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg');
      // IMPORTANT: 'jpeg' NOT 'jpg'
      callback(dataUrl)
    }

    image.src = img;
  }

  support(c) {
    this.apiService.toggleComplaint({ email: this.user.email, id: c._id }).subscribe(co => {
      this.complaints = this.complaints.map((complaint) => {
        if (complaint._id === co._id) {
          complaint.supportedBy = co.supportedBy;
          console.log(JSON.stringify(complaint));
        }
        return complaint;
      });
    });
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

  loadComplaints() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...',
      spinner: 'crescent'
    });
    loading.present();
    this.nativeStorage.getItem('user')
      .then(
      data => {
        this.apiService.getUserByEmail(data.email).subscribe((data) => {
          this.user = data;
        });
      },
      error => console.error(error)
      );
    this.constructionSites = [];
    this.apiService.getConstructionSites().subscribe(cs => {
      this.constructionSites = cs;
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
      this.apiService.getComplaints().subscribe(c => {
        this.complaints = c.map((complaint) => {
          complaint.constructionSite = this.constructionSites.find(csData => csData._id == complaint.constructionSite);
          let impact = "";
          switch (complaint.impact) {
            case 0:
              impact = "Se sentiu muito pouco impactado pela obra.";
              break;
            case 1:
              impact = "Se sentiu pouco impactado pela obra.";
              break;
            case 2: impact = "Se sentiu moderadamente impactado pela obra.";
              break;
            case 3: impact = "Se sentiu impactado pela obra.";
              break;
            case 4: impact = "Se sentiu muito impactado pela obra.";
              break;
            case 5: impact = "Se sentiu muito impactado pela obra.";
              break;
          }
          complaint.impact = impact;
          return complaint;
        });
        this.complaints.sort((c1, c2) => {
          return moment(new Date(c2.createdAt)).valueOf() - moment(new Date(c1.createdAt)).valueOf();
        });
        loading.dismiss();
      });
    });
  }
  ionViewDidEnter() {
    this.loadComplaints();


  }

}
