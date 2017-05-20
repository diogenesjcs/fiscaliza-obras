import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiService } from '../../app/apiService';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';
import { Diagnostic } from '@ionic-native/diagnostic';

declare var google;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(private fb: Facebook, public navCtrl: NavController, 
  private apiService: ApiService, public nativeStorage: NativeStorage
  , private diagnostic: Diagnostic) {

  }
  ionViewWillEnter() {
    let nav = this.navCtrl;
    this.fb.getLoginStatus().then((res: FacebookLoginResponse) => {
      if (res.status == "connected")
        nav.push(TabsPage);
    });
  }

  ionViewDidLoad() {
    this.loadMap();

  }
  doFbLogin() {
    let nav = this.navCtrl;
    let nativeStorage = this.nativeStorage;
    let apiService = this.apiService;
    this.diagnostic.requestLocationAuthorization()
      .then((state) => {

        this.fb.login(['email', 'public_profile'])
          .then((res: FacebookLoginResponse) => {
            console.log('Logged into Facebook!', res);
            let userId = res.authResponse.userID;
            let params = new Array();

            //Getting name and gender properties
            this.fb.api("/me?locale=pt_BR&fields=email,name,gender", ['public_profile', 'email'])
              .then(function (user) {
                user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                apiService.addUser({
                  name: user.name,
                  gender: user.gender,
                  picture: user.picture,
                  email: user.email
                }).subscribe(data => {
                  console.log(JSON.stringify(data));
                  nativeStorage.setItem('user',
                    {
                      name: user.name,
                      gender: user.gender,
                      picture: user.picture,
                      email: user.email
                    })
                    .then(function () {
                      nav.setRoot(TabsPage);
                    }, function (error) {
                      console.log(error);
                    })
                });

              })

          })
          .catch(e => console.log('Error logging into Facebook', e));
      });
  }

  loadMap() {

    let latLng = new google.maps.LatLng(-7.9686524, -34.8352986);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [
            { visibility: "off" }
          ]
        },
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        }
      ]
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }
}
