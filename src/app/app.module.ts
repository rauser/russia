import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider } from '../providers/firebase/firebase';

import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import {LoginPage} from "../pages/login/login";
import { AuthProvider } from '../providers/auth/auth';
import {BinoggelPage} from "../pages/binoggel/binoggel";
import {ExpensesPage} from "../pages/expenses/expenses";
import {SkatPage} from "../pages/skat/skat";
import {SleepPage} from "../pages/sleep/sleep";
import {TicketsPage} from "../pages/tickets/tickets";
import {TravelPage} from "../pages/travel/travel";
import { UsersProvider } from '../providers/users/users';
import {DatePipe} from "@angular/common";
import { VariousProvider } from '../providers/various/various';
import {FileChooser} from "@ionic-native/file-chooser";
import { StorageProvider } from '../providers/storage/storage';
import {AngularFireStorageModule} from "angularfire2/storage";
import {InAppBrowser} from "@ionic-native/in-app-browser";

const firebaseConfig = {
  apiKey: "AIzaSyB_JJ8CMRSKn1l_GB8pi8g_wZgbOGod0Gw",
  authDomain: "russia-wm2018.firebaseapp.com",
  databaseURL: "https://russia-wm2018.firebaseio.com",
  projectId: "russia-wm2018",
  storageBucket: "russia-wm2018.appspot.com",
  messagingSenderId: "931703528244"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    BinoggelPage,
    ExpensesPage,
    SkatPage,
    SleepPage,
    TicketsPage,
    TravelPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    BinoggelPage,
    ExpensesPage,
    SkatPage,
    SleepPage,
    TicketsPage,
    TravelPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
    AngularFireAuth,
    AuthProvider,
    UsersProvider,
    DatePipe,
    VariousProvider,
    StorageProvider,
    InAppBrowser,
    FileChooser,
  ]
})
export class AppModule {}
