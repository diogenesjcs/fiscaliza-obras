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
//import { AuthService } from './../providers/auth-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ComplaintsPage,
    SettingsPage,
    HomePage,
    TabsPage,
    ComplaintPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    ComplaintPage
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
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //AuthServic
  ]
})
export class AppModule { }
