import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Network } from "@ionic-native/network";

/**
 * Generated class for the OfflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-offline',
  templateUrl: 'offline.html',
})
export class OfflinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public network: Network) {
    this.setOnNetworkConnectListener();
  }

  setOnNetworkConnectListener() {
    let connectSubscription = this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        console.log("network was connected :-)");
        console.log("current network type: " + this.network.type);
        if (this.network.type !== "none") {
          connectSubscription.unsubscribe();
          location.href = "index.html";
        }
      }, 3000);
    });
  }

}
