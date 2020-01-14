import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Pages } from './interfaces/pages';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user_type: any = '0';
  email: any;

  public appPages: Array<Pages>;
  httpOptions = {};
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public device: Device,
    private http: HttpClient
  ) {
    this.appPages = [
      // {
      //   title: 'Lokale',
      //   url: '/home-results',
      //   direct: 'root',
      //   icon: 'home'
      // },
      // {
      //   title: 'Kupony',
      //   url: '/tickets',
      //   direct: 'forward',
      //   icon: 'barcode'
      // },

      // {
      //   title: 'Ulubione',
      //   url: '/favourites',
      //   direct: 'forward',
      //   icon: 'star'
      // },

      // {
      //   title: 'Mapa',
      //   url: '/map-card',
      //   direct: 'forward',
      //   icon: 'pin'
      // },

      // {
      //   title: 'Strona powitalna',
      //   url: '/welcome-page',
      //   direct: 'forward',
      //   icon: 'pin'
      // }

      // {
      //   title: 'Poleć aplikację',
      //   url: 'https://www.facebook.com/Foodiniapp/',
      //   direct: 'forward',
      //   icon: 'share'
      // },

      {
        title: 'Prześlij uwagi',
        url: '/contact',
        direct: 'forward',
        icon: 'mail'
      },

      {
        title: 'O Foodinim',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle'
      },
    ];
    // if(this.platform.pause){
    //   localStorage.clear();
    // }
    this.initializeApp();
  }

  initializeApp() {
    // this.user_type = localStorage.getItem('user_type');
    this.email = this.device.uuid;
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
      this.email = this.device.uuid;
      const post_data = new HttpParams()
			.set('uuid', this.device.uuid);

		return this.http.post('http://repo.foodini.net.pl/auth-api/getUserStatus', post_data, this.httpOptions).subscribe(data=>{
      this.user_type = data;
    });

    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }
}
