import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(private fb: Facebook,public navCtrl: NavController,public nativeStorage:NativeStorage,public appCtrl: App) {

  }
  logout(){
    console.log("logout");
    this.fb.logout()
    .then(() => {
      this.nativeStorage.remove('user');
      this.appCtrl.getRootNav().setRoot(LoginPage);
    }).catch(e => console.log('Error logout into Facebook', e));
  }

}
