import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Events} from 'ionic-angular';

/**
 * Generated class for the WholesaleSalesReturnModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-sales-return-modal',
  templateUrl: 'wholesale-sales-return-modal.html',
})
export class WholesaleSalesReturnModalPage {
  items = [];
  loading : boolean = this.navParams.get('loading');
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public events: Events) {
    this.items = this.navParams.get('item');
    events.subscribe('infinite', (res) => {
      if (res['infiniteScroll']) {
        this.items = res['items'];
        res['infiniteScroll'].complete();
      }
    });
    events.subscribe('loadOver', (res) => {
      if (res) {
        this.loading = false;
      }
    });
  }
  /*
    关闭模板
     */
  modalClose () {
    this.viewCtrl.dismiss();
  }
  // 下拉加载
  doInfinite(infiniteScroll) {
    this.events.publish('infiniteScroll', infiniteScroll)
  }
}
