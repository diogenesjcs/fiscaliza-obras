import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ComplaintsPage } from '../pages/complaints/complaints';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ComplaintPage } from '../pages/complaint/complaint';
import { ProfilePage } from '../pages/profile/profile';
import { ConstructionSitePage } from '../pages/construction-site/construction-site';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
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
import { CameraPreview } from '@ionic-native/camera-preview';
import { Diagnostic } from '@ionic-native/diagnostic';
import {ApiService} from './apiService';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ComplaintsPage,
    SettingsPage,
    HomePage,
    TabsPage,
    ComplaintPage,
    ProfilePage,
    ConstructionSitePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MomentModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ComplaintsPage,
    SettingsPage,
    HomePage,
    TabsPage,
    ComplaintPage,
    ProfilePage,
     ConstructionSitePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Facebook,
    ApiService,
    GoogleMaps,
    CameraPreview,
    Diagnostic,
    Camera,
    InAppBrowser,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //AuthServic
  ]
})
export class AppModule { }
