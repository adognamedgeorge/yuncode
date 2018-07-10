import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from "@ionic-native/network";

import { LaunchScreenPage } from "../pages/common/launch-screen/launch-screen";
import { OfflinePage } from "../pages/common/offline/offline";
declare var screen :any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild("rootNav") navCtrl: NavController;
  rootPage:any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public network: Network) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.setRootPage();
      this.setOnNetworkDisconnectedListener();
      //  禁止横屏
      screen.orientation.lock('portrait');
    });
  }

  setRootPage() {
    this.rootPage = this.network.type === "none" ? OfflinePage : LaunchScreenPage;
  }

  setOnNetworkDisconnectedListener() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      setTimeout(() => {
        console.log("network was disconnected :-(");
        console.log("current network type: " + this.network.type);
        if (this.network.type === "none") {
          this.navCtrl.setRoot(OfflinePage)
            .then(() => {
              disconnectSubscription.unsubscribe();
            });
        }
      }, 3000);
    });
  }



}

