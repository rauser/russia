import {Component, ViewChild} from '@angular/core';
import {MenuController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {AuthProvider} from "../providers/auth/auth";
import {ExpensesPage} from "../pages/expenses/expenses";
import {TravelPage} from "../pages/travel/travel";
import {SleepPage} from "../pages/sleep/sleep";
import {TicketsPage} from "../pages/tickets/tickets";
import {SkatPage} from "../pages/skat/skat";
import {BinoggelPage} from "../pages/binoggel/binoggel";

export interface PageInterface {
  title: string;
  component: any;
  iconname: string;
  logsOut?: boolean;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  pages: PageInterface[] = [
    { title: 'Start', component: HomePage, iconname:'home' },
    { title: 'Ausgaben', component: ExpensesPage, iconname:'cash' },
    { title: 'Reisen', component: TravelPage, iconname:'plane' },
    { title: 'Unterkünfte', component: SleepPage, iconname:'home' },
    { title: 'Tickets', component: TicketsPage, iconname:'document' },
    { title: 'Skat', component: SkatPage, iconname:'game-controller-a' },
    { title: 'Binoggel', component: BinoggelPage, iconname:'game-controller-b' },
  ];

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private auth: AuthProvider,
              private menu: MenuController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.menu = menu;
      this.initializeApp();
    });
  }

  initializeApp(){
    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.rootPage = HomePage;
          } else {
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
      );
  }

  login() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(HomePage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
