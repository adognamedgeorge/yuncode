import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WholesaleExplainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-explain',
  templateUrl: 'wholesale-explain.html',
})
export class WholesaleExplainPage {
  id: number = 0;
  type: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WholesaleExplainPage');
  }

}
