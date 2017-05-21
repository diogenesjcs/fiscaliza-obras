import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(private fb: Facebook, public navCtrl: NavController,
    public nativeStorage: NativeStorage, public appCtrl: App,
    private iab: InAppBrowser, private alertCtrl: AlertController) {

  }
  openBrowser() {
    const browser = this.iab.create('http://www.obrasil.tk/', '_system');
  }
  logout() {
    let alert = this.alertCtrl.create({
      title: 'Sair?',
      message: 'Deseja fazer logout?',
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
            this.fb.logout()
              .then(() => {
                this.nativeStorage.remove('user');
                this.appCtrl.getRootNav().setRoot(LoginPage);
              }).catch(e => console.log('Error logout into Facebook', e));
          }
        }
      ]
    });
    alert.present();

  }

}
