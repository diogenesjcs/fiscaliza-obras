import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html'
})
export class ComplaintPage {
  constructionSites: Array<any>;
  images: Array<any>;
  thumbs: Array<any>;
  impact: number;
  constructionSite: string;
  description: string;
  lat: number;
  lng: number;
  email: string;
  userLat: number;
  userLng: number;
  userAddress: string;
  usingUserLocation: boolean;
  userId: string;

  constructor(platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiService, private nativeStorage: NativeStorage,
    private alertCtrl: AlertController, private cameraPreview: CameraPreview,
    public toastCtrl: ToastController, private diagnostic: Diagnostic,
    private geolocation: Geolocation, private camera: Camera) {
    this.thumbs = [];
    this.images = [];
    this.constructionSites = this.navParams.get('cs');
    this.userId = "user";
  }
  ionViewDidEnter() {
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true
      };
      navigator.geolocation.getCurrentPosition(position => {
        console.info('using navigator');
        console.info(position.coords.latitude);
        console.info(position.coords.longitude);
        this.userLat = position.coords.latitude;
        this.userLng = position.coords.longitude;
        this.apiService.getMyAddress([position.coords.latitude, position.coords.longitude]).subscribe((data) => {
          this.userAddress = data.results[0].formatted_address;
        });
      }, error => {
        let lat = -7.9723606;
        let lng = -34.8391074;
        this.apiService.getMyAddress([lat, lng]).subscribe((data) => {
          this.userAddress = data.results[0].formatted_address;
        });
      }, options);
    }

  };
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
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg');
      // IMPORTANT: 'jpeg' NOT 'jpg'
      callback(dataUrl)
    }

    image.src = img;
  }
  doImageResizeThumb(img, callback, MAX_WIDTH: number = 50, MAX_HEIGHT: number = 50) {
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

  goToGallery() { };

  goToCamera() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    let obj = this;
    const thumbs = this.thumbs;

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      obj.doImageResizeThumb(base64Image, (data) => {
        thumbs.push(data);
      });
      obj.doImageResize(base64Image, (data) => {
        this.images.push(data);
      }, 400, 400);
    }, (err) => {
      // Handle error
    });
  }


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
            if (navigator.geolocation) {
              var options = {
                enableHighAccuracy: true
              };
              navigator.geolocation.getCurrentPosition(position => {
                console.info('using navigator');
                console.info(position.coords.latitude);
                console.info(position.coords.longitude);
                let complaint = {
                  constructionSiteId : this.constructionSite,
                  impact: Math.floor(this.impact / 10),
                  description: this.description,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  email: "",
                  images: JSON.stringify(this.images)
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

              }, error => {

                let complaint = {
                  constructionSiteId: this.constructionSite,
                  impact: Math.floor(this.impact / 10),
                  description: this.description,
                  lat: -7.9723606,
                  lng: -34.8391074,
                  email: "",
                  images: JSON.stringify(this.images)
                };
                const alertCtrl = this.alertCtrl;
                const apiService = this.apiService;
                const navCtrl = this.navCtrl;
                this.nativeStorage.getItem('user')
                  .then(function (data) {
                    complaint.email = data.email;
                    console.log(JSON.stringify(complaint));
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
                    },
                      (err) => console.log(JSON.stringify(err)),
                      () => { console.log("error") }
                    );
              });
            }, options);
  }


}
        }
      ]
    });
alert.present();
  }

}
