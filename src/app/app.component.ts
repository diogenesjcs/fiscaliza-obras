import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, nativeStorage: NativeStorage) {
    platform.ready().then(() => {
      let env = this;
      nativeStorage.getItem('user')
        .then(function(data) {
          env.nav.push(HomePage);
          splashScreen.hide();
        }, function(error) {
          env.nav.push(LoginPage);
          splashScreen.hide();
        });

      statusBar.styleDefault();
    });
  }
}
